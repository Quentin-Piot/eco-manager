import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";

const SESSION_KEY = "@user_session";
const SESSION_EXPIRY_KEY = "@session_expiry";
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 jours en millisecondes

interface SessionData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  timestamp: number;
}

export class SessionService {
  private static instance: SessionService;

  private constructor() {}

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  /**
   * Sauvegarde la session utilisateur
   */
  public async saveSession(user: User): Promise<void> {
    try {
      const sessionData: SessionData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        timestamp: Date.now(),
      };

      const expiryTime = Date.now() + SESSION_DURATION;

      await Promise.all([
        AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionData)),
        AsyncStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString()),
      ]);

      console.log("Session sauvegardée avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la session:", error);
    }
  }

  /**
   * Récupère la session utilisateur si elle est valide
   */
  public async getSession(): Promise<SessionData | null> {
    try {
      const [sessionDataStr, expiryTimeStr] = await Promise.all([
        AsyncStorage.getItem(SESSION_KEY),
        AsyncStorage.getItem(SESSION_EXPIRY_KEY),
      ]);

      if (!sessionDataStr || !expiryTimeStr) {
        return null;
      }

      const expiryTime = parseInt(expiryTimeStr, 10);
      const now = Date.now();

      // Vérifier si la session a expiré
      if (now > expiryTime) {
        console.log("Session expirée, suppression...");
        await this.clearSession();
        return null;
      }

      const sessionData: SessionData = JSON.parse(sessionDataStr);
      console.log("Session récupérée avec succès");
      return sessionData;
    } catch (error) {
      console.error("Erreur lors de la récupération de la session:", error);
      return null;
    }
  }

  /**
   * Vérifie si une session valide existe
   */
  public async hasValidSession(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  }

  /**
   * Supprime la session
   */
  public async clearSession(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(SESSION_KEY),
        AsyncStorage.removeItem(SESSION_EXPIRY_KEY),
      ]);
      console.log("Session supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de la session:", error);
    }
  }

  /**
   * Étend la durée de la session
   */
  public async extendSession(): Promise<void> {
    try {
      const session = await this.getSession();
      if (session) {
        const newExpiryTime = Date.now() + SESSION_DURATION;
        await AsyncStorage.setItem(
          SESSION_EXPIRY_KEY,
          newExpiryTime.toString(),
        );
        console.log("Session étendue avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de l'extension de la session:", error);
    }
  }

  /**
   * Obtient le temps restant avant expiration (en millisecondes)
   */
  public async getTimeUntilExpiry(): Promise<number> {
    try {
      const expiryTimeStr = await AsyncStorage.getItem(SESSION_EXPIRY_KEY);
      if (!expiryTimeStr) {
        return 0;
      }

      const expiryTime = parseInt(expiryTimeStr, 10);
      const now = Date.now();
      return Math.max(0, expiryTime - now);
    } catch (error) {
      console.error("Erreur lors du calcul du temps d'expiration:", error);
      return 0;
    }
  }
}

export const sessionService = SessionService.getInstance();
