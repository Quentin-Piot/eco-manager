import "../global.css";
import { Platform } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { PortalHost } from "@rn-primitives/portal";
import Toast from "react-native-toast-message";
import { toastConfig } from "~/components/ui/toast";
import { WebAlert } from "~/components/ui/web-alert";
import { WebContainer } from "~/components/ui/web-container";
import { AccountProvider } from "~/lib/context/account-context";
import { BackgroundProvider } from "~/lib/context/background";
import { IndicatorColorsProvider } from "~/lib/context/indicator-colors-context";

// Import des styles spécifiques pour la version web
if (Platform.OS === "web") {
  require("../assets/web-styles.css");
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Geist-Black": require("../assets/fonts/Geist-Black.ttf"),
    "Geist-Bold": require("../assets/fonts/Geist-Bold.ttf"),
    "Geist-ExtraBold": require("../assets/fonts/Geist-ExtraBold.ttf"),
    "Geist-ExtraLight": require("../assets/fonts/Geist-ExtraLight.ttf"),
    "Geist-Light": require("../assets/fonts/Geist-Light.ttf"),
    "Geist-Medium": require("../assets/fonts/Geist-Medium.ttf"),
    "Geist-Regular": require("../assets/fonts/Geist-Regular.ttf"),
    "Geist-SemiBold": require("../assets/fonts/Geist-SemiBold.ttf"),
    "Geist-Thin": require("../assets/fonts/Geist-Thin.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <WebContainer>
        <BackgroundProvider>
          <AccountProvider>
            <IndicatorColorsProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />

              <PortalHost />
              <Toast config={toastConfig} />
              <WebAlert />
            </IndicatorColorsProvider>
          </AccountProvider>
        </BackgroundProvider>
      </WebContainer>
    </ThemeProvider>
  );
}
