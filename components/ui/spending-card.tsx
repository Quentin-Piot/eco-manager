import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Progress } from "@/components/ui/progress";
import { cn } from "~/lib/utils";
import { TouchableOpacity, View } from "react-native";
import {
  categoryDetailsMap,
  MainExpenseCategory,
} from "~/lib/types/categories";
import { colors } from "~/lib/theme";
import { MaterialIcons } from "@expo/vector-icons";

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
  const categoryInfo = categoryDetailsMap[category];
  const color: string = useMemo(() => {
    // Keep the color logic from the previous version, assuming it's correctly mapped
    // from `colors.categories` based on the category type.
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
      default:
        return colors.primary.DEFAULT; // Fallback color if category is not found
    }
  }, [category]);

  if (!categoryInfo) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn("flex-1 basis-[48%]", className)}
      activeOpacity={0.7}
    >
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <View className="flex-row items-center">
            <MaterialIcons
              name={categoryInfo.iconName}
              size={20}
              color={color}
            />
            <CardTitle
              className="ml-2 text-base font-semibold text-neutral-800 dark:text-neutral-100"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {categoryInfo.label}
            </CardTitle>
          </View>
        </CardHeader>
        <CardContent className="pt-0 pb-2 px-1">
          {budgetAmount !== undefined && budgetAmount > 0 ? (
            <View className="flex-row items-baseline justify-start mb-1">
              <Text
                className="text-lg font-bold text-neutral-900 dark:text-neutral-50"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                € {currentAmount}
              </Text>
              <Text
                className="text-base font-semibold text-neutral-500 dark:text-neutral-400 pl-1"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                /€ {budgetAmount}
              </Text>
            </View>
          ) : (
            <Text
              className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              € {currentAmount}
            </Text>
          )}
          {!isNaN(percentage) && (
            <Progress
              value={percentage}
              className={`h-3 w-full rounded-full`}
              indicatorStyle={{ backgroundColor: color, borderRadius: 999 }}
            />
          )}
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
