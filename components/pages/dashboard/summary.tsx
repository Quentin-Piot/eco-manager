import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "~/lib/theme";
import { Text } from "~/components/ui/text";

interface SummaryCardProps {
  title: string;
  value: string | number;
  todayValue?: number;
  secondValue?: number;
  valueColorClass?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress?: () => void;
  subtitle?: string;
  percentage?: number;
  secondaryValue?: string;
  secondaryLabel?: string;
  isPositive?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  secondValue,
  todayValue,
  valueColorClass,
  iconName,
  icon,
  iconColor,
  onPress,
  subtitle,
  percentage,
  secondaryValue,
  secondaryLabel,
  isPositive,
}) => {
  const formattedValue =
    typeof value === "number" ? value.toFixed(0).replace(".", ",") : value;
  const formattedSecondValue = secondValue?.toFixed(0).replace(".", ",");
  const iconToUse = icon || iconName;
  const colorToUse =
    iconColor ||
    (isPositive !== undefined
      ? isPositive
        ? "#22C55E"
        : "#EF4444"
      : "#6b7280");

  return onPress ? (
    <TouchableOpacity className={"flex-1 basis-[48%]"} onPress={onPress}>
      <Card className={"relative"}>
        <MaterialIcons
          className={"absolute right-1 top-1"}
          size={12}
          name="edit"
          color={colors.muted.foreground}
        />

        <CardHeader className="flex-row items-center justify-between space-y-0 pb-1">
          <View className="flex-row items-center">
            {iconToUse && (
              <View className={"w-6"}>
                <Ionicons
                  name={iconToUse}
                  size={14}
                  color={colorToUse}
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
            className={`text-xl font-bold text-neutral-900 dark:text-neutral-50 ${valueColorClass || (isPositive !== undefined ? (isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400") : "")}`}
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
          {percentage !== undefined && (
            <Text
              className="text-xs text-neutral-500 dark:text-neutral-400 mt-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {percentage}% utilisé
            </Text>
          )}
          {secondaryValue && secondaryLabel && (
            <Text
              className="text-xs text-neutral-500 dark:text-neutral-400 mt-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {secondaryValue} € {secondaryLabel}
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
          {iconToUse && (
            <View className={"w-6"}>
              <Ionicons name={iconToUse} size={14} color={colorToUse} />
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
          className={`text-xl font-bold text-neutral-900 dark:text-neutral-50 ${valueColorClass || (isPositive !== undefined ? (isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400") : "")}`}
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
        {percentage !== undefined && (
          <Text
            className="text-xs text-neutral-500 dark:text-neutral-400 mt-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {percentage}% utilisé
          </Text>
        )}
        {secondaryValue && secondaryLabel && (
          <Text
            className="text-xs text-neutral-500 dark:text-neutral-400 mt-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {secondaryValue} € {secondaryLabel}
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

type RemainingBudgetCardProps = {
  monthlyExpenses: number;
  monthlySpendingTarget: number;
  onPress?: () => void;
};

export const RemainingBudgetCard = ({
  monthlyExpenses,
  monthlySpendingTarget,
  onPress,
}: RemainingBudgetCardProps) => {
  const remainingBudget = monthlySpendingTarget - monthlyExpenses;
  const percentage = Math.min(
    100,
    Math.round((monthlyExpenses / monthlySpendingTarget) * 100) || 0,
  );

  return (
    <SummaryCard
      title="Budget restant"
      value={remainingBudget.toFixed(2)}
      icon="wallet-outline"
      percentage={percentage}
      onPress={onPress}
    />
  );
};

type NetFlowCardProps = {
  monthly: number;
  today?: number;
};

export const NetFlowCard = ({ monthly, today }: NetFlowCardProps) => {
  return (
    <SummaryCard
      title="Flux net"
      value={monthly.toFixed(2)}
      secondaryValue={today !== undefined ? today.toFixed(2) : undefined}
      secondaryLabel={today !== undefined ? "aujourd'hui" : undefined}
      icon="trending-up-outline"
      isPositive={monthly >= 0}
    />
  );
};
