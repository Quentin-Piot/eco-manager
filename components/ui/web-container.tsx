import React, { PropsWithChildren } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { cn } from "~/lib/utils";

export function WebContainer({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  return (
    <View
      className={cn("flex-1", isDark ? "bg-gray-900" : "bg-gray-100")}
      style={styles.container}
    >
      <View
        className={cn(
          "flex-1 overflow-hidden",
          isDark ? "bg-gray-800" : "bg-white",
        )}
        style={styles.appContainer}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100vh" as any,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  appContainer: {
    width: "100%",
    maxWidth: 450,
    height: "100%",
    maxHeight: "95vh" as any,
    overflow: "hidden",
    borderRadius: 0,
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
  },
});
