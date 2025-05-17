import React, { PropsWithChildren, ReactNode } from "react";
import { Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

function MainLayout({
  children,
  pageName,
  fab,
}: PropsWithChildren<{ pageName: string; fab?: ReactNode }>) {
  return (
    <SafeAreaView
      edges={["right", "left", "top", "bottom"]}
      className={cn(
        `flex-1 p-0 bg-background,relative  bg-background`,
        Platform.OS === "ios" ? "mb-16" : "",
      )}
    >
      <ScrollView className={cn(`w-full h-full`)}>
        <View className="flex-row items-center justify-between px-4 py-4 border-b-[1px] border-b-gray-300 bg-primary-light">
          <Text className="text-white text-center w-full text-lg font-semibold">
            {pageName}
          </Text>
        </View>
        <View className={cn(`gap-3 w-full px-3 pt-3`)}>{children}</View>
      </ScrollView>
      {fab}
    </SafeAreaView>
  );
}

export default MainLayout;
