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
        <Progress
          value={percentage}
          className={`h-[12px] w-full ${color.progress}/20`}
          indicatorClassName={color.progress}
        />
        <Text
          className={`rounded-full px-2 text-xs font-semibold ${color.text}`}
        >
          {currentAmount} / {budgetAmount}
        </Text>
      </CardContent>
    </Card>
  );
}
