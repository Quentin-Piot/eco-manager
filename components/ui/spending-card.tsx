import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import {
  mainCategoryDetailsMap,
  MainExpenseCategory,
} from "~/lib/types/categories";
import { useIndicatorColors } from "~/lib/context/indicator-colors-context";

type SpendingCardProps = {
  currentAmount: string;
  budgetAmount: number;
  percentage: number;
  category: MainExpenseCategory;
  onPress?: () => void;
};

export const SpendingCard = ({
  currentAmount,
  budgetAmount,
  percentage,
  category,
  onPress,
}: SpendingCardProps) => {
  const { getColorForCategory } = useIndicatorColors();
  const categoryColor = getColorForCategory(category);
  const categoryDetails = mainCategoryDetailsMap[category];

  return (
    <TouchableOpacity className={"flex-1 basis-[48%]"} onPress={onPress}>
      <Card className={"relative"}>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-1">
          <View className="flex-row items-center">
            <View
              className={
                "w-6 h-6 rounded-full items-center justify-center mr-2"
              }
              style={{ backgroundColor: categoryColor }}
            >
              <MaterialIcons
                name={categoryDetails.iconName as any}
                size={14}
                color="white"
              />
            </View>
            <CardTitle
              className="text-sm font-semibold text-neutral-500 dark:text-neutral-400"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {categoryDetails.label}
            </CardTitle>
          </View>
        </CardHeader>
        <CardContent className="pt-0 pb-2 pl-6">
          <Text
            className={`text-xl font-bold text-neutral-900 dark:text-neutral-50`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {currentAmount} €
            {budgetAmount > 0 && (
              <Text
                className={`text-sm font-bold text-muted-foreground`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {" "}
                /{budgetAmount} €
              </Text>
            )}
          </Text>
          {budgetAmount > 0 && (
            <View className="mt-2 h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: categoryColor,
                }}
              />
            </View>
          )}
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};
