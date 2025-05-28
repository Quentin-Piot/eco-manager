import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { BottomModal } from "~/components/ui/custom-modal";
import { PieSlice } from "~/components/charts/category-pie";
import { colors } from "~/lib/theme";
import { categoryDetailsMap } from "~/lib/types/categories";
import { useIndicatorColors } from "~/lib/context/indicator-colors-context";
import { ColorPicker } from "~/components/ui/color-picker";

type SliceInfoModalProps = {
  isVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  slice: PieSlice | null;
};

export const SliceInfoModal: React.FC<SliceInfoModalProps> = ({
  isVisible,
  setIsModalVisible,
  slice,
}) => {
  const { colors: indicatorColors, updateColor } = useIndicatorColors();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const formatCurrency = (value: number) => {
    return `${value.toFixed(2).replace(".", ",")}€`;
  };

  const handleColorPress = () => {
    setShowColorPicker(true);
  };

  const handleColorSelected = async (newColor: string) => {
    if (slice) {
      await updateColor(slice.type, newColor);
    }
  };

  const currentColor = slice
    ? indicatorColors[slice.type] || colors.primary.DEFAULT
    : colors.primary.DEFAULT;

  return (
    <>
      <BottomModal
        visible={isVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-muted">
          {slice && (
            <View className="flex-row items-center gap-3">
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
                className="text-2xl font-semibold text-foreground"
                style={{ fontFamily: "Geist-SemiBold" }}
              >
                {categoryDetailsMap[slice.type].label}
              </Text>
            </View>
          )}
          <TouchableOpacity onPress={() => setIsModalVisible(false)}>
            <Ionicons
              name="close-circle-outline"
              size={28}
              color={colors.muted.darker}
            />
          </TouchableOpacity>
        </View>

        {slice ? (
          <View className="space-y-4 py-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-muted-foreground">
                Montant dépensé :
              </Text>
              <Text className="text-xl font-semibold text-foreground">
                {formatCurrency(slice.value)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-base text-muted-foreground">
                Part des dépenses :
              </Text>
              <Text className="text-xl font-semibold text-foreground">
                {slice.percentage.toFixed(0)}%
              </Text>
            </View>
          </View>
        ) : (
          <Text className="text-center text-muted-foreground py-4">
            Aucune catégorie sélectionnée.
          </Text>
        )}
        <ColorPicker
          visible={showColorPicker}
          selectedColor={currentColor}
          onColorSelected={handleColorSelected}
          onClose={() => setShowColorPicker(false)}
        />
      </BottomModal>
    </>
  );
};
