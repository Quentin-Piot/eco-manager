import type { TextRef, ViewRef } from "@rn-primitives/types";
import * as React from "react";
import { Text, type TextProps, View, type ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { TextClassContext } from "~/components/ui/text";

const Card = React.forwardRef<ViewRef, ViewProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <View
        style={[{ borderRadius: 16 }, style]}
        className={cn(
          "overflow-hidden bg-white",
          "border-[0.7px] border-neutral-200/50 dark:border-neutral-800/50",
          className,
        )}
      >
        <View
          ref={ref}
          className={cn("p-4", "bg-white/80 dark:bg-neutral-900/80")}
          {...props}
        />
      </View>
    );
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<ViewRef, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("flex-row items-center justify-between pb-3", className)}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<TextRef, TextProps>(
  ({ className, ...props }, ref) => (
    <Text
      role="heading"
      aria-level={3}
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-snug text-neutral-800 dark:text-neutral-100",
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<TextRef, TextProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn(
        "text-sm text-neutral-500 dark:text-neutral-400",
        className,
      )}
      {...props}
    />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<ViewRef, ViewProps>(
  ({ className, ...props }, ref) => (
    <TextClassContext.Provider value="text-foreground">
      <View ref={ref} className={cn("p-4", className)} {...props} />
    </TextClassContext.Provider>
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<ViewRef, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("flex-row items-center pt-4", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
