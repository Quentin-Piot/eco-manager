import React, { PropsWithChildren, ReactNode } from "react";
import { Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { UserAvatar } from "~/components/auth/user-avatar";
import { cn } from "~/lib/utils";

function MainLayout({
  children,
  pageName,
  fab,
}: PropsWithChildren<{ pageName: string; fab?: ReactNode }>) {
  return (
    <SafeAreaView
      edges={["right", "left", "top"]}
      className={cn(
        `flex-1`,
        Platform.OS === "ios"
          ? "pb-24"
          : Platform.OS === "web"
            ? "mb-8"
            : "pb-14",
      )}
    >
      <ScrollView
        className={cn(`w-full h-full`)}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text
                className={cn(
                  "text-primary-darker text-2xl font-bold tracking-tight",
                  "text-center w-full",
                )}
              >
                {pageName}
              </Text>
            </View>
            <View className="absolute right-0">
              <UserAvatar />
            </View>
          </View>
        </View>

        <View className={cn(`gap-4 w-full px-4 pt-2`)}>{children}</View>
      </ScrollView>
      {fab && (
        <View
          className={cn(
            "absolute bottom-6 right-4",
            Platform.OS === "ios" ? "mb-16" : "",
          )}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          {fab}
        </View>
      )}
    </SafeAreaView>
  );
}

export default MainLayout;
