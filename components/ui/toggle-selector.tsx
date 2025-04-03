import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";

type ToggleSelectorProps = {
  options: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  fullWidth?: boolean;
};

export const ToggleSelector = ({
  options,
  value,
  onChange,
  className = "",
  fullWidth = false,
}: ToggleSelectorProps) => {
  return (
    <View
      className={`flex-row bg-card dark:bg-primary-darker rounded-full overflow-hidden border border-border dark:border-primary-dark ${className}`}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onChange(option.value)}
          className={`px-3 py-1 ${value === option.value ? "bg-primary" : ""} ${fullWidth ? "flex-1" : ""}`}
        >
          <Text
            style={{ fontFamily: "Geist-Bold", fontWeight: "bold" }}
            className={
              value === option.value
                ? "text-primary-foreground dark:text-primary-foreground text-sm text-center"
                : "text-muted-foreground text-sm text-center"
            }
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
