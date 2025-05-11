import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons"; // Keep Ionicons for close button
import { BottomModal } from "~/components/ui/custom-modal";
import { PieSlice } from "~/components/charts/category-pie";
import { colors } from "~/lib/theme";
import { categoryDetailsMap } from "~/lib/types/categories"; // Import colors for styling if needed

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
  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return `${value.toFixed(2).replace(".", ",")}€`; // Example: €1,250.75 -> €1 250,75 (adjust locale/formatting as needed)
  };

  return (
    <BottomModal
      visible={isVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      {/* Header Section */}
      <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-muted">
        {slice && (
          <View className="flex-row items-center gap-3">
            {/* Color Indicator */}
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: slice.color || colors.primary.DEFAULT, // Use slice color or a default
              }}
            />
            {/* Category Name */}
            <Text
              className="text-2xl font-semibold text-foreground" // Adjusted styling
              style={{ fontFamily: "Geist-SemiBold" }} // Use specific font weight if available
            >
              {categoryDetailsMap[slice.type].label}
            </Text>
          </View>
        )}
        {/* Close Button */}
        <TouchableOpacity onPress={() => setIsModalVisible(false)}>
          <Ionicons
            name="close-circle-outline"
            size={28}
            color={colors.muted.darker}
          />
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      {slice ? (
        <View className="space-y-4 py-2">
          {/* Amount */}
          <View className="flex-row justify-between items-center">
            <Text className="text-base text-muted-foreground">
              Montant dépensé :
            </Text>
            <Text className="text-xl font-semibold text-foreground">
              {formatCurrency(slice.value)}
            </Text>
          </View>

          {/* Percentage */}
          <View className="flex-row justify-between items-center">
            <Text className="text-base text-muted-foreground">
              Part des dépenses :
            </Text>
            <Text className="text-xl font-semibold text-foreground">
              {slice.percentage.toFixed(0)}%
            </Text>
          </View>

          {/* Add more details here if needed, e.g., comparison to budget */}
          {/*
          <View className="flex-row justify-between items-center pt-2 border-t border-muted-light">
             <Text className="text-base text-muted-foreground">Budget alloué :</Text>
             <Text className="text-lg font-medium text-muted-darker">€XXX,XX</Text>
          </View>
          */}
        </View>
      ) : (
        // Optional: Show a loading or empty state if slice is null when modal is visible
        <Text className="text-center text-muted-foreground py-4">
          Aucune catégorie sélectionnée.
        </Text>
      )}

      {/* Optional Footer Button (Example) */}
      {/*
      <TouchableOpacity
        className="mt-6 bg-primary py-3 px-4 rounded-lg items-center"
        onPress={() => {
          // Action, e.g., navigate to category details
          setIsModalVisible(false);
        }}
      >
        <Text className="text-primary-foreground font-medium text-lg">Voir les transactions</Text>
      </TouchableOpacity>
      */}
    </BottomModal>
  );
};
