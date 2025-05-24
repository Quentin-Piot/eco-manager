import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { BlurView } from "expo-blur";

import { HapticTab } from "~/components/ui/haptic-tab";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "~/lib/theme";

export const TABS_HEIGHT = 80;

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary.DEFAULT,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "transparent",
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === "ios" ? TABS_HEIGHT : undefined,
        },
        tabBarBackground: () => (
          <BlurView
            tint={colorScheme === "dark" ? "dark" : "light"}
            intensity={60}
            experimentalBlurMethod={"dimezisBlurView"}
            style={{
              flex: 1,
              overflow: "hidden",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginHorizontal: 10,
              marginBottom: Platform.OS === "ios" ? 0 : 0,
            }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="dashboard" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          title: "Details",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="view-list" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
