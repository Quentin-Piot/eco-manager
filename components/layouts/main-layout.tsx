import React, { PropsWithChildren } from "react";
import { Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

function MainLayout({
  children,
  pageName,
}: PropsWithChildren<{ pageName: string }>) {
  return (
    <SafeAreaView
      edges={["right", "left", "top", "bottom"]}
      className={cn(`flex-1 px-0 bg-background`)}
    >
      <ScrollView className={cn(`w-full h-full px-4`)}>
        <View className="flex-row items-center justify-between mb-4 pt-2">
          <Text className="text-2xl font-bold">{pageName}</Text>
        </View>
        <View
          className={cn(
            `gap-3 w-full`,
            Platform.OS === "ios" ? "pb-16" : "mb-4",
          )}
        >
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MainLayout;
