import * as Slot from "@rn-primitives/slot";
import type { SlottableTextProps, TextRef } from "@rn-primitives/types";
import * as React from "react";
import { Text as RNText } from "react-native";
import { cn } from "~/lib/utils";
import { useMemo } from "react";

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;

    const fontFamily = useMemo(() => {
      const isBold = textClass?.includes("font-bold");
      if (isBold) return "Geist-Bold";
      const isSemiBold = textClass?.includes("font-semibold");
      if (isSemiBold) return "Geist-SemiBold";
      return "Geist";
    }, [textClass]);
    return (
      <Component
        className={cn(
          "text-base text-black  web:select-text",
          textClass,
          className?.includes("text-red") ? "" : "dark:text-white",
          className?.includes("text-primary") ? "dark:text-primary" : "",
          className?.includes("text-secondary") ? "dark:text-secondary" : "",
          className?.includes("text-muted-darker") ? "dark:text-muted" : "",

          className,
        )}
        style={{ fontFamily }}
        ref={ref}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";

export { Text, TextClassContext };
