import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Progress } from "@/components/ui/progress";
import { cn } from "~/lib/utils";

type SpendingCardProps = {
  title: string;
  currentAmount: string;
  budgetAmount: string;
  percentage: number;
  color: {
    bg: string;
    text: string;
    progress: string;
  };
  className?: string;
};

export function SpendingCard({
  title,
  currentAmount,
  budgetAmount,
  percentage,
  color,
  className,
}: SpendingCardProps) {
  return (
    <Card className={cn("flex-1 basis-[48%]", className)}>
      <CardHeader className="flex-row items-center justify-between space-y-0 mb-3">
        <CardTitle className="text-base font-medium text-primary-darker">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 items-center justify-center gap-1 pt-3">
        <Text
          className={`rounded-full text-sm font-bold w-full text-left`}
          style={{ color: color.text }} // Use inline style for text color
        >
          {currentAmount} / {budgetAmount}
        </Text>
        <Progress
          value={percentage}
          className={`h-[12px] w-full`}
          indicatorStyle={{ backgroundColor: color.progress }} // Use indicatorStyle for progress color
        />
      </CardContent>
    </Card>
  );
}
