import React from "react";
import { TextInputProps } from "react-native";
import { Input } from "./input";

interface NumericInputProps extends Omit<TextInputProps, "onChangeText"> {
  onChangeText?: (value: string) => void;
  allowDecimal?: boolean;
  maxDecimalPlaces?: number;
}

const NumericInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  NumericInputProps
>(
  (
    { onChangeText, allowDecimal = true, maxDecimalPlaces = 2, ...props },
    ref,
  ) => {
    const validateNumericInput = (text: string): string => {
      let normalizedText = text.replace(/,/g, ".");

      normalizedText = normalizedText.replace(/[^0-9.]/g, "");

      if (allowDecimal) {
        const parts = normalizedText.split(".");
        if (parts.length > 2) {
          normalizedText = parts[0] + "." + parts.slice(1).join("");
        }

        if (parts.length === 2 && parts[1].length > maxDecimalPlaces) {
          normalizedText =
            parts[0] + "." + parts[1].substring(0, maxDecimalPlaces);
        }
      } else {
        normalizedText = normalizedText.replace(/\./g, "");
      }

      return normalizedText;
    };

    const handleTextChange = (text: string) => {
      const validatedText = validateNumericInput(text);
      onChangeText?.(validatedText);
    };

    return (
      <Input
        ref={ref}
        keyboardType="numeric"
        onChangeText={handleTextChange}
        {...props}
      />
    );
  },
);

NumericInput.displayName = "NumericInput";

export { NumericInput };
export type { NumericInputProps };
