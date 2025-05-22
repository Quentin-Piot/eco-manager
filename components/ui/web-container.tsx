import React, { PropsWithChildren } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { cn } from "~/lib/utils";

/**
 * Composant qui enveloppe l'application sur la version web pour maintenir un format mobile
 * Ce composant n'a aucun effet sur les plateformes natives (iOS, Android)
 */
export function WebContainer({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Sur les plateformes natives, on retourne simplement les enfants
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  // Sur le web, on enveloppe le contenu dans un conteneur avec une largeur maximale
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
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  appContainer: {
    width: "100%",
    maxWidth: 500,
    height: "100%",
    maxHeight: "100vh",
    overflow: "hidden",
    borderRadius: 0,
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
  },
});
