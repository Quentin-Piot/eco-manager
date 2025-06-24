import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "~/lib/context/auth";
import { Ionicons } from "@expo/vector-icons";

import alert from "~/components/alert";

// Assurez-vous que vos couleurs Tailwind sont configurées dans tailwind.config.js
// par exemple:
// theme: {
//   extend: {
//     colors: {
//       primary: '#4F46E5', // Exemple de couleur primaire
//       background: '#F9FAFB', // Exemple de couleur de fond
//       text: '#1F2937', // Exemple de couleur de texte
//       textSecondary: '#6B7280', // Exemple de couleur de texte secondaire
//       success: '#10B981', // Exemple de couleur de succès
//     },
//   },
// },

interface AuthScreenProps {
  onClose?: () => void;
  title?: string;
  subtitle?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onClose,
  title = "Sign in to sync your data",
  subtitle = "Save your progress and access it from any device",
}) => {
  const { signInWithGoogle, isLoading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
      onClose?.();
    } catch (error) {
      console.error("Sign in error:", error);
      alert(
        "Sign In Failed",
        "There was an error signing in with Google. Please try again.",
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSkip = () => {
    onClose?.();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="text-primary" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-background p-5">
      <View className="w-full max-w-lg items-center">
        {/* Header */}
        <View className="mb-10 items-center">
          <Ionicons name="cloud-upload-outline" size={64} color="blue-600" />
          <Text className="mb-2 mt-4 text-center text-2xl font-bold text-text">
            {title}
          </Text>
          <Text className="text-center text-base leading-snug text-textSecondary">
            {subtitle}
          </Text>
        </View>

        {/* Benefits */}
        <View className="mb-10 w-full">
          <View className="mb-3 flex-row items-center">
            <Ionicons name="checkmark-circle" size={24} color="green-500" />
            <Text className="ml-3 text-base text-text">
              Sync across devices
            </Text>
          </View>
          <View className="mb-3 flex-row items-center">
            <Ionicons name="checkmark-circle" size={24} color="green-500" />
            <Text className="ml-3 text-base text-text">
              Backup your progress
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={24} color="green-500" />
            <Text className="ml-3 text-base text-text">
              Restore after reinstall
            </Text>
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          className={`mb-4 w-full flex-row items-center justify-center rounded-xl bg-primary px-6 py-4 shadow-xl shadow-primary-400 ${isSigningIn ? "opacity-70" : ""}`}
          onPress={handleGoogleSignIn}
          disabled={isSigningIn}
        >
          {isSigningIn ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="logo-google" size={24} color="white" />
              <Text className="ml-3 text-base font-semibold text-white">
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity className="px-6 py-3" onPress={handleSkip}>
          <Text className="text-base font-medium text-textSecondary">
            Maybe later
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
