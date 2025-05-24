import { SpendingCard } from "@/components/ui/spending-card";
import { TouchableOpacity, View } from "react-native";
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
import { MonthlyBudgetModal } from "@/components/ui/monthly-budget-modal";
import { endOfMonth, isToday, isWithinInterval, startOfMonth } from "date-fns";
import { colors } from "~/lib/theme";
import { Container } from "~/components/ui/container";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface SummaryCardProps {
  title: string;
  value: number;
  todayValue?: number;
  secondValue?: number;
  valueColorClass?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress?: () => void;
  subtitle?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  secondValue,
  todayValue,
  valueColorClass,
  iconName,
  iconColor,
  onPress,
  subtitle,
}) => {
  const formattedValue = value.toFixed(0).replace(".", ",");
  const formattedSecondValue = secondValue?.toFixed(0).replace(".", ",");
  return onPress ? (
    <TouchableOpacity className={"flex-1 basis-[48%]"} onPress={onPress}>
      <Card className={"relative"}>
        <MaterialIcons
          className={"absolute right-3 top-3"}
          size={12}
          name="edit"
          color={colors.muted.foreground}
        />

        <CardHeader className="flex-row items-center justify-between space-y-0 pb-1">
          <View className="flex-row items-center">
            {iconName && (
              <View className={"w-6"}>
                <Ionicons
                  name={iconName}
                  size={14}
                  color={iconColor || "#6b7280"}
                  className="mr-2"
                />
              </View>
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
        <CardContent className="pt-0 pb-2 pl-6">
          <Text
            className={`text-xl font-bold text-neutral-900 dark:text-neutral-50 ${valueColorClass || ""}`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title === "Taux d'Épargne"
              ? `${formattedValue}%`
              : `${formattedValue} €`}

            {formattedSecondValue ? (
              <Text
                className={`text-sm font-bold text-muted-foreground`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {" "}
                /{formattedSecondValue} €
              </Text>
            ) : null}
          </Text>
          {subtitle && (
            <Text
              className="text-xs text-neutral-500 dark:text-neutral-400"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle}
            </Text>
          )}
          {todayValue !== undefined && (
            <Text
              className="text-xs text-neutral-500 dark:text-neutral-400 mt-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {todayValue >= 0 ? "+ " : ""}
              {todayValue.toFixed(0).replace(".", ",")} € aujourd'hui
            </Text>
          )}
        </CardContent>
      </Card>
    </TouchableOpacity>
  ) : (
    <Card className={"flex-1 basis-[48%]"}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-1">
        <View className="flex-row items-center">
          {iconName && (
            <View className={"w-6"}>
              <Ionicons
                name={iconName}
                size={14}
                color={iconColor || "#6b7280"}
              />
            </View>
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
      <CardContent className="pt-0 pb-2 pl-6">
        <Text
          className={`text-xl font-bold text-neutral-900 dark:text-neutral-50 ${valueColorClass || ""}`}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title === "Taux d'Épargne"
            ? `${formattedValue}%`
            : `${formattedValue} €`}
        </Text>
        {subtitle && (
          <Text
            className="text-xs text-neutral-500 dark:text-neutral-400"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {subtitle}
          </Text>
        )}
        {todayValue !== undefined && (
          <Text
            className="text-xs text-neutral-500 dark:text-neutral-400"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {todayValue >= 0 ? "+ " : ""}
            {todayValue.toFixed(0).replace(".", ",")} € aujourd'hui
          </Text>
        )}
      </CardContent>
    </Card>
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
      todayValue={today}
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

const RemainingBudgetCard: React.FC<{
  monthlyExpenses: number;
  monthlySpendingTarget: number;
  onPress?: () => void;
}> = ({ monthlyExpenses, monthlySpendingTarget, onPress }) => {
  const remaining = monthlySpendingTarget - monthlyExpenses;
  const color = remaining >= 0 ? "#1D7BF2" : "#EF4444";

  return (
    <SummaryCard
      title="Budget Restant"
      value={remaining}
      valueColorClass={
        remaining >= 0
          ? "text-blue-600 dark:text-blue-400"
          : "text-red-600 dark:text-red-400"
      }
      iconName="cash-outline"
      iconColor={color}
      onPress={onPress}
      subtitle={`sur ${monthlySpendingTarget.toFixed(0)}€`}
    />
  );
};

export default function DashboardScreen() {
  const {
    spendingCategories,
    transactions,
    updateBudget,
    monthlyBudget,
    updateMonthlyBudget,
  } = useAccount();

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

  // Calcul du total des budgets par catégorie
  const totalCategoryBudgets = useMemo(() => {
    return spendingCategories.reduce(
      (total, category) => total + category.budgetAmount,
      0,
    );
  }, [spendingCategories]);

  const {
    todayExpenses,
    todayIncomes,
    monthlyExpenses,
    monthlyIncomes,
    monthlyNetFlow,
    todayNetFlow,
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

    return {
      todayIncomes: todayIncomesSum,
      todayExpenses: todayExpensesSum,
      monthlyExpenses: currentMonthExpenses,
      monthlyIncomes: currentMonthIncomes,
      monthlyNetFlow: currentMonthlyNetFlow,
      todayNetFlow: currentTodayNetFlow,
    };
  }, [transactions]);

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
        categoryTotals.set(category, currentTotal + transaction.amount);
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
          totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
        return {
          label: mainCategoryDetailsMap[category].label,
          value: amount,
          color: colors.categories[category] || "#cccccc",
          percentage: percentage,
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
          categorySpending.set(category, currentAmount + transaction.amount);
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

  const handleSaveMonthlyBudget = (newBudget: number) => {
    updateMonthlyBudget(newBudget);
  };

  return (
    <MainLayout pageName={"Tableau de bord"}>
      <Container
        title={"Résumé mensuel"}
        className="flex-row flex-wrap justify-between gap-3 w-full mb-4"
      >
        <RemainingBudgetCard
          monthlyExpenses={monthlyExpenses}
          monthlySpendingTarget={monthlyBudget || totalCategoryBudgets}
          onPress={() => setIsMonthlyBudgetModalVisible(true)}
        />
        <NetFlowCard monthly={monthlyNetFlow} today={todayNetFlow} />
        <ExpensesCard monthly={monthlyExpenses} today={todayExpenses} />
        <IncomeCard monthly={monthlyIncomes} today={todayIncomes} />
      </Container>

      <Container title={"Aperçu des Dépenses Mensuelles"}>
        <Card>
          <CardContent>
            <Chart
              data={chartData}
              onSlicePress={handleSlicePress}
              selectedSlice={selectedSlice ?? undefined}
            />
          </CardContent>
        </Card>
      </Container>

      <Container title={"Budgets"} className="flex-row flex-wrap gap-3">
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
        totalCategoryBudgets={totalCategoryBudgets}
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
