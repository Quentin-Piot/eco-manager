import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button } from "./button";
import { Text } from "~/components/ui/text";
import {
  categoryDetailsMap,
  MainExpenseCategory,
} from "~/lib/types/categories";
import { BottomModal } from "~/components/ui/custom-modal";
import { Input } from "~/components/ui/input";
import { useIndicatorColors } from "~/lib/context/indicator-colors-context";
import { colors } from "~/lib/theme";
import { ColorPicker } from "~/components/ui/color-picker";

interface EditBudgetModalProps {
  isVisible: boolean;
  onClose: () => void;
  categoryType: MainExpenseCategory | null;
  currentBudget: number | null;
  onSave: (categoryType: MainExpenseCategory, newBudget: number) => void;
}

export function EditBudgetModal({
  isVisible,
  onClose,
  categoryType,
  currentBudget,
  onSave,
}: EditBudgetModalProps) {
  const [newBudgetInput, setNewBudgetInput] = useState<string>("");

  useEffect(() => {
    if (isVisible && currentBudget) {
      setNewBudgetInput(currentBudget.toString());
    }
  }, [isVisible, currentBudget]);

  const handleSave = () => {
    const budgetValue = parseFloat(newBudgetInput);
    if (categoryType && !isNaN(budgetValue) && budgetValue >= 0) {
      onSave(categoryType, budgetValue);
      onClose();
    }
  };

  const { colors: indicatorColors, updateColor } = useIndicatorColors();

  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorPress = () => {
    setShowColorPicker(true);
  };

  const handleColorSelected = async (newColor: string) => {
    if (categoryType) {
      await updateColor(categoryType, newColor);
    }
  };

  const currentColor = categoryType
    ? indicatorColors[categoryType] || colors.primary.DEFAULT
    : colors.primary.DEFAULT;

  if (categoryType === null) return null;

  return (
    <BottomModal visible={isVisible} onRequestClose={onClose}>
      <View className="flex-row items-center gap-3 mb-3">
        <TouchableOpacity onPress={handleColorPress} activeOpacity={0.7}>
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: currentColor,
            }}
          />
        </TouchableOpacity>
        <Text
          className="text-xl font-semibold text-foreground"
          style={{ fontFamily: "Geist-SemiBold" }}
        >
          Modifier le budget pour{" "}
          {categoryDetailsMap[categoryType].label ?? "Catégorie"}
        </Text>
      </View>

      <Input
        onChangeText={setNewBudgetInput}
        value={newBudgetInput}
        placeholder="Nouveau budget (€)"
        keyboardType="number-pad"
        className={"mb-4"}
      />

      <View className="flex-row justify-between w-full space-x-3">
        <Button variant="outline" onPress={onClose} className="flex-1">
          <Text className="text-foreground dark:text-primary-foreground">
            Annuler
          </Text>
        </Button>
        <Button onPress={handleSave} className="flex-1">
          <Text className="text-primary-foreground">Sauvegarder</Text>
        </Button>
      </View>
      <ColorPicker
        visible={showColorPicker}
        selectedColor={indicatorColors[categoryType]}
        onColorSelected={handleColorSelected}
        onClose={() => setShowColorPicker(false)}
      />
    </BottomModal>
  );
}
