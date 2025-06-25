import { CartesianChart, StackedBar } from "victory-native";
import React, { memo, useMemo } from "react";
import { matchFont, useFont } from "@shopify/react-native-skia";
import { Platform, StyleSheet, View } from "react-native";
import { colors } from "~/lib/theme";
import { useAccount } from "~/lib/context/account-context";
import {
  endOfMonth,
  format,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import { Text } from "~/components/ui/text";

const FONT_SIZE = 12;
const ROUNDED_CORNER = 5;
const INNER_PADDING = 0.66;

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 0,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: FONT_SIZE,
    color: colors.primary.DEFAULT,
  },
});

const EvolutionStackedBar = () => {
  const { transactions } = useAccount();

  const data = useMemo<
    {
      month: string;
      expenses: number;
      incomes: number;
    }[]
  >(() => {
    const now = new Date();
    const monthsData: {
      month: string;
      expenses: number;
      incomes: number;
    }[] = [];

    for (let i = 3; i >= 0; i--) {
      const date = subMonths(now, i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const monthTransactions = transactions.filter((t) =>
        isWithinInterval(t.date, { start: monthStart, end: monthEnd }),
      );

      const expenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const incomes = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      monthsData.push({
        month: format(date, "MMM", { locale: fr }),
        expenses,
        incomes,
      });
    }

    return monthsData;
  }, [transactions]);

  const maxValue = useMemo(() => {
    if (data.length === 0) return 1;
    const maxTotal = Math.max(...data.map((d) => d.expenses + d.incomes));
    return maxTotal > 0 ? maxTotal * 1.1 : 1;
  }, [data]);

  const geist = require("../../assets/fonts/Geist-Regular.ttf");
  const fontFamily = Platform.select({
    ios: "Helvetica",
    default: "Helvetica",
  });
  const geistFont = useFont(geist, FONT_SIZE);
  const font =
    Platform.OS !== "web"
      ? matchFont({
          fontFamily,
          fontWeight: "bold",
          fontSize: FONT_SIZE,
        })
      : geistFont;

  const hasAnyTransactions = data.some((d) => d.expenses > 0 || d.incomes > 0);

  if (!hasAnyTransactions) {
    return (
      <View className={"h-full w-full flex items-center justify-center"}>
        <Text className="text-muted-foreground text-sm">
          Aucune donnée à afficher pour les 4 derniers mois.
        </Text>
      </View>
    );
  }

  return (
    <View className={"h-full w-full"}>
      <CartesianChart
        data={data.map((v, i) => ({
          ...v,
          month: i,
        }))}
        xKey={"month"}
        yKeys={["expenses", "incomes"]}
        domainPadding={{ left: 50, right: 50, top: 20 }}
        domain={{
          y: [0, maxValue],
          x: [0, 3],
        }}
        axisOptions={{
          font,
          lineColor: "#d4d4d8",
          labelColor: colors.primary.DEFAULT,
          formatXLabel: (v) => {
            const isInteger = v === Math.floor(v);
            const exists = !!(isInteger ? data[v] : false);
            return exists ? data[v].month : " ";
          },
        }}
        padding={0}
      >
        {({ points, chartBounds }) => {
          return (
            <StackedBar
              animate={{ type: "spring" }}
              innerPadding={INNER_PADDING}
              chartBounds={chartBounds}
              points={[points.expenses, points.incomes]}
              colors={[colors.destructive.DEFAULT, colors.primary.DEFAULT]}
              barOptions={({ isBottom, isTop }) => {
                return {
                  roundedCorners: isTop
                    ? {
                        topLeft: ROUNDED_CORNER,
                        topRight: ROUNDED_CORNER,
                      }
                    : isBottom
                      ? {
                          bottomRight: ROUNDED_CORNER,
                          bottomLeft: ROUNDED_CORNER,
                        }
                      : undefined,
                };
              }}
            />
          );
        }}
      </CartesianChart>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: colors.destructive.DEFAULT },
            ]}
          />
          <Text style={styles.legendText}>Dépenses</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: colors.primary.DEFAULT },
            ]}
          />
          <Text style={styles.legendText}>Revenus</Text>
        </View>
      </View>
    </View>
  );
};

export default memo(EvolutionStackedBar);
