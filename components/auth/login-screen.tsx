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
import { cloudStorageService } from "~/lib/services/cloud-storage.service";
import { authService } from "~/lib/services/auth.service";

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

      // Wait a bit for auth state to update after sign-in
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user is authenticated before proceeding
      if (!authService.isAuthenticated()) {
        console.log(
          "User not authenticated yet, skipping data conflict resolution",
        );
        onLoginSuccess();
        return;
      }

      // Check if there's data in the cloud
      const cloudData = await cloudStorageService.getFinancialData();

      if (
        cloudData &&
        (cloudData.transactions?.length > 0 ||
          cloudData.monthlyBudget ||
          cloudData.spendingCategories?.length > 0)
      ) {
        // Show dialog to choose between restore or overwrite
        Alert.alert(
          "Data Found in Cloud",
          "We found existing data in your cloud storage. What would you like to do?",
          [
            {
              text: "Restore from Cloud",
              onPress: async () => {
                try {
                  await restoreDataFromCloud();
                  // Refresh data to update the interface
                  await refreshData();
                  Alert.alert(
                    "Success",
                    "Your data has been restored from the cloud.",
                  );
                  onLoginSuccess();
                } catch (error) {
                  console.error("Error restoring data:", error);
                  Alert.alert("Error", "Failed to restore data from cloud.");
                }
              },
            },
            {
              text: "Overwrite Cloud",
              style: "destructive",
              onPress: async () => {
                try {
                  await forceSave();
                  Alert.alert(
                    "Success",
                    "Your local data has been synced to the cloud.",
                  );
                  onLoginSuccess();
                } catch (error) {
                  console.error("Error syncing data:", error);
                  Alert.alert("Error", "Failed to sync data to cloud.");
                }
              },
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => onLoginSuccess(), // Continue without syncing
            },
          ],
        );
      } else {
        // No cloud data, just sync local data
        await forceSave();
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Error checking cloud data:", error);
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
      console.error("Sign in error:", error);
      Alert.alert(
        "Sign In Failed",
        "There was an error signing in with Google. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsSigningIn(false);
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
          {isProcessingData ? "Processing your data..." : "Loading..."}
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
            Welcome to Eco-Manager
          </Text>
          <Text className="text-center text-lg leading-relaxed text-gray-600">
            Manage your finances with ease and sync across all your devices
          </Text>
        </View>

        {/* Benefits */}
        <View className="mb-12 w-full space-y-4">
          <View className="flex-row items-center">
            <View className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Ionicons name="checkmark" size={16} color="#10B981" />
            </View>
            <Text className="flex-1 text-base text-gray-700">
              Sync your data across all devices
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Ionicons name="checkmark" size={16} color="#10B981" />
            </View>
            <Text className="flex-1 text-base text-gray-700">
              Automatic backup to the cloud
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Ionicons name="checkmark" size={16} color="#10B981" />
            </View>
            <Text className="flex-1 text-base text-gray-700">
              Never lose your financial data
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
                Continue with Google
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
            Continue without signing in
          </Text>
        </TouchableOpacity>

        {/* Privacy Note */}
        <Text className="mt-8 text-center text-sm text-gray-400">
          Your data is encrypted and secure. We never share your personal
          information.
        </Text>
      </View>
    </View>
  );
};
