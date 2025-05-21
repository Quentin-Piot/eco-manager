import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { StyleSheet, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Card className={className}>
      <View
        style={[styles.colorIndicator, borderColor]}
        className="absolute left-0 top-0 bottom-0 rounded-l-xl"
      />
      <CardHeader className="flex-row items-center justify-between space-y-0 mb-2">
        <CardTitle className="text-sm font-medium text-muted-darker ml-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
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
  colorIndicator: {
    width: 6,
  },
});
