import React from "react";
import { Button } from "~/components/ui/button";
import { Text } from "@/components/ui/text";

interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  size?: "sm" | "default" | "lg";
  textSize?: "xs" | "sm" | "base";
}

export function FilterButton({
  label,
  isSelected,
  onPress,
  size = "sm",
  textSize = "sm",
}: FilterButtonProps) {
  return (
    <Button
      size={size}
      variant={isSelected ? "default" : "outline"}
      className="mx-1 my-1 flex items-center justify-center w-fit"
      onPress={onPress}
    >
      <Text
        className={`text-center text-${textSize} native:text-${textSize}`}
        style={{ fontFamily: "Geist-Bold", fontWeight: "bold" }}
      >
        {label}
      </Text>
    </Button>
  );
}
