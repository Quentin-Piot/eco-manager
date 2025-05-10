import React, { createContext, useCallback, useContext, useState } from "react";
import { AccountDetails } from "@/components/ui/bank-account-card";
import {
  MainCategory,
  MainExpenseCategory,
  Subcategory,
} from "~/lib/types/categories";
import { bankColors } from "~/lib/constants/bank-colors";

export type SpendingCategory = {
  type: MainExpenseCategory;
  budgetAmount: number;
};

export type SpendingCategoryWithValue = SpendingCategory & {
  currentAmount: string;
  percentage: number;
};

export interface AccountDetailsWithId extends AccountDetails {
  id: string;
}

export type ExpenseDataFormatted = {
  id: string;
  description: string;
  amountEUR: number;
  amountOriginal?: string;
  date: Date;
  accountId: string;
  mainCategory: MainCategory;
  subcategory: Subcategory;
  type?: "expense" | "income";
};

export type TransactionsState = ExpenseDataFormatted[];

type AccountContextType = {
  accounts: AccountDetailsWithId[];
  spendingCategories: SpendingCategory[];
  updateBudget: (categoryType: MainCategory, newBudget: number) => void;
  transactions: TransactionsState;
  setTransactions: React.Dispatch<React.SetStateAction<TransactionsState>>;
  updateTransaction: (
    id: string,
    updatedTransaction: ExpenseDataFormatted,
  ) => void;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

const initialSpendingCategories: SpendingCategory[] = [
  {
    type: "housing",
    budgetAmount: 900,
  },
  {
    type: "vacation",
    budgetAmount: 250,
  },
  {
    type: "shopping",
    budgetAmount: 250,
  },
  {
    type: "activities",
    budgetAmount: 250,
  },
];

const initialMockTransactions: TransactionsState = [
  {
    id: "1",
    description: "Starbucks",
    amountEUR: 4.19,
    amountOriginal: "21,00 MYR",
    date: new Date(),
    accountId: "mock-account-id-1",
    mainCategory: "activities",
    subcategory: "cafe",
    type: "expense",
  },
  {
    id: "2",
    description: "Cinema",
    amountEUR: 9.98,
    amountOriginal: "50,00 MYR",
    date: new Date(),
    accountId: "mock-account-id-1",
    mainCategory: "activities",
    subcategory: "other",
  },
  {
    id: "3",
    description: "Dinner",
    amountEUR: 5.19,
    amountOriginal: "26,00 MYR",
    date: new Date(),
    accountId: "mock-account-id-1",
    mainCategory: "activities",
    subcategory: "restaurant",
  },
  {
    id: "4",
    description: "Local Cafe",
    amountEUR: 1.6,
    amountOriginal: "8,00 MYR",
    date: new Date(),
    accountId: "mock-account-id-1",
    mainCategory: "activities",
    subcategory: "cafe",
  },
  {
    id: "5",
    description: "",
    amountEUR: 3.19,
    amountOriginal: "16,00 MYR",
    date: new Date(),
    accountId: "mock-account-id-1",
    mainCategory: "housing",
    subcategory: "other",
  },
  {
    id: "6",
    description: "Hotel Night",
    amountEUR: 15.5,
    date: new Date(),
    accountId: "mock-account-id-1",
    mainCategory: "vacation",
    subcategory: "accommodation",
  },
  {
    id: "7",
    description: "Bank Fee",
    amountEUR: 3.7,
    date: new Date(),
    accountId: "mock-account-id-1",
    mainCategory: "housing",
    subcategory: "bills",
  },
  {
    id: "8",
    description: "Lunch",
    amountEUR: 6.18,
    amountOriginal: "31,00 MYR",
    date: new Date(Date.now() - 86400000),
    accountId: "mock-account-id-1",
    mainCategory: "activities",
    subcategory: "restaurant",
  },
  {
    id: "9",
    description: "Morning Coffee",
    amountEUR: 7.4,
    amountOriginal: "37,00 MYR",
    date: new Date(Date.now() - 86400000),
    accountId: "mock-account-id-1",
    mainCategory: "activities",
    subcategory: "cafe",
  },
];

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
      type: "cash",
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

  const [spendingCategories, setSpendingCategories] = useState<
    SpendingCategory[]
  >(initialSpendingCategories);

  const [transactions, setTransactions] = useState<TransactionsState>(
    initialMockTransactions,
  );

  const updateBudget = useCallback(
    (categoryType: MainCategory, newBudget: number) => {
      console.log(categoryType, newBudget);
    },
    [],
  );

  const updateTransaction = useCallback(
    (id: string, updatedTransaction: ExpenseDataFormatted) => {
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === id ? updatedTransaction : transaction,
        ),
      );
    },
    [],
  );

  const contextValue: AccountContextType = {
    accounts,
    spendingCategories,
    updateBudget,
    transactions,
    setTransactions,
    updateTransaction,
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
