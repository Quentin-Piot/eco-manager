import type { ViewRef } from "@rn-primitives/types";
import * as React from "react";
import { ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { cn } from "~/lib/utils";

const Container = React.forwardRef<
  ViewRef,
  ViewProps & { title?: ReactNode | string }
>(({ className, style, title, children, ...props }, ref) => (
  <View className={"w-full"}>
    {title &&
      (typeof title === "string" ? (
        <Text
          className={
            "mb-2 font-semibold text-primary dark:text-neutral-200 text-lg"
          }
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      ) : (
        <View className="mb-2">{title}</View>
      ))}
    <View ref={ref} className={cn(className)} {...props} style={style}>
      {children}
    </View>
  </View>
));
Container.displayName = "Container";
export { Container };
