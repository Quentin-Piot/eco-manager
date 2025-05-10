import { BankAccountCard } from "@/components/ui/bank-account-card";
import { SpendingCard } from "@/components/ui/spending-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { View } from "react-native";
import MainLayout from "~/components/layouts/main-layout";
import React, { useMemo, useState } from "react";
import { PieChartTouchLayer, PieSlice } from "~/components/charts/category-pie";
import { SliceInfoModal } from "~/components/charts/slice-info-modal";
import {
  mainCategoryDetailsMap,
  MainExpenseCategory,
} from "~/lib/types/categories";
import {
  SpendingCategoryWithValue,
  useAccount,
} from "~/lib/context/account-context";
import { EditBudgetModal } from "@/components/ui/edit-budget-modal";
import { endOfMonth, isWithinInterval, startOfMonth } from "date-fns";
import { colors } from "~/lib/theme";

export default function DashboardScreen() {
  const { accounts, spendingCategories, transactions, updateBudget } =
    useAccount();

  const [selectedSlice, setSelectedSlice] = useState<PieSlice | null>(null);
  const [isSliceModalVisible, setIsSliceModalVisible] =
    useState<boolean>(false);

  const [isBudgetModalVisible, setIsBudgetModalVisible] =
    useState<boolean>(false);
  const [selectedCategoryForBudget, setSelectedCategoryForBudget] = useState<{
    type: MainExpenseCategory;
    currentBudget: number;
  } | null>(null);

  const chartData: PieSlice[] = useMemo(() => {
    // Get current month's transactions
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Filter transactions for current month only
    const currentMonthTransactions = transactions.filter((transaction) =>
      isWithinInterval(transaction.date, { start: monthStart, end: monthEnd }),
    );

    // Group transactions by main category and sum values
    const categoryTotals = new Map<MainExpenseCategory, number>();
    currentMonthTransactions.forEach((transaction) => {
      if (transaction.mainCategory !== "income") {
        const category = transaction.mainCategory as MainExpenseCategory;
        const currentTotal = categoryTotals.get(category) || 0;
        categoryTotals.set(category, currentTotal + transaction.amountEUR);
      }
    });

    // Calculate total spending
    const totalSpending = Array.from(categoryTotals.values()).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    // Convert to PieSlice format
    return Array.from(categoryTotals.entries())
      .filter(([_, amount]) => amount > 0) // Only include categories with spending
      .map(([category, amount]) => {
        const percentage =
          totalSpending > 0 ? ((amount / totalSpending) * 100).toFixed(1) : "0";
        return {
          label: mainCategoryDetailsMap[category].label,
          value: amount,
          color: colors.categories[category] || "#cccccc",
          percentage: `${percentage}%`,
          type: category,
        };
      });
  }, [transactions]);

  const spendingCategoriesWithValue: SpendingCategoryWithValue[] =
    useMemo(() => {
      // Get current month's transactions
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      // Filter transactions for current month only
      const currentMonthTransactions = transactions.filter((transaction) =>
        isWithinInterval(transaction.date, {
          start: monthStart,
          end: monthEnd,
        }),
      );

      // Create a map to store total spending by category
      const categorySpending = new Map<MainExpenseCategory, number>();

      // Sum up spending by main category
      currentMonthTransactions.forEach((transaction) => {
        if (transaction.mainCategory !== "income") {
          const category = transaction.mainCategory as MainExpenseCategory;
          const currentAmount = categorySpending.get(category) || 0;
          categorySpending.set(category, currentAmount + transaction.amountEUR);
        }
      });

      // Convert spending categories to SpendingCategoryWithValue format
      return spendingCategories.map((category) => {
        const currentAmount = categorySpending.get(category.type) || 0;
        const percentage =
          category.budgetAmount > 0
            ? Math.min(
                100,
                Math.round((currentAmount / category.budgetAmount) * 100),
              )
            : 0;

        return {
          type: category.type,
          budgetAmount: category.budgetAmount,
          currentAmount: currentAmount.toFixed(2),
          percentage,
        };
      });
    }, [spendingCategories, transactions]);

  const handleSlicePress = (slice: PieSlice) => {
    setSelectedSlice(slice);
    setIsSliceModalVisible(true);
  };

  const handleSpendingCardPress = (category: {
    type: MainExpenseCategory;
    budgetAmount: number;
  }) => {
    setSelectedCategoryForBudget({
      type: category.type,
      currentBudget: category.budgetAmount,
    });
    setIsBudgetModalVisible(true);
  };

  const handleSaveBudget = (
    categoryType: MainExpenseCategory,
    newBudget: number,
  ) => {
    updateBudget(categoryType, newBudget);
    setIsBudgetModalVisible(false);
  };

  return (
    <MainLayout pageName={"Tableau de bord"}>
      <View className="flex-row flex-wrap gap-3 w-full mb-4">
        <View className="flex-1 basis-[45%]">
          <BankAccountCard accounts={accounts} type="current" />
        </View>
        <View className="flex-1 basis-[45%]">
          <BankAccountCard accounts={accounts} type="savings" />
        </View>
      </View>

      <Card className={"py-6 mb-4"}>
        <CardHeader>
          <CardTitle>Aperçu des Dépenses Mensuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            data={chartData}
            onSlicePress={handleSlicePress}
            selectedSlice={selectedSlice ?? undefined}
          />
        </CardContent>
      </Card>

      <View className="flex-row flex-wrap gap-3 mb-4">
        {spendingCategoriesWithValue.map((category) => (
          <SpendingCard
            key={category.type}
            currentAmount={category.currentAmount}
            budgetAmount={category.budgetAmount}
            percentage={category.percentage}
            category={category.type}
            onPress={() => handleSpendingCardPress(category)}
          />
        ))}
      </View>

      <SliceInfoModal
        isVisible={isSliceModalVisible}
        setIsModalVisible={setIsSliceModalVisible}
        slice={selectedSlice}
      />

      <EditBudgetModal
        isVisible={isBudgetModalVisible}
        onClose={() => setIsBudgetModalVisible(false)}
        categoryType={selectedCategoryForBudget?.type ?? null}
        currentBudget={selectedCategoryForBudget?.currentBudget ?? null}
        onSave={handleSaveBudget}
      />
    </MainLayout>
  );
}

type ChartProps = {
  data: PieSlice[];
  onSlicePress: (slice: PieSlice) => void;
  selectedSlice?: PieSlice;
};

const Chart = ({ data, onSlicePress, selectedSlice }: ChartProps) => {
  return (
    <View
      style={{
        height: 200,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PieChartTouchLayer
        data={data}
        onSlicePress={onSlicePress}
        selectedSlice={selectedSlice}
      />
    </View>
  );
};
