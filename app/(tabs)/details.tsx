import MainLayout from "~/components/layouts/main-layout";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card } from "~/components/ui/card";
import React, { useMemo, useState } from "react";
import AddExpenseModal, {
  ExpenseData,
} from "~/components/ui/add-expense-modal";
import type {
  AccountDetailsWithId,
  ExpenseDataFormatted,
} from "~/lib/context/account-context";
import { useAccount } from "~/lib/context/account-context";
import { format, isToday, isYesterday } from "date-fns";
import { ja } from "date-fns/locale";
import { TransactionItem } from "~/components/pages/details/transaction-item";

const formatDateKey = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
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
    const now = new Date();

    transactions.forEach((t) => {
      const transactionDate = new Date(t.date);
      if (isToday(transactionDate)) {
        todaySum += t.amountEUR;
      }
      if (
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === now.getFullYear()
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

  const formatDateDisplay = (dateKey: string): string => {
    if (dateKey === "today") {
      return "Aujourd'hui";
    }
    if (dateKey === "yesterday") {
      return "Hier";
    }
    const date = new Date(dateKey);
    return format(date, "EEEE d MMMM", { locale: ja });
  };

  return (
    <MainLayout
      pageName={"Dépenses Détaillées"}
      fab={
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          className="bg-primary p-3 rounded-full shadow-md absolute justify-center items-center right-6 w-12 h-12 z-10"
          style={Platform.OS === "ios" ? { bottom: 120 } : { bottom: 45 }}
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
              {formatDateDisplay(dateGroup)}
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
