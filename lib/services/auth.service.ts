import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "~/lib/config/firebase";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
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

  public async signInWithGoogleWeb(): Promise<User | null> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google:", error);
      throw error;
    }
  }

  public async signInWithGoogleCredential(
    idToken: string,
  ): Promise<User | null> {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      return result.user;
    } catch (error) {
      console.error(
        "Erreur lors de la connexion avec les identifiants Google:",
        error,
      );
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

  public async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error;
    }
  }

  public onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
}

export const authService = AuthService.getInstance();
