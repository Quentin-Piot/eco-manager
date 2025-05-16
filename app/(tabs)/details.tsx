import MainLayout from "~/components/layouts/main-layout";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import React, { useMemo, useState } from "react";
import AddExpenseModal from "~/components/ui/add-expense-modal";
import type {
  AccountDetailsWithId,
  ExpenseData,
} from "~/lib/context/account-context";
import { useAccount } from "~/lib/context/account-context";
import { format, isToday, isYesterday } from "date-fns";
import { TransactionItem } from "~/components/pages/details/transaction-item";
import { fr } from "date-fns/locale/fr";
import { capitalizeFirstLetter } from "~/lib/utils";
import { useBackground } from "~/lib/context/background";

/**
 * Formats a date object to a string in the format "yyyy-MM-dd"
 * Used as a consistent key for grouping transactions
 */
const formatDateKey = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

interface SummaryCardProps {
  title: string;
  value: number;
  todayValue?: number;
  valueColorClass?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  todayValue,
  valueColorClass,
}) => {
  return (
    <Card className={"flex-1 basis-[30%]"}>
      <CardHeader className="flex-row items-center justify-between space-y-0 mb-2">
        <CardTitle className="text-sm font-medium text-primary-darker">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-0 pb-2 pt-0">
        <Text className={`text-xl font-bold ${valueColorClass || ""}`}>
          {value.toFixed(0).replace(".", ",")} €
        </Text>
      </CardContent>
    </Card>
  );
};

/**
 * Component specifically for displaying the balance summary.
 */
const BalanceCard: React.FC<{ balance: number }> = ({ balance }) => {
  return (
    <SummaryCard
      title="Balance"
      value={balance}
      valueColorClass={balance >= 0 ? "text-green-600" : "text-red-600"}
    />
  );
};

const ExpensesCard: React.FC<{ monthly: number; today: number }> = ({
  monthly,
  today,
}) => {
  return (
    <SummaryCard
      title="Dépenses"
      value={monthly}
      todayValue={today}
      valueColorClass="text-red-600"
    />
  );
};
const IncomeCard: React.FC<{ monthly: number; today: number }> = ({
  monthly,
  today,
}) => {
  return (
    <SummaryCard
      title="Revenus"
      value={monthly}
      todayValue={today}
      valueColorClass="text-green-600"
    />
  );
};

export default function DetailsScreen() {
  const { accounts, transactions } = useAccount();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { removeBlur } = useBackground();

  const accountsMap = useMemo(() => {
    const map = new Map<string, AccountDetailsWithId>();
    accounts?.forEach((acc) => map.set(acc.id, acc));
    return map;
  }, [accounts]);

  const {
    todayExpenses,
    todayIncomes,
    monthlyExpenses,
    monthlyIncomes,
    monthlyBalance,
    groupedTransactions,
  } = useMemo(() => {
    let todayExpensesSum = 0;
    let todayIncomesSum = 0;
    let currentMonthExpenses = 0;
    let currentMonthIncomes = 0;
    const now = new Date();

    transactions.forEach((t) => {
      const transactionDate = new Date(t.date);
      const isIncome = t.mainCategory === "income" || t.type === "income";
      const amount = t.amount;

      if (isToday(transactionDate)) {
        if (isIncome) {
          todayIncomesSum += amount;
        } else {
          todayExpensesSum += amount;
        }
      }

      if (
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === now.getFullYear()
      ) {
        if (isIncome) {
          currentMonthIncomes += amount;
        } else {
          currentMonthExpenses += amount;
        }
      }
    });

    const currentMonthlyBalance = currentMonthIncomes - currentMonthExpenses;

    const grouped: Record<any, ExpenseData[]> = {};
    transactions
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach((t) => {
        const transactionDate = new Date(t.date);
        let groupKey;

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
      todayIncomes: todayIncomesSum,
      todayExpenses: todayExpensesSum,
      monthlyExpenses: currentMonthExpenses,
      monthlyIncomes: currentMonthIncomes,
      monthlyBalance: currentMonthlyBalance,
      groupedTransactions: grouped,
    };
  }, [transactions]);

  const formatDateDisplay = (dateKey: string): string => {
    if (dateKey === "today") {
      return "Aujourd'hui";
    }
    if (dateKey === "yesterday") {
      return "Hier";
    }
    const date = new Date(dateKey);
    return capitalizeFirstLetter(format(date, "EEEE d MMMM", { locale: fr }));
  };

  return (
    <MainLayout
      pageName={"Transactions Détaillées"}
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
        <Text className="text-lg font-semibold text-foreground mb-2 px-1">
          Résumé mensuel
        </Text>
        <View className="flex-row flex-wrap gap-3 w-full mb-4">
          <BalanceCard balance={monthlyBalance} />
          <ExpensesCard monthly={monthlyExpenses} today={todayExpenses} />
          <IncomeCard monthly={monthlyIncomes} today={todayIncomes} />
        </View>

        {Object.entries(groupedTransactions).map(([dateGroup, items]) => (
          <View key={dateGroup} className="mb-4">
            <Text className="text-lg font-semibold text-foreground mb-2 px-1">
              {formatDateDisplay(dateGroup)}
            </Text>
            <Card className="px-4 py-0">
              {items.map((item) => (
                <TransactionItem
                  key={item.id}
                  item={item}
                  account={accountsMap.get(item.accountId)}
                  accounts={accounts}
                />
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>

      <AddExpenseModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          removeBlur();
        }}
        accounts={accounts || []}
      />
    </MainLayout>
  );
}
