import React, { PropsWithChildren, ReactNode } from "react";
import { Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils"; // Assuming this is for utility classes like tailwind-rn

function MainLayout({
  children,
  pageName,
  fab,
}: PropsWithChildren<{ pageName: string; fab?: ReactNode }>) {
  return (
    <SafeAreaView
      edges={["right", "left", "top"]} // Remove 'bottom' edge for better FAB positioning if it's a bottom bar
      className={cn(
        `flex-1 bg-gray-50`, // Lighter background for a more open feel
        Platform.OS === "ios"
          ? "pb-24"
          : Platform.OS === "web"
            ? "mb-8"
            : "pb-24", // Adjust padding for iOS
      )}
    >
      <ScrollView
        className={cn(
          `w-full h-full`,
          // Add some top padding to avoid content directly under the notch/status bar,
          // but rely on SafeAreaView for the main offset
        )}
        contentContainerStyle={{ flexGrow: 1 }} // Ensure content can grow
      >
        <View className="px-4 pt-6 pb-4">
          <Text
            className={cn(
              "text-neutral-800 text-3xl font-bold tracking-tight", // Larger, bolder title
              "text-center w-full", // Center the title for simplicity
            )}
          >
            {pageName}
          </Text>
        </View>

        <View className={cn(`gap-4 w-full px-4 pt-2`)}>
          {/* Increased gap and padding */}
          {children}
        </View>
      </ScrollView>

      {/* Floating Action Button (FAB) - position absolute to float over content */}
      {fab && (
        <View
          className={cn(
            "absolute bottom-6 right-4", // Position it bottom right
            Platform.OS === "ios" ? "mb-16" : "", // Adjust for iOS bottom bar if present
          )}
          style={{
            // Add a subtle shadow for iOS 18 'transparent' feel
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5, // Android shadow
          }}
        >
          {fab}
        </View>
      )}
    </SafeAreaView>
  );
}

export default MainLayout;
