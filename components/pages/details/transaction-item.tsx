import type { ExpenseData } from "~/lib/context/account-context";
import { getCategoryDetails } from "~/lib/types/categories";
import React, { useMemo, useState } from "react";
import { colors } from "~/lib/theme";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import EditExpenseModal from "./edit-expense-modal";
import { formatAmountWithSign } from "~/lib/utils";
import { useIndicatorColors } from "~/lib/context/indicator-colors-context";

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
  const { getColorForCategory } = useIndicatorColors();
  const categoryColor = getColorForCategory(item.mainCategory);
  const iconColor = colors.primary.foreground;

  const handlePress = () => {
    setIsEditModalVisible(true);
  };

  const ios18IncomeColor = colors.success;
  const ios18ExpenseColor = colors.error;

  return (
    <View className=" dark:bg-neutral-900 border-b border-b-muted-light px-4 py-1">
      <TouchableOpacity
        onPress={handlePress}
        className="flex-row items-center py-2 px-0"
      >
        <View
          className="w-8 h-8 rounded-full justify-center items-center mr-4"
          style={{ backgroundColor: categoryColor }}
        >
          <MaterialIcons name={iconName} size={18} color={iconColor} />
        </View>
        <View className="flex-1 mr-2">
          <Text
            className="text-base text-neutral-900 dark:text-neutral-100"
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
                style={{ marginRight: 4 }}
              />
            )}
            <Text
              className={`text-lg font-semibold`}
              style={{
                color:
                  item.type === "income" ? ios18IncomeColor : ios18ExpenseColor,
              }}
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
