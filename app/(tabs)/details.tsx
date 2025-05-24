import MainLayout from "~/components/layouts/main-layout";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card } from "~/components/ui/card";
import React, { useMemo, useState } from "react";
import AddExpenseModal from "~/components/ui/add-expense-modal";
import type { ExpenseData } from "~/lib/context/account-context";
import { useAccount } from "~/lib/context/account-context";
import { format, isToday, isYesterday } from "date-fns";
import { TransactionItem } from "~/components/pages/details/transaction-item";
import { fr } from "date-fns/locale/fr";
import { capitalizeFirstLetter } from "~/lib/utils";
import { useBackground } from "~/lib/context/background";
import { Container } from "~/components/ui/container";

const formatDateKey = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

export default function DetailsScreen() {
  const { transactions } = useAccount();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { removeBlur } = useBackground();

  const groupedTransactions = useMemo(() => {
    const grouped: Record<any, ExpenseData[]> = {};
    transactions
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach((t) => {
        const transactionDate = new Date(t.date);
        let groupKey;

        if (isToday(transactionDate)) {
          groupKey = "today";
        } else if (isYesterday(transactionDate)) {
          groupKey = "yesterday";
        } else {
          groupKey = formatDateKey(transactionDate);
        }

        if (!grouped[groupKey]) {
          grouped[groupKey] = [];
        }
        grouped[groupKey].push(t);
      });

    return grouped;
  }, [transactions]);

  const formatDateDisplay = (dateKey: string): string => {
    if (dateKey === "today") {
      return "Aujourd'hui";
    }
    if (dateKey === "yesterday") {
      return "Hier";
    }
    const date = new Date(dateKey);
    return capitalizeFirstLetter(format(date, "EEEE d MMMM", { locale: fr }));
  };

  return (
    <MainLayout
      pageName={"Transactions"}
      fab={
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          className="absolute justify-center items-center right-6 w-14 h-14 rounded-full z-10"
          style={
            Platform.OS === "ios"
              ? {
                  bottom: 100,
                  backgroundColor: "#007AFF",
                  shadowColor: "#007AFF",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }
              : { bottom: 45, backgroundColor: "#007AFF" }
          }
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      }
    >
      <Container>
        {Object.entries(groupedTransactions).map(([dateGroup, items]) => (
          <View key={dateGroup} className="mb-4">
            <View className={"flex-row items-center justify-between mb-2 px-1"}>
              <Text
                className="text-base font-semibold text-neutral-700 dark:text-neutral-200"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {formatDateDisplay(dateGroup)}
              </Text>
              <Text
                className="text-base font-semibold text-neutral-700 dark:text-neutral-200"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {items
                  .reduce(
                    (acc, v) =>
                      v.type === "expense" ? acc - v.amount : acc + v.amount,
                    0,
                  )
                  .toFixed(2)}{" "}
                €
              </Text>
            </View>
            <Card className="px-0 py-0 bg-white">
              {items.map((item) => (
                <TransactionItem key={item.id} item={item} />
              ))}
            </Card>
          </View>
        ))}
      </Container>

      <AddExpenseModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          removeBlur();
        }}
      />
    </MainLayout>
  );
}
