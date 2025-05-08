import type {
  AccountDetailsWithId,
  ExpenseDataFormatted,
} from "~/lib/context/account-context";
import { getCategoryDetails } from "~/lib/types/categories";
import React, { useMemo } from "react";
import { colors } from "~/lib/theme";
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type TransactionItemProps = {
  item: ExpenseDataFormatted;
  account?: AccountDetailsWithId;
};
export const TransactionItem = ({ item, account }: TransactionItemProps) => {
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

  return (
    <View className="flex-row items-center border-b-[1px] border-muted/50 py-3">
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
          {item.description || categoryInfo?.label}
        </Text>
        <Text
          className="text-xs text-muted-foreground mt-0.5"
          numberOfLines={1}
        >
          {accountName}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-base font-semibold text-foreground">
          € {item.amountEUR.toFixed(2).replace(".", ",")}
        </Text>
        {item.amountOriginal && (
          <Text className="text-xs text-muted-foreground mt-0.5">
            {item.amountOriginal}
          </Text>
        )}
      </View>
    </View>
  );
};
