import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getUserData, saveUserData } from "~/lib/storage/user-storage";
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

export type ExpenseData = {
  id: string;
  remarks: string;
  amount: number;
  amountOriginal?: string;
  date: Date;
  paymentMethod: "cash" | "card";
  accountId: string;
  mainCategory: MainCategory;
  subcategory: Subcategory;
  type: "expense" | "income";
};

export type TransactionsState = ExpenseData[];

type AccountContextType = {
  accounts: AccountDetailsWithId[];
  spendingCategories: SpendingCategory[];
  updateBudget: (categoryType: MainCategory, newBudget: number) => void;
  transactions: TransactionsState;
  setTransactions: React.Dispatch<React.SetStateAction<TransactionsState>>;
  updateTransaction: (id: string, updatedTransaction: ExpenseData) => void;
  deleteTransaction: (id: string) => void;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

// Ces données ne seront utilisées que si aucune donnée n'est trouvée dans le stockage
const initialMockTransactions: TransactionsState = [
  {
    id: "1",
    remarks: "Starbucks",
    amount: 4.19,
    amountOriginal: "21,00 MYR",
    date: new Date(),
    accountId: "mock-account-id-1",
    paymentMethod: "card",
    mainCategory: "activities",
    subcategory: "cafe",
    type: "expense",
  },
  {
    id: "2",
    remarks: "Cinema",
    amount: 9.98,
    amountOriginal: "50,00 MYR",
    date: new Date(),
    accountId: "mock-account-id-1",
    paymentMethod: "card",
    mainCategory: "activities",
    subcategory: "other",
    type: "expense",
  },
  {
    id: "3",
    remarks: "Dinner",
    amount: 5.19,
    amountOriginal: "26,00 MYR",
    date: new Date(),
    accountId: "mock-account-id-1",
    paymentMethod: "card",
    mainCategory: "activities",
    subcategory: "restaurant",
    type: "expense",
  },
  {
    id: "4",
    remarks: "Local Cafe",
    amount: 1.6,
    amountOriginal: "8,00 MYR",
    date: new Date(),
    accountId: "mock-account-id-1",
    paymentMethod: "card",
    mainCategory: "activities",
    subcategory: "cafe",
    type: "expense",
  },
  {
    id: "5",
    remarks: "",
    amount: 3.19,
    amountOriginal: "16,00 MYR",
    date: new Date(),
    accountId: "mock-account-id-1",
    paymentMethod: "card",
    mainCategory: "housing",
    subcategory: "other",
    type: "expense",
  },
  {
    id: "6",
    remarks: "Hotel Night",
    amount: 15.5,
    date: new Date(),
    accountId: "mock-account-id-1",
    paymentMethod: "card",
    mainCategory: "vacation",
    subcategory: "accommodation",
    type: "expense",
  },
  {
    id: "7",
    remarks: "Bank Fee",
    amount: 3.7,
    date: new Date(),
    accountId: "mock-account-id-1",
    paymentMethod: "card",
    mainCategory: "housing",
    subcategory: "bills",
    type: "expense",
  },
  {
    id: "8",
    remarks: "Lunch",
    amount: 6.18,
    amountOriginal: "31,00 MYR",
    date: new Date(Date.now() - 86400000),
    accountId: "mock-account-id-1",
    paymentMethod: "card",
    mainCategory: "activities",
    subcategory: "restaurant",
    type: "expense",
  },
  {
    id: "9",
    remarks: "Morning Coffee",
    amount: 7.4,
    amountOriginal: "37,00 MYR",
    date: new Date(Date.now() - 86400000),
    accountId: "mock-account-id-1",
    paymentMethod: "card",
    mainCategory: "activities",
    subcategory: "cafe",
    type: "expense",
  },
];

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<AccountDetailsWithId[]>([
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

  const spendingCategories = useMemo<SpendingCategory[]>(
    () => [
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
    ],
    [],
  );

  const [transactions, setTransactions] = useState<TransactionsState>([]);

  // Charger les données du storage au démarrage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setAccounts(userData.accounts);
          setTransactions(userData.transactions);
        } else {
          // Utiliser les données mock uniquement au premier démarrage
          setTransactions(initialMockTransactions);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur:",
          error,
        );
        // En cas d'erreur, utiliser les données mock
        setTransactions(initialMockTransactions);
      }
    };

    loadUserData();
  }, []);

  // Sauvegarder les données à chaque modification des transactions
  useEffect(() => {
    const saveData = async () => {
      try {
        await saveUserData(accounts, transactions);
      } catch (error) {
        console.error(
          "Erreur lors de la sauvegarde des données utilisateur:",
          error,
        );
      }
    };

    saveData();
  }, [accounts, transactions]);

  const updateBudget = useCallback(
    (categoryType: MainCategory, newBudget: number) => {
      console.log(categoryType, newBudget);
    },
    [],
  );

  const updateTransaction = useCallback(
    (id: string, updatedTransaction: ExpenseData) => {
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === id ? updatedTransaction : transaction,
        ),
      );
    },
    [],
  );

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((tx) => tx.id !== id),
    );
  }, []);

  const contextValue: AccountContextType = {
    accounts,
    spendingCategories,
    updateBudget,
    transactions,
    setTransactions,
    updateTransaction,
    deleteTransaction,
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
