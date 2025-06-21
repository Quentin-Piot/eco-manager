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
import { AuthProvider } from "~/lib/context/auth";
import { AccountProvider } from "~/lib/context/account-context";
import { BackgroundProvider } from "~/lib/context/background";
import { IndicatorColorsProvider } from "~/lib/context/indicator-colors-context";
import { AppStartup } from "~/components/app-startup";
import Head from "expo-router/head";

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
      <Head>
        <title>Eco-Manager - Suivi de Dépenses et Revenus</title>
        <meta
          name="description"
          content="Gérez facilement vos dépenses et revenus mensuels avec Eco-Manager. Suivez votre budget, visualisez vos habitudes de dépenses et atteignez vos objectifs financiers. Par Quentin Piot"
        />
        <meta
          name="keywords"
          content="quentin piot, gestion budget, suivi dépenses, suivi revenus, application finance personnelle, budget mensuel, économiser argent"
        />
        <meta
          property="og:title"
          content="Eco-Manager - Suivi de Dépenses et Revenus"
        />
        <meta
          property="og:description"
          content="Gérez facilement vos dépenses et revenus mensuels avec Eco-Manager. Suivez votre budget, visualisez vos habitudes de dépenses et atteignez vos objectifs financiers."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Eco-Manager - Suivi de Dépenses et Revenus"
        />
        <meta
          name="twitter:description"
          content="Gérez facilement vos dépenses et revenus mensuels avec Eco-Manager. Suivez votre budget, visualisez vos habitudes de dépenses et atteignez vos objectifs financiers."
        />
      </Head>
      <WebContainer>
        <AuthProvider>
          <BackgroundProvider>
            <AccountProvider>
              <IndicatorColorsProvider>
                <AppStartup>
                  <Stack>
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                </AppStartup>
                <StatusBar style="auto" />

                <PortalHost />
                <Toast config={toastConfig} />
                <WebAlert />
              </IndicatorColorsProvider>
            </AccountProvider>
          </BackgroundProvider>
        </AuthProvider>
      </WebContainer>
    </ThemeProvider>
  );
}
