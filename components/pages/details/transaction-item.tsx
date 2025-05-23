import type { ExpenseData } from "~/lib/context/account-context";
import { getCategoryDetails } from "~/lib/types/categories";
import React, { useMemo, useState } from "react";
import { colors } from "~/lib/theme";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Using Ionicons for iOS style
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
  const iconColor = colors.primary.foreground;
  const handlePress = () => {
    setIsEditModalVisible(true);
  };

  const ios18IncomeColor = "#007AFF"; // iOS 18 style blue for income
  const ios18ExpenseColor = "#FF3B30"; // iOS 18 style red for expense

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        className="flex-row items-center py-3 px-0 bg-white dark:bg-neutral-900 rounded-lg" // Added background and rounded corners
      >
        <View
          className="w-10 h-10 rounded-full justify-center items-center mr-3" // Increased icon size
          style={{ backgroundColor: categoryColor }}
        >
          <MaterialIcons name={iconName} size={22} color={iconColor} />
          {/* Increased icon size */}
        </View>
        <View className="flex-1 mr-2">
          <Text
            className="text-lg font-semibold text-neutral-900 dark:text-neutral-100" // Adjusted text style
            numberOfLines={1}
          >
            {item.remarks || categoryInfo?.label}
          </Text>
        </View>
        <View className="items-end">
          <View className="items-end">
            <View className="flex-row items-center">
              <Text
                className={`text-xl font-bold ${
                  item.type === "income" ? ios18IncomeColor : ios18ExpenseColor
                }`}
              >
                {formatAmountWithSign(item.amount, item.type)}
              </Text>
              <View className={"w-6 ml-2"}>
                {item.recurrence && item.recurrence !== "none" && (
                  <MaterialIcons // Using Ionicons for iOS style
                    name={"repeat"}
                    size={16}
                    color={colors.muted.foreground}
                    style={{ marginRight: 4 }}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {isEditModalVisible && (
        <EditExpenseModal
          isVisible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          transaction={item}
          accounts={accounts}
        />
      )}
    </>
  );
};
