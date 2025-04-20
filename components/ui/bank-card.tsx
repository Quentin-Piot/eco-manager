import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { StyleSheet } from "react-native";

type BankCardProps = {
  title: string;
  amount: number;
  borderColor: { borderLeftColor: string };
  className?: string;
};

export function BankCard({
  title,
  amount,
  borderColor,
  className,
}: BankCardProps) {
  return (
    <Card style={[styles.card, borderColor]} className={className}>
      <CardHeader className="flex-row items-center justify-between space-y-0 mb-3">
        <CardTitle className="text-sm font-medium text-muted-darker">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        <Text className="w-full text-xl font-bold text-left">
          {amount.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </Text>
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
  },
});
