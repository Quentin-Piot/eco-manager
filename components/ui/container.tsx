import type { ViewRef } from "@rn-primitives/types";
import * as React from "react";
import { Text, View, type ViewProps } from "react-native";
import { cn } from "~/lib/utils";

const Container = React.forwardRef<ViewRef, ViewProps & { title?: string }>(
  ({ className, style, title, children, ...props }, ref) => (
    <View className={"w-full"}>
      {title && (
        <Text
          className={
            "mb-2 font-semibold text-neutral-700 dark:text-neutral-200 text-lg"
          }
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      )}
      <View ref={ref} className={cn(className)} {...props} style={style}>
        {children}
      </View>
    </View>
  ),
);
Container.displayName = "Container";
export { Container };
