import MainLayout from "~/components/layouts/main-layout";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // Keep Ionicons for iOS style
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
import { Container } from "~/components/ui/container";

const formatDateKey = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

interface SummaryCardProps {
  title: string;
  value: number;
  todayValue?: number;
  valueColorClass?: string;
  iconName?: keyof typeof Ionicons.glyphMap; // Use Ionicons
  iconColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  todayValue,
  valueColorClass,
  iconName,
  iconColor,
}) => {
  const formattedValue = value.toFixed(0).replace(".", ","); // Format for Euros

  return (
    <Card className={"flex-1 basis-[48%]"}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-1">
        <View className="flex-row items-center">
          {iconName && (
            <Ionicons // Use Ionicons
              name={iconName}
              size={18}
              color={iconColor || "#6b7280"}
              className="mr-1"
            />
          )}
          <CardTitle
            className="text-sm font-semibold text-neutral-500 dark:text-neutral-400"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </CardTitle>
        </View>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <Text
          className={`text-xl font-bold text-neutral-900 dark:text-neutral-50 ${valueColorClass || ""}`}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {/* Adjusted formatting based on title */}
          {title === "Taux d'Épargne"
            ? `${formattedValue}%`
            : `${formattedValue} €`}
        </Text>
        {todayValue !== undefined && (
          <Text
            className="text-xs text-neutral-500 dark:text-neutral-400 mt-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {todayValue >= 0 ? "+" : ""}
            {todayValue.toFixed(0).replace(".", ",")} € aujourd'hui
          </Text>
        )}
      </CardContent>
    </Card>
  );
};

// BalanceCard has been removed

const ExpensesCard: React.FC<{ monthly: number; today: number }> = ({
  monthly,
  today,
}) => {
  return (
    <SummaryCard
      title="Dépenses"
      value={monthly}
      todayValue={today}
      valueColorClass="text-red-600 dark:text-red-400"
      iconName="trending-down-outline"
      iconColor="#EF4444"
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
      todayValue={today} // Corrected: ensure todayValue is passed
      valueColorClass="text-green-600 dark:text-green-400"
      iconName="trending-up-outline"
      iconColor="#22C55E"
    />
  );
};

const NetFlowCard: React.FC<{ monthly: number; today: number }> = ({
  monthly,
  today,
}) => {
  const color = monthly >= 0 ? "#007AFF" : "#EF4444";
  return (
    <SummaryCard
      title="Flux Net"
      value={monthly}
      todayValue={today}
      valueColorClass={
        monthly >= 0
          ? "text-blue-600 dark:text-blue-400"
          : "text-red-600 dark:text-red-400"
      }
      iconName="stats-chart-outline"
      iconColor={color}
    />
  );
};

// New Remaining Budget Card
const RemainingBudgetCard: React.FC<{
  monthlyExpenses: number;
  monthlySpendingTarget: number;
}> = ({ monthlyExpenses, monthlySpendingTarget }) => {
  const remaining = monthlySpendingTarget - monthlyExpenses;
  const color = remaining >= 0 ? "#1D7BF2" : "#EF4444"; // Blue for positive, Red for negative (over budget)

  return (
    <SummaryCard
      title="Budget Restant"
      value={remaining}
      valueColorClass={
        remaining >= 0
          ? "text-blue-600 dark:text-blue-400"
          : "text-red-600 dark:text-red-400"
      }
      iconName="cash-outline" // Appropriate icon for budget
      iconColor={color}
    />
  );
};

export default function DetailsScreen() {
  const { accounts, transactions } = useAccount();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { removeBlur } = useBackground();

  // Define a monthly spending target for demonstration. This should ideally come from user settings.
  const monthlySpendingTarget = 2500; // Example: User aims to spend no more than 2500€ per month

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
    monthlyNetFlow,
    todayNetFlow,
    groupedTransactions, // Ensure groupedTransactions is returned from useMemo
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

    const currentMonthlyNetFlow = currentMonthIncomes - currentMonthExpenses;
    const currentTodayNetFlow = todayIncomesSum - todayExpensesSum;

    // Grouping transactions remains the same
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
      monthlyNetFlow: currentMonthlyNetFlow,
      todayNetFlow: currentTodayNetFlow,
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
      pageName={"Transactions"}
      fab={
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          className="absolute justify-center items-center right-6 w-14 h-14 rounded-full z-10"
          style={
            Platform.OS === "ios"
              ? {
                  bottom: 100,
                  backgroundColor: "#007AFF",
                  shadowColor: "#007AFF",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }
              : { bottom: 45, backgroundColor: "#007AFF" }
          }
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      }
    >
      <Container
        title={"Résumé mensuel"}
        className="flex-row flex-wrap justify-between gap-3 w-full mb-4"
      >
        {/* Replaced BalanceCard with RemainingBudgetCard */}
        <RemainingBudgetCard
          monthlyExpenses={monthlyExpenses}
          monthlySpendingTarget={monthlySpendingTarget}
        />
        <NetFlowCard monthly={monthlyNetFlow} today={todayNetFlow} />
        <ExpensesCard monthly={monthlyExpenses} today={todayExpenses} />
        <IncomeCard monthly={monthlyIncomes} today={todayIncomes} />
        {/* Corrected todayValue prop */}
      </Container>

      <Container title={"Historique des transactions"}>
        {Object.entries(groupedTransactions).map(([dateGroup, items]) => (
          <View key={dateGroup} className="mb-4">
            <View className={"flex-row items-center justify-between mb-2 px-1"}>
              <Text
                className="text-base font-semibold text-neutral-700 dark:text-neutral-200"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {formatDateDisplay(dateGroup)}
              </Text>
              <Text
                className="text-base font-semibold text-neutral-700 dark:text-neutral-200"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {items
                  .reduce(
                    (acc, v) =>
                      v.type === "expense" ? acc - v.amount : acc + v.amount,
                    0,
                  )
                  .toFixed(2)}{" "}
                €
              </Text>
            </View>
            <Card className="px-0 py-0">
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
      </Container>

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
