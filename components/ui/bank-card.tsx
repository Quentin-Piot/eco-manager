import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

type BankCardProps = {
  title: string;
  amount: string;
  borderColor: string;
  className?: string;
};

export function BankCard({
  title,
  amount,
  borderColor,
  className,
}: BankCardProps) {
  return (
    <Card className={`border-l-4 ${borderColor} ${className}`}>
      <CardHeader className="flex-row items-center justify-between space-y-0 mb-3">
        <CardTitle className="text-sm font-medium text-muted-darker">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        <Text className=" w-full text-2xl font-bold text-left">{amount}</Text>
      </CardContent>
    </Card>
  );
}
