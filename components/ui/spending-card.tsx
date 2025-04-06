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
    <Card className={cn("flex-1 basis-[45%]", className)}>
      <CardHeader className="flex-row items-center justify-between space-y-0 mb-3">
        <CardTitle className="text-base font-medium text-muted-darker">
          {title}
        </CardTitle>
        <Text
          className={`rounded-full ${color.bg} px-2 py-1 text-xs font-bold ${color.text}`}
        >
          {currentAmount} / {budgetAmount}
        </Text>
      </CardHeader>
      <CardContent className="px-0">
        <Progress
          value={percentage}
          className={`h-[12px] w-full ${color.progress}/20`}
          indicatorClassName={color.progress}
        />
      </CardContent>
    </Card>
  );
}
