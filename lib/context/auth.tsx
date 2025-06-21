import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "firebase/auth";
import { authService } from "~/lib/services/auth.service";
import { cloudStorageService } from "~/lib/services/cloud-storage.service";
import { Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { AuthSessionResult, makeRedirectUri } from "expo-auth-session";

// Configure WebBrowser for Expo
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

  useEffect(() => {
    return authService.onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });
  }, []);

  // Google Auth hook for mobile
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

  // Handle Google Auth response
  useEffect(() => {
    if (response?.type === "success") {
      const handleGoogleResponse = async () => {
        try {
          setIsLoading(true);
          const { id_token } = response.params;
          const user = await authService.signInWithGoogleCredential(id_token);
          // Don't automatically restore data here - let the calling component handle it
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
        // Don't automatically restore data here - let the calling component handle it
        return undefined;
      } else {
        // For mobile, trigger the auth request
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
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const syncDataToCloud = async () => {
    if (!authService.isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    try {
      // Import storage functions dynamically to avoid circular dependencies
      const { getUserData } = await import("~/lib/storage/user-storage");

      // Get current local financial data
      const userData = await getUserData();

      if (userData) {
        // Sync financial data to cloud
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
    if (!authService.isAuthenticated()) {
      return;
    }

    try {
      // Import storage functions dynamically to avoid circular dependencies
      const { saveUserData } = await import("~/lib/storage/user-storage");

      // Get financial data from cloud
      const cloudData = await cloudStorageService.getFinancialData();

      console.log("c", cloudData);
      if (cloudData) {
        // Restore financial data to local storage
        await saveUserData({
          transactions: cloudData.transactions,
          monthlyBudget: cloudData.monthlyBudget,
          spendingCategories: cloudData.spendingCategories,
        });
      }
    } catch (error) {
      console.error("Error restoring data from cloud:", error);
      // Don't throw error here as we want the app to continue working even if cloud restore fails
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
