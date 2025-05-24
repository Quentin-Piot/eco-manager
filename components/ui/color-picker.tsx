import React from "react";
import { TouchableOpacity, View } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "./text";
import { availableColors } from "~/lib/types/indicator-colors";
import { BottomModal } from "~/components/ui/custom-modal";

interface ColorPickerProps {
  selectedColor: string;
  onColorSelected: (color: string) => void;
  visible: boolean;
  onClose: () => void;
}

export function ColorPicker({
  selectedColor,
  onColorSelected,
  visible,
  onClose,
}: ColorPickerProps) {
  if (!visible) return null;

  return (
    <BottomModal
      visible={visible}
      onRequestClose={onClose}
      title={"Choisir une couleur"}
    >
      <View className="flex-row flex-wrap justify-center">
        {availableColors.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => {
              onColorSelected(color);
              onClose();
            }}
            className={cn(
              "w-10 h-10 m-2 rounded-full",
              selectedColor === color
                ? "border-2 border-black dark:border-white"
                : "",
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={onClose}
        className="mt-4 bg-gray-200 dark:bg-gray-700 py-2 rounded-lg"
      >
        <Text className="text-center font-semibold">Annuler</Text>
      </TouchableOpacity>
    </BottomModal>
  );
}
