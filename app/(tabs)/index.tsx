import { SpendingCard } from "@/components/ui/spending-card";
import { TouchableOpacity, View } from "react-native";
import MainLayout from "~/components/layouts/main-layout";
import React, { useMemo, useState } from "react";
import EvolutionPie from "~/components/charts/evolution-stacked-bar";
import PieChart, {
  PieChartTouchLayer,
  PieSlice,
} from "~/components/charts/category-pie";
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
import { MonthlyBudgetModal } from "@/components/ui/monthly-budget-modal";
import {
  addMonths,
  endOfMonth,
  format,
  isToday,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import { Container } from "~/components/ui/container";
import { Card, CardContent } from "~/components/ui/card";
import { useIndicatorColors } from "~/lib/context/indicator-colors-context";
import {
  NetFlowCard,
  RemainingBudgetCard,
} from "~/components/pages/dashboard/summary";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardScreen() {
  const {
    spendingCategories,
    transactions,
    updateBudget,
    monthlyBudget,
    updateMonthlyBudget,
  } = useAccount();

  const { getColorForCategory } = useIndicatorColors();

  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const [selectedSlice, setSelectedSlice] = useState<PieSlice | null>(null);
  const [isSliceModalVisible, setIsSliceModalVisible] =
    useState<boolean>(false);

  const [isBudgetModalVisible, setIsBudgetModalVisible] =
    useState<boolean>(false);
  const [selectedCategoryForBudget, setSelectedCategoryForBudget] = useState<{
    type: MainExpenseCategory;
    currentBudget: number;
  } | null>(null);

  const [isMonthlyBudgetModalVisible, setIsMonthlyBudgetModalVisible] =
    useState<boolean>(false);

  // Fonctions pour naviguer entre les mois
  const goToPreviousMonth = () => {
    setSelectedMonth((prevMonth) => subMonths(prevMonth, 1));
  };

  const goToNextMonth = () => {
    setSelectedMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  const formattedMonthYear = format(selectedMonth, "MMMM yyyy", { locale: fr });
  const capitalizedMonthYear =
    formattedMonthYear.charAt(0).toUpperCase() + formattedMonthYear.slice(1);

  const totalCategoryBudgets = useMemo(() => {
    return spendingCategories.reduce(
      (total, category) => total + category.budgetAmount,
      0,
    );
  }, [spendingCategories]);

  const { monthlyExpenses, monthlyNetFlow, todayNetFlow } = useMemo(() => {
    let todayExpensesSum = 0;
    let todayIncomesSum = 0;
    let currentMonthExpenses = 0;
    let currentMonthIncomes = 0;
    const now = new Date();
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);

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
        isWithinInterval(transactionDate, { start: monthStart, end: monthEnd })
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

    return {
      todayIncomes: todayIncomesSum,
      todayExpenses: todayExpensesSum,
      monthlyExpenses: currentMonthExpenses,
      monthlyIncomes: currentMonthIncomes,
      monthlyNetFlow: currentMonthlyNetFlow,
      todayNetFlow: currentTodayNetFlow,
    };
  }, [transactions, selectedMonth]);

  const chartData: PieSlice[] = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);

    const currentMonthTransactions = transactions.filter((transaction) =>
      isWithinInterval(transaction.date, { start: monthStart, end: monthEnd }),
    );

    const categoryTotals = new Map<MainExpenseCategory, number>();
    currentMonthTransactions.forEach((transaction) => {
      if (transaction.mainCategory !== "income") {
        const category = transaction.mainCategory as MainExpenseCategory;
        const currentTotal = categoryTotals.get(category) || 0;
        categoryTotals.set(category, currentTotal + transaction.amount);
      }
    });

    const totalSpending = Array.from(categoryTotals.values()).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    return Array.from(categoryTotals.entries())
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => {
        const percentage =
          totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
        return {
          label: mainCategoryDetailsMap[category].label,
          value: amount,
          color: getColorForCategory(category),
          percentage: percentage,
          type: category,
        };
      });
  }, [getColorForCategory, transactions, selectedMonth]);

  const spendingCategoriesWithValue: SpendingCategoryWithValue[] =
    useMemo(() => {
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);

      const currentMonthTransactions = transactions.filter((transaction) =>
        isWithinInterval(transaction.date, {
          start: monthStart,
          end: monthEnd,
        }),
      );

      const categorySpending = new Map<MainExpenseCategory, number>();

      currentMonthTransactions.forEach((transaction) => {
        if (transaction.mainCategory !== "income") {
          const category = transaction.mainCategory as MainExpenseCategory;
          const currentAmount = categorySpending.get(category) || 0;
          categorySpending.set(category, currentAmount + transaction.amount);
        }
      });

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
    }, [spendingCategories, transactions, selectedMonth]);

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

  const handleSaveMonthlyBudget = (newBudget: number) => {
    updateMonthlyBudget(newBudget);
  };

  // Vérifier si le mois sélectionné est le mois actuel
  const isCurrentMonth = useMemo(() => {
    const now = new Date();
    return (
      selectedMonth.getMonth() === now.getMonth() &&
      selectedMonth.getFullYear() === now.getFullYear()
    );
  }, [selectedMonth]);

  return (
    <MainLayout pageName={"Tableau de bord"}>
      <Container
        title={
          <View className="flex-row items-center justify-between w-full">
            <TouchableOpacity
              className={
                "w-10 h-10 rounded-full flex items-center justify-center z-50"
              }
              onPress={goToPreviousMonth}
            >
              <Ionicons name="chevron-back" size={20} color="#6b7280" />
            </TouchableOpacity>
            <Text className="text-base font-semibold text-neutral-700 dark:text-neutral-300">
              {capitalizedMonthYear}
            </Text>
            <TouchableOpacity
              onPress={goToNextMonth}
              disabled={isCurrentMonth}
              className={
                "w-10 h-10 rounded-full flex items-center justify-center"
              }
              style={{ opacity: isCurrentMonth ? 0.5 : 1 }}
            >
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        }
        className="flex-row flex-wrap justify-between gap-3 w-full"
      >
        <RemainingBudgetCard
          monthlyExpenses={monthlyExpenses}
          monthlySpendingTarget={monthlyBudget || totalCategoryBudgets}
          onPress={() => setIsMonthlyBudgetModalVisible(true)}
        />
        <NetFlowCard
          monthly={monthlyNetFlow}
          today={isCurrentMonth ? todayNetFlow : undefined}
        />
      </Container>

      <Container title={"Aperçu des Dépenses"}>
        <Card>
          <Chart
            data={chartData}
            onSlicePress={handleSlicePress}
            selectedSlice={selectedSlice ?? undefined}
          />
        </Card>
      </Container>

      <Container title={"Budgets"} className="flex-row flex-wrap gap-3">
        {spendingCategoriesWithValue
          .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0))
          .map((category) => (
            <SpendingCard
              key={category.type}
              currentAmount={category.currentAmount}
              budgetAmount={category.budgetAmount}
              percentage={category.percentage}
              category={category.type}
              onPress={() => handleSpendingCardPress(category)}
            />
          ))}
      </Container>

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
      <MonthlyBudgetModal
        isVisible={isMonthlyBudgetModalVisible}
        onClose={() => setIsMonthlyBudgetModalVisible(false)}
        currentBudget={monthlyBudget}
        onSave={handleSaveMonthlyBudget}
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
  const [viewType, setViewType] = useState<"distribution" | "evolution">(
    "distribution",
  );
  return (
    <>
      <View className="flex-row w-[13rem] mb-3 bg-card dark:bg-primary-darker rounded-full overflow-hidden border border-border dark:border-primary-dark">
        <TouchableOpacity
          onPress={() => setViewType("distribution")}
          className={`px-3 py-1 ${viewType === "distribution" ? "bg-primary" : ""}`}
        >
          <Text
            className={cn(
              "font-semibold text-center",
              viewType === "distribution"
                ? "text-primary-foreground dark:text-primary-foreground text-sm"
                : "text-muted-foreground text-sm",
            )}
          >
            Répartition
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewType("evolution")}
          className={`px-3 py-1 flex-1  ${viewType === "evolution" ? "bg-primary" : ""}`}
        >
          <Text
            className={cn(
              "font-semibold text-center",
              viewType === "evolution"
                ? "text-primary-foreground dark:text-primary-foreground text-sm"
                : "text-muted-foreground text-sm",
            )}
          >
            Évolution
          </Text>
        </TouchableOpacity>
      </View>
      <CardContent>
        <View
          style={{
            height: 200,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {viewType === "distribution" ? (
            data.length > 0 ? (
              <>
                <PieChartTouchLayer
                  data={data}
                  onSlicePress={onSlicePress}
                  selectedSlice={selectedSlice}
                />
                <PieChart data={data} />
              </>
            ) : (
              <Text className="text-muted-foreground text-sm">
                Aucune dépense pour ce mois
              </Text>
            )
          ) : (
            <EvolutionPie />
          )}
        </View>
      </CardContent>
    </>
  );
};
