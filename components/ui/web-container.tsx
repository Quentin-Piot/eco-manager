import React, { PropsWithChildren } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import { cn } from "~/lib/utils";
import { useColorScheme } from "~/lib/useColorScheme";

export function WebContainer({ children }: PropsWithChildren) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const isMobile =
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    window.innerWidth <= 768;

  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  return (
    <View
      className={cn("flex-1", isDark ? "bg-gray-900" : "bg-gray-100")}
      style={styles.container}
    >
      {isMobile ? (
        // Mobile web view - no phone frame, adjusted for mobile browsers
        <View
          className={cn("overflow-hidden", isDark ? "bg-gray-800" : "bg-white")}
          style={styles.mobileAppContainer}
        >
          {children}
        </View>
      ) : (
        // Desktop web view - with phone frame
        <View style={styles.phoneFrameContainer}>
          <Image
            source={require("../../assets/images/phone-frame.png")}
            style={styles.phoneFrame}
            resizeMode="contain"
          />
          <View
            className={cn(
              "overflow-hidden",
              isDark ? "bg-gray-800" : "bg-white",
            )}
            style={styles.appContainer}
          >
            {children}
          </View>
        </View>
      )}
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
  phoneFrameContainer: {
    position: "relative",
    width: "100%",
    height: "95%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  phoneFrame: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 10,
    pointerEvents: "none" as any,
  },
  appContainer: {
    width: "100%",
    height: "100%",
    maxWidth: 400,
    overflow: "hidden",
    borderRadius: 0,
    zIndex: 5,
  },
  mobileAppContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    // Add safe area at the bottom for mobile browser UI
    paddingBottom: "env(safe-area-inset-bottom, 0px)" as any,
  },
});
