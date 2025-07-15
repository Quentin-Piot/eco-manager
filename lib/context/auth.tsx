import React, {createContext, ReactNode, useContext, useEffect, useState,} from "react";
import {User} from "firebase/auth";
import {authService} from "~/lib/services/auth.service";
import {cloudStorageService} from "~/lib/services/cloud-storage.service";
import {Platform} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {AuthSessionResult, makeRedirectUri} from "expo-auth-session";
import {getUserData, saveUserData} from "~/lib/storage/user-storage";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<AuthSessionResult | undefined>;
  signOut: () => Promise<void>;
  syncDataToCloud: () => Promise<void>;
  restoreDataFromCloud: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Attendre l'initialisation du service d'authentification
        await authService.waitForInitialization();

        // Vérifier s'il y a une session locale valide si pas d'utilisateur Firebase
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          const hasLocalSession = await authService.hasLocalSession();
          if (hasLocalSession) {
            const localSession = await authService.getLocalSession();
            console.log('Session locale trouvée:', localSession?.email);
            // Créer un objet utilisateur temporaire basé sur la session locale
            if (localSession) {
              const tempUser = {
                uid: localSession.uid,
                email: localSession.email,
                displayName: localSession.displayName,
                photoURL: localSession.photoURL,
              } as User;
              setUser(tempUser);
            }
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    return authService.onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);
      if (isInitialized) {
        setIsLoading(false);
      }
    });
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      setIsLoading(false);
    }
  }, [isInitialized]);

  const googleAuthConfig = authService.getGoogleAuthConfig();
  const SCOPES = ["openid", "https://www.googleapis.com/auth/userinfo.email"];

  const redirectUri =
    Platform.OS === "web"
      ? undefined
      : makeRedirectUri({
          scheme: "com.quenpiot.ecomanager",
          path: "/",
        });
  const [request, response, promptAsync] = Google.useAuthRequest({
    ...googleAuthConfig,
    scopes: SCOPES,
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const handleGoogleResponse = async () => {
        try {
          setIsLoading(true);
          const { id_token } = response.params;
          const user = await authService.signInWithGoogleCredential(id_token);
        } catch (error) {
          console.error("Error handling Google response:", error);
        } finally {
          setIsLoading(false);
        }
      };

      void handleGoogleResponse();
    }
  }, [response]);

  const signInWithGoogle = async (): Promise<AuthSessionResult | undefined> => {
    try {
      setIsLoading(true);

      if (Platform.OS === "web") {
        await authService.signInWithGoogleWeb();
        return undefined;
      } else {
        return promptAsync();
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      if (Platform.OS === "web") {
        setIsLoading(false);
      }
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const syncDataToCloud = async () => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const userData = await getUserData();

      if (userData) {
        await cloudStorageService.saveFinancialData({
          transactions: userData.transactions || [],
          monthlyBudget: userData.monthlyBudget || null,
          spendingCategories: userData.spendingCategories || [],
        });
      }
    } catch (error) {
      console.error("Error syncing data to cloud:", error);
      throw error;
    }
  };

  const restoreDataFromCloud = async () => {
    if (!user) {
      return;
    }

    try {
      const cloudData = await cloudStorageService.getFinancialData();

      if (cloudData) {
        await saveUserData({
          transactions: cloudData.transactions,
          monthlyBudget: cloudData.monthlyBudget,
          spendingCategories: cloudData.spendingCategories,
        });
      }
    } catch (error) {
      console.error("Error restoring data from cloud:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
    syncDataToCloud,
    restoreDataFromCloud,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
