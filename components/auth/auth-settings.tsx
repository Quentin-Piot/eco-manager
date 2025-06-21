import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "~/lib/context/auth";
import { useAccount } from "~/lib/context/account-context";
import { Ionicons } from "@expo/vector-icons";

// Les couleurs doivent être définies dans tailwind.config.js
// Par exemple:
// theme: {
//   extend: {
//     colors: {
//       primary: '#4F46E5', // Indigo-600
//       background: '#F9FAFB', // Gris clair
//       surface: '#FFFFFF', // Blanc (pour les cartes, fonds d'éléments)
//       text: '#1F2937', // Gris foncé (text-gray-900)
//       textSecondary: '#6B7280', // Gris moyen (text-gray-500)
//       border: '#E5E7EB', // Gris très clair (border-gray-200)
//       error: '#EF4444', // Rouge (red-500)
//     },
//   },
// },

interface AuthSettingsProps {
  onAuthScreenOpen?: () => void;
}

export const AuthSettings: React.FC<AuthSettingsProps> = ({
  onAuthScreenOpen,
}) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { forceSave } = useAccount();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out? Your data will remain on this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              setIsSigningOut(true);
              await signOut();
            } catch (error) {
              console.error("Sign out error:", error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ],
    );
  };

  const handleSyncNow = async () => {
    try {
      setIsSyncing(true);
      await forceSave();
      Alert.alert("Success", "Your data has been synced to the cloud.");
    } catch (error) {
      console.error("Sync error:", error);
      Alert.alert(
        "Sync Failed",
        "Failed to sync data to cloud. Please try again.",
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignIn = () => {
    onAuthScreenOpen?.();
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 px-4">
        <View className="mb-6">
          <Text className="mb-4 text-lg font-semibold text-text">
            Cloud Sync
          </Text>
          <View className="items-center rounded-xl bg-surface p-6">
            <Ionicons
              name="cloud-offline-outline"
              size={48}
              color="text-textSecondary"
            />
            <Text className="mb-2 mt-3 text-lg font-semibold text-text">
              Not signed in
            </Text>
            <Text className="mb-5 text-center text-sm leading-tight text-textSecondary">
              Sign in to backup and sync your data across devices
            </Text>
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-lg bg-primary px-5 py-3"
              onPress={handleSignIn}
            >
              <Ionicons name="logo-google" size={20} color="white" />
              <Text className="ml-2 text-sm font-semibold text-white">
                Sign in with Google
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4">
      <View className="mb-6">
        <Text className="mb-4 text-lg font-semibold text-text">Account</Text>

        {/* User Info */}
        <View className="mb-4 flex-row items-center rounded-xl bg-surface p-4">
          <View className="mr-3 h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-border">
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                className="h-full w-full rounded-full" // Utilisez full pour couvrir l'avatar
                alt="Profile"
              />
            ) : (
              <Ionicons name="person" size={24} color="text-textSecondary" />
            )}
          </View>
          <View className="flex-1">
            <Text className="mb-0.5 text-base font-semibold text-text">
              {user?.displayName || "User"}
            </Text>
            <Text className="text-sm text-textSecondary">{user?.email}</Text>
          </View>
        </View>

        {/* Sync Settings */}
        <View className="mb-2 flex-row items-center justify-between rounded-xl bg-surface p-4">
          <View className="flex-1 flex-row items-center">
            <Ionicons name="cloud-outline" size={24} color="text-primary" />
            <View className="ml-3 flex-1">
              <Text className="mb-0.5 text-base font-medium text-text">
                Auto Sync
              </Text>
              <Text className="text-xs leading-4 text-textSecondary">
                Automatically sync data when changes are made
              </Text>
            </View>
          </View>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            // Les couleurs de track et thumb pour Switch nécessitent des couleurs hexadécimales ou des constantes
            // Si vous avez défini colors.primary, vous pouvez le réutiliser ici
            trackColor={{
              false: "#E5E7EB", // bg-border
              true: "#4F46E5", // bg-primary
            }}
            thumbColor={autoSync ? "white" : "#6B7280"} // white ou text-textSecondary
          />
        </View>

        {/* Manual Sync */}
        <TouchableOpacity
          className="mb-2 flex-row items-center justify-between rounded-xl bg-surface p-4 active:opacity-70"
          onPress={handleSyncNow}
          disabled={isSyncing}
        >
          <View className="flex-1 flex-row items-center">
            <Ionicons name="sync-outline" size={24} color="text-primary" />
            <View className="ml-3 flex-1">
              <Text className="mb-0.5 text-base font-medium text-text">
                Sync Now
              </Text>
              <Text className="text-xs leading-4 text-textSecondary">
                Manually sync your data to the cloud
              </Text>
            </View>
          </View>
          {isSyncing ? (
            <ActivityIndicator size="small" color="text-primary" />
          ) : (
            <Ionicons
              name="chevron-forward"
              size={20}
              color="text-textSecondary"
            />
          )}
        </TouchableOpacity>

        {/* Sign Out */}
        <TouchableOpacity
          className="mt-2 flex-row items-center justify-between rounded-xl bg-surface p-4 active:opacity-70"
          onPress={handleSignOut}
          disabled={isSigningOut}
        >
          <View className="flex-1 flex-row items-center">
            <Ionicons name="log-out-outline" size={24} color="text-error" />
            <View className="ml-3 flex-1">
              <Text className="mb-0.5 text-base font-medium text-error">
                Sign Out
              </Text>
              <Text className="text-xs leading-4 text-textSecondary">
                Sign out of your account
              </Text>
            </View>
          </View>
          {isSigningOut ? (
            <ActivityIndicator size="small" color="text-error" />
          ) : (
            <Ionicons
              name="chevron-forward"
              size={20}
              color="text-textSecondary"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
