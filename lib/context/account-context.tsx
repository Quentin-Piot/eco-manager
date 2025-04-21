import React, { createContext, useContext, useState } from "react";
import { AccountDetails } from "@/components/ui/bank-account-card";
import {
  Category,
  categoryDetailsMap,
  ExpenseCategory,
} from "~/lib/types/categories";
import { bankColors } from "~/lib/constants/bank-colors";
import { colors } from "~/lib/theme"; // Import theme colors

interface SpendingCategoryData {
  type: Category;
  title: string;
  currentAmount: string;
  budgetAmount: string;
  percentage: number;
  color: {
    bg: string; // Keep as string for potential opacity modifications
    text: string;
    progress: string;
  };
}

interface ChartDataRaw {
  type: ExpenseCategory;
  value: number;
  accountId: string;
}

export interface AccountDetailsWithId extends AccountDetails {
  id: string;
}

type AccountContextType = {
  accounts: AccountDetailsWithId[];
  spendingCategories: SpendingCategoryData[];
  monthlyChartDataRaw: ChartDataRaw[];
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accounts] = useState<AccountDetailsWithId[]>([
    {
      id: "acc-lcl",
      title: "LCL",
      amount: 1250.75,
      type: "current",
      borderColor: bankColors[1].color,
    },
    {
      id: "acc-joint",
      title: "Compte Joint",
      amount: 2340.5,
      type: "current",
      borderColor: bankColors[2].color,
    },
    {
      id: "acc-bourso",
      title: "Bourso Personal",
      amount: 750.0,
      type: "current",
      borderColor: bankColors[3].color,
    },
    {
      id: "acc-revolut",
      title: "Revolut Personal",
      amount: 159.0,
      type: "current",
      borderColor: bankColors[4].color,
    },
    {
      id: "acc-cash",
      title: "Espèces",
      amount: 50.0,
      type: "current",
      borderColor: bankColors[5].color,
    },
    {
      id: "sav-livreta",
      title: "Livret A",
      amount: 8250.3,
      type: "savings",
      borderColor: bankColors[1].color,
    },
    {
      id: "sav-devdurable",
      title: "Développement Durable",
      amount: 2500.5,
      type: "savings",
      borderColor: bankColors[6].color,
    },
    {
      id: "sav-general",
      title: "Épargne Générale",
      amount: 2000.0,
      type: "savings",
      borderColor: bankColors[7].color,
    },
  ]);

  const [spendingCategories] = useState<SpendingCategoryData[]>([
    {
      type: "housing" as Category,
      title: categoryDetailsMap.housing.name,
      currentAmount: "€850",
      budgetAmount: "€900",
      percentage: 94,
      color: {
        bg: colors.categories.housing, // Add 20% opacity (33 in hex)
        text: colors.categories.housing,
        progress: colors.categories.housing,
      },
    },
    {
      type: "transport" as Category,
      title: categoryDetailsMap.transport.name,
      currentAmount: "€120",
      budgetAmount: "€200",
      percentage: 60,
      color: {
        bg: colors.categories.transport,
        text: colors.categories.transport,
        progress: colors.categories.transport,
      },
    },
    {
      type: "shopping" as Category,
      title: categoryDetailsMap.shopping.name,
      currentAmount: "€320",
      budgetAmount: "€300",
      percentage: 107,
      color: {
        bg: colors.categories.shopping,
        text: colors.categories.shopping,
        progress: colors.categories.shopping,
      },
    },
    {
      type: "activities" as Category,
      title: categoryDetailsMap.activities.name,
      currentAmount: "€180",
      budgetAmount: "€250",
      percentage: 72,
      color: {
        bg: colors.categories.activities,
        text: colors.categories.activities,
        progress: colors.categories.activities,
      },
    },
  ]);

  const [monthlyChartDataRaw] = useState<ChartDataRaw[]>([
    { type: "housing", value: 850, accountId: "acc-joint" },
    { type: "transport", value: 50, accountId: "acc-lcl" },
    { type: "transport", value: 100, accountId: "acc-joint" },
    { type: "shopping", value: 200, accountId: "acc-lcl" },
    { type: "shopping", value: 120, accountId: "acc-bourso" },
    { type: "activities", value: 180, accountId: "acc-joint" },
    { type: "groceries", value: 150, accountId: "acc-joint" },
    { type: "groceries", value: 60.5, accountId: "acc-lcl" },
    { type: "restaurants", value: 70, accountId: "acc-lcl" },
    { type: "restaurants", value: 45.75, accountId: "acc-revolut" },
    { type: "entertainment", value: 75.0, accountId: "acc-bourso" },
    { type: "coffee", value: 25.2, accountId: "acc-revolut" },
    { type: "fees_charges", value: 15.0, accountId: "acc-lcl" },
  ]);

  const contextValue: AccountContextType = {
    accounts,
    spendingCategories,
    monthlyChartDataRaw,
  };

  return (
    <AccountContext.Provider value={contextValue}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
