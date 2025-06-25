import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "~/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "~/lib/context/auth";
import { useAccount } from "~/lib/context/account-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "~/lib/theme";
import { DataConflictResolver } from "~/lib/utils/data-conflict-resolver";

export const UserAvatar = () => {
  const {
    user,
    isAuthenticated,
    signOut,
    signInWithGoogle,
    restoreDataFromCloud,
  } = useAuth();
  const { forceSave, refreshData } = useAccount();

  const insets = useSafeAreaInsets();
  const tooltipRef = useRef(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const handleSignOut = async () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ? Vos données resteront sur cet appareil.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se déconnecter",
          style: "destructive",
          onPress: async () => {
            try {
              setIsSigningOut(true);
              await signOut();
            } catch (error) {
              console.error("Erreur de déconnexion:", error);
              Alert.alert(
                "Erreur",
                "Échec de la déconnexion. Veuillez réessayer.",
              );
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
      Alert.alert("Succès", "Vos données ont été synchronisées dans le cloud.");
    } catch (error) {
      console.error("Erreur de synchronisation:", error);
      Alert.alert(
        "Échec de la synchronisation",
        "Impossible de synchroniser les données dans le cloud. Veuillez réessayer.",
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDataConflictResolution = async () => {
    await DataConflictResolver.handleDataConflictResolution({
      restoreDataFromCloud,
      forceSave,
      refreshData,
    });
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();

      // After successful login, handle data conflict resolution
      await handleDataConflictResolution();
    } catch (error) {
      console.error("Erreur de connexion:", error);
      Alert.alert("Erreur", "Échec de la connexion. Veuillez réessayer.");
    }
  };

  return (
    <Tooltip delayDuration={150} ref={tooltipRef}>
      <TooltipTrigger>
        <Avatar alt="Avatar utilisateur" className={"justify-self-end h-7 w-7"}>
          {isAuthenticated && user?.photoURL ? (
            <AvatarImage
              source={{ uri: user.photoURL, cache: "force-cache" }}
            />
          ) : null}
          <AvatarFallback>
            <View>
              <Ionicons
                name={"person"}
                color={colors.primary.DEFAULT}
                size={14}
              />
            </View>
          </AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent
        insets={{
          right: 10,
          top: 10,
        }}
        style={{
          marginTop: insets.top + 50,
          minWidth: 280,
        }}
      >
        <View className={"gap-2 p-4 w-[75vw] max-w-[395px]"}>
          {/* Section Compte */}
          {isAuthenticated ? (
            <>
              {/* Informations utilisateur */}
              <View className="mb-3 flex-row items-center rounded-lg bg-gray-50 px-2">
                <View className="mr-3 h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                  {user?.photoURL ? (
                    <Image
                      source={{ uri: user.photoURL }}
                      className="h-full w-full rounded-full"
                      alt="Profile"
                    />
                  ) : (
                    <Ionicons
                      name="person"
                      size={20}
                      color={colors.primary.DEFAULT}
                    />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900">
                    {user?.displayName || "Utilisateur"}
                  </Text>
                  <Text className="text-xs text-gray-500">{user?.email}</Text>
                </View>
              </View>

              {/* Synchronisation automatique */}
              <View className="mb-2 flex-row items-center justify-between rounded-lg bg-gray-50   p-3">
                <View className="flex-1 flex-row items-center">
                  <Ionicons
                    name="cloud-outline"
                    size={20}
                    color={colors.primary.DEFAULT}
                  />
                  <View className="ml-2 flex-1">
                    <Text className="text-sm font-medium text-gray-900">
                      Synchronisation automatique
                    </Text>
                  </View>
                </View>
                <Switch
                  value={autoSync}
                  onValueChange={setAutoSync}
                  trackColor={{
                    false: "#E5E7EB",
                    true: colors.primary.DEFAULT,
                  }}
                  thumbColor={autoSync ? "white" : "#6B7280"}
                />
              </View>

              {/* Synchronisation manuelle */}
              <TouchableOpacity
                className="mb-2 flex-row items-center justify-between rounded-lg bg-gray-50 active:opacity-70   p-3"
                onPress={handleSyncNow}
                disabled={isSyncing}
              >
                <View className="flex-1 flex-row items-center">
                  <Ionicons
                    name="sync-outline"
                    size={20}
                    color={colors.primary.DEFAULT}
                  />
                  <View className="ml-2 flex-1">
                    <Text className="text-sm font-medium text-gray-900">
                      Synchroniser maintenant
                    </Text>
                  </View>
                </View>
                {isSyncing ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary.DEFAULT}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                )}
              </TouchableOpacity>

              {/* Déconnexion */}
              <TouchableOpacity
                className="mb-3 flex-row items-center justify-between rounded-lg bg-red-50 active:opacity-70   p-3"
                onPress={handleSignOut}
                disabled={isSigningOut}
              >
                <View className="flex-1 flex-row items-center">
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                  <View className="ml-2 flex-1">
                    <Text className="text-sm font-medium text-red-600">
                      Se déconnecter
                    </Text>
                  </View>
                </View>
                {isSigningOut ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text className="text-primary text-lg mb-2 text-center font-bold">
                Synchronisation Cloud
              </Text>
              <View className="items-center rounded-lg bg-gray-50 p-4 mb-3">
                <Ionicons
                  name="cloud-offline-outline"
                  size={32}
                  color="#6B7280"
                />
                <Text className="mb-1 mt-2 text-sm font-semibold text-gray-900">
                  Non connecté
                </Text>
                <Text className="mb-3 text-center text-xs text-gray-500">
                  Connectez-vous pour sauvegarder vos données
                </Text>
                <TouchableOpacity
                  className="flex-row items-center justify-center rounded-lg bg-blue-600 px-4 py-2"
                  onPress={handleSignIn}
                >
                  <Ionicons name="logo-google" size={16} color="white" />
                  <Text className="ml-2 text-xs font-semibold text-white">
                    Se connecter avec Google
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </TooltipContent>
    </Tooltip>
  );
};
