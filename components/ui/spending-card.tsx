import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Progress } from "@/components/ui/progress";
import { cn } from "~/lib/utils";
import { TouchableOpacity } from "react-native";
import {
  categoryDetailsMap,
  MainExpenseCategory,
} from "~/lib/types/categories";
import { colors } from "~/lib/theme";

type SpendingCardProps = {
  category: MainExpenseCategory;
  currentAmount: string;
  budgetAmount?: number;
  percentage?: number;
  className?: string;
  onPress?: () => void;
};

export function SpendingCard({
  category,
  currentAmount,
  className,
  budgetAmount,
  percentage = 0,
  onPress,
}: SpendingCardProps) {
  const color: string = useMemo(() => {
    switch (category) {
      case "housing":
        return colors.categories.housing;
      case "activities":
        return colors.categories.activities;
      case "transport":
        return colors.categories.transport;

      case "vacation":
        return colors.categories.vacation;
      case "shopping":
        return colors.categories.shopping;
    }
  }, [category]);
  if (!category) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn("flex-1 basis-[48%]", className)}
      activeOpacity={0.8}
    >
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 mb-3">
          <CardTitle className="text-base font-medium text-primary-darker">
            {categoryDetailsMap[category].label}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 items-center justify-center gap-1 pt-3">
          {budgetAmount ? (
            <Text
              className={`rounded-full text-sm font-bold w-full text-left`}
              style={{ color: color }}
            >
              {currentAmount} / {budgetAmount}
            </Text>
          ) : (
            <Text className={`rounded-full text-xl font-bold w-full text-left`}>
              {currentAmount}€
            </Text>
          )}
          {!isNaN(percentage) && (
            <Progress
              value={percentage}
              className={`h-[12px] w-full`}
              indicatorStyle={{ backgroundColor: color }}
            />
          )}
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
