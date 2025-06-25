import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "~/lib/context/auth";
import { useAccount } from "~/lib/context/account-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "~/lib/theme";
import { DataConflictResolver } from "~/lib/utils/data-conflict-resolver";

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { signInWithGoogle, isLoading, restoreDataFromCloud } = useAuth();
  const { forceSave, refreshData } = useAccount();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isProcessingData, setIsProcessingData] = useState(false);

  const handleDataConflictResolution = async () => {
    try {
      setIsProcessingData(true);

      await DataConflictResolver.handleDataConflictResolution({
        restoreDataFromCloud,
        forceSave,
        refreshData,
        onComplete: () => {
          onLoginSuccess();
        },
      });
    } catch (error) {
      console.error("Error in data conflict resolution:", error);
      onLoginSuccess(); // Continue anyway
    } finally {
      setIsProcessingData(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();

      // After successful login, handle data conflict resolution
      await handleDataConflictResolution();
    } catch (error) {
      console.error("Erreur de connexion:", error);
      Alert.alert(
        "Échec de la connexion",
        "Une erreur s'est produite lors de la connexion avec Google. Veuillez réessayer.",
        [{ text: "OK" }],
      );
      // Ensure we call onLoginSuccess even if there's an error
      onLoginSuccess();
    } finally {
      setIsSigningIn(false);
      setIsProcessingData(false);
    }
  };

  const handleSkip = () => {
    onLoginSuccess();
  };

  if (isLoading || isProcessingData) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text className="mt-4 text-gray-600">
          {isProcessingData ? "Traitement de vos données..." : "Chargement..."}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <View className="w-full max-w-md items-center">
        {/* Header */}
        <View className="mb-12 items-center">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <Ionicons
              name="wallet-outline"
              size={40}
              color={colors.primary.DEFAULT}
            />
          </View>
          <Text className="mb-3 text-center text-3xl font-bold text-gray-900">
            Bienvenue sur Eco-Manager
          </Text>
          <Text className="text-center text-lg leading-relaxed text-gray-600">
            Gérez vos finances facilement et synchronisez sur tous vos appareils
          </Text>
        </View>

        {/* Benefits */}
        <View className="mb-12 w-full space-y-4">
          <View className="flex-row items-center">
            <View className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Ionicons name="checkmark" size={16} color="#10B981" />
            </View>
            <Text className="flex-1 text-base text-gray-700">
              Synchronisez vos données sur tous vos appareils
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Ionicons name="checkmark" size={16} color="#10B981" />
            </View>
            <Text className="flex-1 text-base text-gray-700">
              Sauvegarde automatique dans le cloud
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Ionicons name="checkmark" size={16} color="#10B981" />
            </View>
            <Text className="flex-1 text-base text-gray-700">
              Ne perdez jamais vos données financières
            </Text>
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          className={`mb-4 w-full flex-row items-center justify-center rounded-xl px-6 py-4 shadow-lg ${
            isSigningIn ? "bg-blue-400" : "bg-blue-600"
          }`}
          onPress={handleGoogleSignIn}
          disabled={isSigningIn}
          style={{
            shadowColor: colors.primary.DEFAULT,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {isSigningIn ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="logo-google" size={24} color="white" />
              <Text className="ml-3 text-lg font-semibold text-white">
                Continuer avec Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity
          className="px-6 py-3"
          onPress={handleSkip}
          disabled={isSigningIn}
        >
          <Text className="text-base font-medium text-gray-500">
            Continuer sans se connecter
          </Text>
        </TouchableOpacity>

        {/* Privacy Note */}
        <Text className="mt-8 text-center text-sm text-gray-400">
          Vos données sont chiffrées et sécurisées. Nous ne partageons jamais
          vos informations personnelles.
        </Text>
      </View>
    </View>
  );
};
