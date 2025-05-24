import type { ExpenseData } from "~/lib/context/account-context";
import { getCategoryDetails } from "~/lib/types/categories";
import React, { useMemo, useState } from "react";
import { colors } from "~/lib/theme";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Using MaterialIcons as in original code
import EditExpenseModal from "./edit-expense-modal";
import { formatAmountWithSign } from "~/lib/utils";

type TransactionItemProps = {
  item: ExpenseData;
};

export const TransactionItem = ({ item }: TransactionItemProps) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const categoryInfo = getCategoryDetails(item.mainCategory, item.subcategory);
  const iconName = useMemo(
    () => categoryInfo?.iconName,
    [categoryInfo?.iconName],
  );
  const categoryColor =
    colors.categories[item.mainCategory as keyof typeof colors.categories] ||
    colors.muted.darker;
  const iconColor = colors.primary.foreground; // Assuming primary.foreground is a good contrast color

  const handlePress = () => {
    setIsEditModalVisible(true);
  };

  const ios18IncomeColor = colors.success; // iOS 18 style blue for income
  const ios18ExpenseColor = colors.error; // iOS 18 style red for expense

  return (
    <View className=" dark:bg-neutral-900 border-b border-b-muted-light px-4 py-1">
      {/* Background applied to container */}
      <TouchableOpacity
        onPress={handlePress}
        className="flex-row items-center py-2 px-0" // Adjusted padding
      >
        <View
          className="w-8 h-8 rounded-full justify-center items-center mr-4" // Larger icon size and margin
          style={{ backgroundColor: categoryColor }}
        >
          <MaterialIcons name={iconName} size={18} color={iconColor} />
          {/* Increased icon size */}
        </View>
        <View className="flex-1 mr-2">
          <Text
            className="text-base text-neutral-900 dark:text-neutral-100" // Adjusted text size/color
            numberOfLines={1}
          >
            {item.remarks || categoryInfo?.label}
          </Text>
        </View>
        <View className="items-end">
          <View className="flex-row items-center">
            {item.recurrence && item.recurrence !== "none" && (
              <MaterialIcons
                name={"repeat"}
                size={16}
                color={colors.muted.foreground}
                style={{ marginRight: 4 }} // Space between repeat icon and amount
              />
            )}
            <Text
              className={`text-lg font-semibold`} // Adjusted font weight (semibold is common in iOS)
              style={{
                color:
                  item.type === "income" ? ios18IncomeColor : ios18ExpenseColor,
              }} // Apply color directly
            >
              {formatAmountWithSign(item.amount, item.type)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {isEditModalVisible && (
        <EditExpenseModal
          isVisible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          transaction={item}
        />
      )}
    </View>
  );
};
