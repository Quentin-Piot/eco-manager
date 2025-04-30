import MainLayout from "~/components/layouts/main-layout";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getCategoryDetails } from "~/lib/types/categories";
import { Card } from "~/components/ui/card";
import React, { useMemo, useState } from "react";
import AddExpenseModal, {
  ExpenseData,
} from "~/components/ui/add-expense-modal";
import { colors } from "~/lib/theme";
import type {
  AccountDetailsWithId,
  ExpenseDataFormatted,
} from "~/lib/context/account-context";
import { useAccount } from "~/lib/context/account-context";

const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

const isYesterday = (someDate: Date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    someDate.getDate() === yesterday.getDate() &&
    someDate.getMonth() === yesterday.getMonth() &&
    someDate.getFullYear() === yesterday.getFullYear()
  );
};

const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `<span class="math-inline">\{year\}\-</span>{month}-${day}`;
};

const TransactionItem = ({
  item,
  account,
}: {
  item: ExpenseDataFormatted;
  account?: AccountDetailsWithId;
}) => {
  const categoryInfo = getCategoryDetails(item.mainCategory, item.subcategory);
  const iconName = categoryInfo?.iconName || "help-outline";
  const categoryName = categoryInfo?.mainCategory;

  const categoryColor =
    colors.categories[item.mainCategory as keyof typeof colors.categories] ||
    colors.muted.darker;
  const iconColor = colors.primary.foreground;

  const accountName = account ? account.title : "Compte inconnu";

  return (
    <View className="flex-row items-center border-b-[1px] border-muted/50 py-3">
      <View
        style={[
          { backgroundColor: categoryColor },
          {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          },
        ]}
      >
        <MaterialIcons name={iconName} size={24} color={iconColor} />
      </View>
      <View className="flex-1 mr-2">
        <Text
          className="text-base font-medium text-foreground"
          numberOfLines={1}
        >
          {categoryName}
        </Text>
        <Text
          className="text-xs text-muted-foreground mt-0.5"
          numberOfLines={1}
        >
          {accountName} {item.description ? `(${item.description})` : ""}
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

export default function DetailsScreen() {
  const { accounts, transactions, setTransactions } = useAccount();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const accountsMap = useMemo(() => {
    const map = new Map<string, AccountDetailsWithId>();
    accounts?.forEach((acc) => map.set(acc.id, acc));
    return map;
  }, [accounts]);

  const { todayTotal, currentMonthTotal, groupedTransactions } = useMemo(() => {
    let todaySum = 0;
    let monthSum = 0;

    transactions.forEach((t) => {
      const transactionDate = new Date(t.date);
      if (isToday(transactionDate)) {
        todaySum += t.amountEUR;
      }
      if (
        transactionDate.getMonth() === new Date().getMonth() &&
        transactionDate.getFullYear() === new Date().getFullYear()
      ) {
        monthSum += t.amountEUR;
      }
    });

    const grouped: { [dateGroup: string]: ExpenseDataFormatted[] } = {};
    transactions
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach((t) => {
        const transactionDate = new Date(t.date);
        let groupKey: string;
        if (isToday(transactionDate)) {
          groupKey = "today";
        } else if (isYesterday(transactionDate)) {
          groupKey = "yesterday";
        } else {
          groupKey = formatDateKey(transactionDate);
        }

        if (!grouped[groupKey]) {
          grouped[groupKey] = [];
        }
        grouped[groupKey].push(t);
      });

    return {
      todayTotal: todaySum,
      currentMonthTotal: monthSum,
      groupedTransactions: grouped,
    };
  }, [transactions]);

  const handleAddExpense = (newExpense: ExpenseData) => {
    const categoryDetails = getCategoryDetails(
      newExpense.mainCategory,
      newExpense.subcategory,
    );
    const formattedExpense: ExpenseDataFormatted = {
      id: newExpense.id,
      description: newExpense.remarks,
      amountEUR: newExpense.amount,
      date: newExpense.date,
      accountId: newExpense.accountId,
      mainCategory: newExpense.mainCategory,
      subcategory: newExpense.subcategory,
    };

    setTransactions((prevTransactions) => [
      formattedExpense,
      ...prevTransactions,
    ]);
    setIsModalVisible(false);
  };

  return (
    <MainLayout
      pageName={"Dépenses Détaillées"}
      fab={
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          className="bg-primary p-3 rounded-full shadow-md absolute justify-center items-center right-6 width-50 height-50 z-10"
          style={
            Platform.OS === "ios"
              ? {
                  bottom: 120,
                }
              : { bottom: 45 }
          }
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      }
    >
      <ScrollView>
        <Card className={"mb-4 bg-card/80 border-border/50"}>
          <View className="p-4 flex-row justify-between items-center">
            <View>
              <Text className="text-sm text-muted-foreground">
                Dépenses du mois
              </Text>
              <Text className="text-2xl font-bold text-foreground">
                € {currentMonthTotal.toFixed(2).replace(".", ",")}
              </Text>
              <Text className="text-xs text-muted-foreground mt-1">
                Aujourd'hui: € {todayTotal.toFixed(2).replace(".", ",")}
              </Text>
            </View>
          </View>
        </Card>

        {Object.entries(groupedTransactions).map(([dateGroup, items]) => (
          <View key={dateGroup} className="mb-4">
            <Text className="text-lg font-semibold text-foreground mb-2 px-1">
              {dateGroup === "today"
                ? "Aujourd'hui"
                : dateGroup === "yesterday"
                  ? "Hier"
                  : dateGroup}
            </Text>
            <Card className="p-4">
              {items.map((item) => (
                <TransactionItem
                  key={item.id}
                  item={item}
                  account={accountsMap.get(item.accountId)}
                />
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>

      <AddExpenseModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddExpense}
        accounts={accounts || []}
      />
    </MainLayout>
  );
}
