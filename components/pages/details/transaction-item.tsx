import type {
  AccountDetailsWithId,
  ExpenseData,
} from "~/lib/context/account-context";
import { getCategoryDetails } from "~/lib/types/categories";
import React, { useMemo, useState } from "react";
import { colors } from "~/lib/theme";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import EditExpenseModal from "./edit-expense-modal";
import { formatAmountWithSign } from "~/lib/utils";

type TransactionItemProps = {
  item: ExpenseData;
  account?: AccountDetailsWithId;
  accounts?: AccountDetailsWithId[];
};
export const TransactionItem = ({
  item,
  account,
  accounts = [],
}: TransactionItemProps) => {
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
  const accountName = account ? account.title : "Compte inconnu";

  const handlePress = () => {
    setIsEditModalVisible(true);
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        className="flex-row items-center border-b-[1px] border-muted/50 py-3"
      >
        <View
          className="w-10 h-10 rounded-full justify-center items-center mr-3"
          style={{ backgroundColor: categoryColor }}
        >
          <MaterialIcons name={iconName} size={24} color={iconColor} />
        </View>
        <View className="flex-1 mr-2">
          <Text
            className="text-base font-medium text-foreground"
            numberOfLines={1}
          >
            {item.remarks || categoryInfo?.label}
          </Text>
          <Text
            className="text-xs text-muted-foreground mt-0.5"
            numberOfLines={1}
          >
            {accountName}
          </Text>
        </View>
        <View className="items-end">
          <Text
            className={`text-base font-semibold ${item.type === "income" ? "text-green-600" : "text-red-600"}`}
          >
            {formatAmountWithSign(item.amount, item.type)}
          </Text>
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
