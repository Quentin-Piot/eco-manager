import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "~/components/ui/haptic-tab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "~/lib/theme";

export const TABS_HEIGHT = "128px";
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary.DEFAULT,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tableau de bord",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="dashboard" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          title: "Détails",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="view-list" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
