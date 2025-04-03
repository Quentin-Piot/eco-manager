import React from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <View
      className={cn(
        "flex-row flex-wrap items-start px-4 mb-2 mt-4 w-full",
        className,
      )}
    >
      {children}
    </View>
  );
}
