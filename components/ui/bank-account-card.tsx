import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { StyleSheet, View } from "react-native";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type AccountType = "current" | "savings";

export type AccountDetails = {
  title: string;
  amount: number;
  type: AccountType;
  borderColor: { borderLeftColor: string };
};

type BankAccountCardProps = {
  accounts: AccountDetails[];
  type: AccountType;
  className?: string;
};

export function BankAccountCard({
  accounts,
  type,
  className,
}: BankAccountCardProps) {
  const totalAmount = accounts
    .filter((account) => account.type === type)
    .reduce((sum, account) => sum + account.amount, 0);

  const title = type === "current" ? "Comptes courants" : "Épargnes";
  const borderColor =
    type === "current"
      ? { borderLeftColor: "#3b82f6" } // blue
      : { borderLeftColor: "#22c55e" }; // green

  return (
    <Tooltip>
      <TooltipTrigger>
        <Card style={[styles.card, borderColor]} className={className}>
          <CardHeader className="flex-row items-center justify-between space-y-0 mb-3">
            <CardTitle className="text-sm font-medium text-primary-darker">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <Text className="w-full text-xl font-bold text-left">
              {totalAmount.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </Text>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent
        insets={{
          left: type === "current" ? 10 : 0,
          right: type === "current" ? 0 : 10,

          top: 190,
        }}
      >
        <View className="gap-2">
          {accounts
            .filter((account) => account.type === type)
            .map((account, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center"
              >
                <Text className="text-sm text-popover-foreground mr-4">
                  {account.title}
                </Text>
                <Text className="text-sm font-semibold text-popover-foreground">
                  {account.amount.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </Text>
              </View>
            ))}
        </View>
      </TooltipContent>
    </Tooltip>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
  },
});
