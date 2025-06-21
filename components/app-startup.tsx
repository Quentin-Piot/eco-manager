import React, { useEffect, useState } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginScreen } from "~/components/auth/login-screen";
import { useAuth } from "~/lib/context/auth";

const INITIAL_LOGIN_COMPLETED_KEY = "@initial_login_completed";

export const AppStartup: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showLoginScreen, setShowLoginScreen] = useState<boolean | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    checkInitialLoginStatus();
  }, []);

  const checkInitialLoginStatus = async () => {
    try {
      const hasCompletedInitialLogin = await AsyncStorage.getItem(
        INITIAL_LOGIN_COMPLETED_KEY,
      );

      // Show login screen if user hasn't completed initial login flow
      setShowLoginScreen(!hasCompletedInitialLogin);
    } catch (error) {
      console.error("Error checking initial login status:", error);
      // Default to showing login screen on error
      setShowLoginScreen(true);
    }
  };

  const handleLoginSuccess = async () => {
    try {
      // Mark initial login as completed
      await AsyncStorage.setItem(INITIAL_LOGIN_COMPLETED_KEY, "true");
      setShowLoginScreen(false);
    } catch (error) {
      console.error("Error saving initial login status:", error);
      setShowLoginScreen(false);
    }
  };

  // Show loading state while checking login status
  if (showLoginScreen === null) {
    return <View className="flex-1 bg-white" />;
  }

  // Show login screen if user hasn't completed initial login
  if (showLoginScreen) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main app
  return <>{children}</>;
};
