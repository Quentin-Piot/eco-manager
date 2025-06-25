import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "~/lib/config/firebase";
import { sessionService } from "~/lib/services/session.service";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {
    this.initializationPromise = this.initialize();
  }

  public async waitForInitialization(): Promise<void> {
    if (this.initializationPromise) {
      await this.initializationPromise;
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async signInWithGoogleWeb(): Promise<User | null> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await sessionService.saveSession(result.user);
      }
      return result.user;
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google:", error);
      throw error;
    }
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public getUserId(): string | null {
    return this.currentUser?.uid || null;
  }

  public async signInWithGoogle(): Promise<User | null> {
    return this.signInWithGoogleWeb();
  }

  public async signInWithGoogleCredential(
    idToken: string,
  ): Promise<User | null> {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      if (result.user) {
        await sessionService.saveSession(result.user);
      }
      return result.user;
    } catch (error) {
      console.error(
        "Erreur lors de la connexion avec les identifiants Google:",
        error,
      );
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    try {
      await Promise.all([signOut(auth), sessionService.clearSession()]);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error;
    }
  }

  public getGoogleAuthConfig() {
    return {
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    };
  }

  public onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        await sessionService.extendSession();
      }
      callback(user);
    });
  }

  /**
   * Vérifie s'il y a une session locale valide
   */
  public async hasLocalSession(): Promise<boolean> {
    return await sessionService.hasValidSession();
  }

  /**
   * Récupère les données de session locale
   */
  public async getLocalSession() {
    return await sessionService.getSession();
  }

  /**
   * Nettoie la session locale
   */
  public async clearLocalSession(): Promise<void> {
    await sessionService.clearSession();
  }

  private async initialize(): Promise<void> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        this.currentUser = user;

        if (user) {
          // Sauvegarder la session quand l'utilisateur est connecté
          await sessionService.saveSession(user);
        } else {
          // Vérifier s'il y a une session locale valide
          const localSession = await sessionService.getSession();
          if (localSession && !this.isInitialized) {
            console.log("Session locale trouvée, tentative de restauration...");
            // Ne pas essayer de restaurer automatiquement, laisser l'app gérer
          }
        }

        if (!this.isInitialized) {
          this.isInitialized = true;
          resolve();
        }
      });
    });
  }
}

export const authService = AuthService.getInstance();
