import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "~/lib/context/auth";
import { LoginScreen } from "~/components/auth/login-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { authService } from "~/lib/services/auth.service";

const INITIAL_LOGIN_COMPLETED_KEY = "@initial_login_completed";

export function AppStartup({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isInitialLoginCompleted, setIsInitialLoginCompleted] = useState<
    boolean | null
  >(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const checkAuthenticationStatus = useCallback(async () => {
    try {
      setIsCheckingSession(true);

      // Attendre l'initialisation du service d'authentification
      await authService.waitForInitialization();

      const completed = await AsyncStorage.getItem("@initial_login_completed");
      const hasCompletedLogin = completed === "true";

      // Vérifier s'il y a une session locale valide
      const hasLocalSession = await authService.hasLocalSession();

      if (isAuthenticated) {
        // Utilisateur authentifié via Firebase
        if (!hasCompletedLogin) {
          await AsyncStorage.setItem("@initial_login_completed", "true");
        }
        setIsInitialLoginCompleted(true);
      } else if (hasLocalSession && hasCompletedLogin) {
        // Session locale valide trouvée
        console.log("Session locale valide trouvée");
        setIsInitialLoginCompleted(true);
      } else {
        // Aucune session valide
        setIsInitialLoginCompleted(false);
        if (hasCompletedLogin) {
          // Nettoyer le flag si la session n'est plus valide
          await AsyncStorage.removeItem("@initial_login_completed");
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du statut d'authentification:",
        error,
      );
      setIsInitialLoginCompleted(false);
    } finally {
      setIsCheckingSession(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    checkAuthenticationStatus();
  }, [checkAuthenticationStatus]);

  const handleLoginSuccess = async () => {
    await AsyncStorage.setItem("@initial_login_completed", "true");
    setIsInitialLoginCompleted(true);
  };

  // Afficher un indicateur de chargement pendant l'initialisation
  if (isLoading || isCheckingSession || isInitialLoginCompleted === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isInitialLoginCompleted) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return <>{children}</>;
}
