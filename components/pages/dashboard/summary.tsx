import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "~/lib/theme";
import { Text } from "~/components/ui/text";

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
export const ExpensesCard: React.FC<{ monthly: number; today: number }> = ({
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
export const IncomeCard: React.FC<{ monthly: number; today: number }> = ({
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
export const NetFlowCard: React.FC<{ monthly: number; today: number }> = ({
  monthly,
  today,
}) => {
  const color = monthly >= 0 ? "#007AFF" : "#EF4444";
  return (
    <SummaryCard
      title="Balance Mensuelle"
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
export const RemainingBudgetCard: React.FC<{
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
