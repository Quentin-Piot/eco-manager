import type { TextRef, ViewRef } from "@rn-primitives/types";
import * as React from "react";
import { Text, type TextProps, View, type ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { TextClassContext } from "~/components/ui/text";

const Card = React.forwardRef<ViewRef, ViewProps>(
  ({ className, style, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        "px-3 py-2",
        "rounded-lg border-[1px]  bg-white border-gray-200",
        "dark:bg-background-dark dark:border-muted-darker/90 dark:border-2 dark:shadow-none",
        className,
      )}
      {...props}
      style={style}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<ViewRef, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        "mb-6 flex-row justify-between items-center w-full",
        className,
      )}
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
        "text-lg text-primary-darker font-bold leading-none tracking-tight",
        className,
      )}
      style={{
        fontFamily: "Geist-Bold",
      }}
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
        "text-sm text-muted-foreground",
        "dark:text-white",
        className,
      )}
      {...props}
    />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<ViewRef, ViewProps>(
  ({ className, ...props }, ref) => (
    <TextClassContext.Provider value="text-card-foreground">
      <View ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    </TextClassContext.Provider>
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<ViewRef, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("flex flex-row items-center p-6 pt-0", className)}
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
