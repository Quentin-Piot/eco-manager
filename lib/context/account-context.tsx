import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
import * as Crypto from "expo-crypto";
import {
  calculateNextRecurrenceDate,
  generateRecurringTransactionDates,
} from "~/lib/utils/date";

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

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly";

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
  recurrence: RecurrenceType;
  nextRecurrenceDate?: Date;
  recurrenceGroup?: string;
  isRecurrenceParent?: boolean;
};

export type TransactionsState = ExpenseData[];

type AccountContextType = {
  accounts: AccountDetailsWithId[];
  spendingCategories: SpendingCategory[];
  updateBudget: (categoryType: MainCategory, newBudget: number) => void;
  transactions: TransactionsState;
  addTransaction: (transaction: Omit<ExpenseData, "id">) => void;
  updateTransaction: (id: string, updatedTransaction: ExpenseData) => void;
  deleteTransaction: (id: string, deleteRecurrenceGroup?: boolean) => void;
  addAccount: (account: Omit<AccountDetailsWithId, "id">) => void;
  updateAccount: (
    id: string,
    updatedAccount: Omit<AccountDetailsWithId, "id">,
  ) => void;
  deleteAccount: (id: string) => void;
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
    recurrence: "none",
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
    recurrence: "none",
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
    recurrence: "none",
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
    recurrence: "none",
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
    recurrence: "none",
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
    recurrence: "none",
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
    recurrence: "monthly",
    nextRecurrenceDate: new Date(
      new Date().setMonth(new Date().getMonth() + 1),
    ),
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
    recurrence: "none",
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
    recurrence: "daily",
    nextRecurrenceDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  },
];

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [spendingCategories, setSpendingCategories] = useState<
    SpendingCategory[]
  >([
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
  ]);

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
      setSpendingCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.type === categoryType
            ? { ...category, budgetAmount: newBudget }
            : category,
        ),
      );
    },
    [],
  );

  const updateAccountBalance = useCallback(
    (accountId: string, amount: number, type: "expense" | "income") => {
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === accountId
            ? {
                ...account,
                amount:
                  type === "expense"
                    ? account.amount - amount
                    : account.amount + amount,
              }
            : account,
        ),
      );
    },
    [],
  );

  // Fonction pour vérifier et créer les transactions récurrentes
  const checkRecurringTransactions = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliser à minuit

    setTransactions((prevTransactions) => {
      const newTransactions: ExpenseData[] = [];
      const updatedTransactions = prevTransactions.map((transaction) => {
        // Vérifier si c'est une transaction récurrente parent avec une date de récurrence
        if (
          transaction.recurrence !== "none" &&
          transaction.nextRecurrenceDate &&
          (transaction.isRecurrenceParent || !transaction.recurrenceGroup) // Only process parent transactions
        ) {
          const nextDate = new Date(transaction.nextRecurrenceDate);
          nextDate.setHours(0, 0, 0, 0); // Normaliser à minuit

          // Si la date de récurrence est atteinte ou dépassée
          if (nextDate <= today) {
            // Calculer la prochaine date de récurrence
            const newNextDate = calculateNextRecurrenceDate(
              nextDate,
              transaction.recurrence,
            ) as Date;

            // Mettre à jour la date de récurrence de la transaction existante
            const updatedTransaction = {
              ...transaction,
              nextRecurrenceDate: newNextDate,
            };

            // Créer une nouvelle transaction basée sur la récurrence
            const newTransaction: ExpenseData = {
              ...transaction,
              id: Crypto.randomUUID(),
              date: new Date(nextDate), // Date de la récurrence
              nextRecurrenceDate: undefined, // Pas de récurrence pour cette instance
              recurrence: "none", // Pas de récurrence pour cette instance
              recurrenceGroup: transaction.recurrenceGroup, // Maintenir le groupe de récurrence
              isRecurrenceParent: false, // C'est une instance, pas un parent
              remarks: transaction.remarks
                ? `${transaction.remarks} (récurrent)`
                : "(récurrent)",
            };

            // Ajouter la nouvelle transaction à la liste
            newTransactions.push(newTransaction);

            // Mettre à jour le solde du compte
            updateAccountBalance(
              transaction.accountId,
              transaction.amount,
              transaction.type,
            );

            return updatedTransaction;
          }
        }
        return transaction;
      });

      // Retourner les transactions mises à jour avec les nouvelles
      return [...updatedTransactions, ...newTransactions];
    });
  }, [updateAccountBalance]);

  // Vérifier les transactions récurrentes au démarrage et à chaque changement de jour
  useEffect(() => {
    // Vérifier au démarrage
    checkRecurringTransactions();

    // Configurer une vérification quotidienne à minuit
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    // Configurer un timeout pour la première vérification à minuit
    const timeout = setTimeout(() => {
      checkRecurringTransactions();

      // Ensuite, configurer un intervalle quotidien
      const interval = setInterval(
        () => {
          checkRecurringTransactions();
        },
        24 * 60 * 60 * 1000,
      ); // 24 heures

      return () => clearInterval(interval);
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, [checkRecurringTransactions]);

  const addTransaction = useCallback(
    (transaction: Omit<ExpenseData, "id">) => {
      const transactionId = Crypto.randomUUID();
      const recurrenceGroup =
        transaction.recurrence !== "none" ? Crypto.randomUUID() : undefined;
      const transactionDate = new Date(transaction.date);
      const now = new Date();

      // Create the main transaction with proper recurrence properties
      const newTransaction: ExpenseData = {
        ...transaction,
        id: transactionId,
        recurrenceGroup,
        isRecurrenceParent: transaction.recurrence !== "none",
        nextRecurrenceDate:
          transaction.recurrence !== "none"
            ? calculateNextRecurrenceDate(
                transactionDate,
                transaction.recurrence,
              )
            : undefined,
      };

      // Update account balance for the main transaction
      updateAccountBalance(
        transaction.accountId,
        transaction.amount,
        transaction.type,
      );

      setTransactions((prev) => {
        let updatedTransactions = [...prev, newTransaction];

        // If this is a recurring transaction with a past date
        if (transaction.recurrence !== "none" && transactionDate < now) {
          // Generate all transactions that should have occurred between the start date and now
          const recurringDates = generateRecurringTransactionDates(
            transactionDate,
            transaction.recurrence,
            now,
          );

          // Create a transaction for each recurring date
          for (const recurDate of recurringDates) {
            const recurringTransaction: ExpenseData = {
              ...transaction,
              id: Crypto.randomUUID(),
              date: recurDate,
              nextRecurrenceDate: undefined, // Child instances don't have next dates
              recurrenceGroup,
              isRecurrenceParent: false,
              remarks: transaction.remarks
                ? `${transaction.remarks} (récurrent)`
                : "(récurrent)",
            };

            // Apply this transaction to account balance
            updateAccountBalance(
              recurringTransaction.accountId,
              recurringTransaction.amount,
              recurringTransaction.type,
            );

            updatedTransactions.push(recurringTransaction);
          }
        }

        return updatedTransactions;
      });
    },
    [updateAccountBalance],
  );

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  };

  const updateTransaction = useCallback(
    (id: string, updatedTransaction: ExpenseData) => {
      setTransactions((prevTransactions) => {
        const oldTransaction = prevTransactions.find((t) => t.id === id);
        if (!oldTransaction) return prevTransactions;

        // Annuler l'ancienne transaction
        updateAccountBalance(
          oldTransaction.accountId,
          oldTransaction.amount,
          oldTransaction.type === "expense" ? "income" : "expense",
        );

        // Appliquer la nouvelle transaction
        updateAccountBalance(
          updatedTransaction.accountId,
          updatedTransaction.amount,
          updatedTransaction.type,
        );

        // Check if key attributes have changed
        const recurrenceChanged =
          oldTransaction.recurrence !== updatedTransaction.recurrence;
        const oldDate = new Date(oldTransaction.date);
        const newDate = new Date(updatedTransaction.date);
        const dateChanged = oldDate.getTime() !== newDate.getTime();
        const now = new Date();

        // Preserve or create recurrence group as needed
        let recurrenceGroup = oldTransaction.recurrenceGroup;
        let updatedTransactions = [...prevTransactions];

        // CASE 1: Adding or changing recurrence
        if (updatedTransaction.recurrence !== "none") {
          // Create new recurrence group if none exists or there's a major change
          if (
            !recurrenceGroup ||
            (recurrenceChanged && oldTransaction.recurrence === "none")
          ) {
            recurrenceGroup = Crypto.randomUUID();
          }

          // If this is a parent transaction with changed parameters
          const isParent =
            oldTransaction.isRecurrenceParent ||
            !oldTransaction.recurrenceGroup;
          if (isParent && (recurrenceChanged || dateChanged)) {
            // If date or recurrence changed, we need to handle existing recurrences
            if (recurrenceGroup) {
              const today = new Date();

              // Remove future instances - we'll regenerate them with new pattern
              updatedTransactions = updatedTransactions.filter(
                (t) =>
                  !t.recurrenceGroup ||
                  t.recurrenceGroup !== recurrenceGroup ||
                  t.id === id ||
                  new Date(t.date) <= today,
              );

              // If date moved to the past, generate missed occurrences
              if (newDate < now) {
                const missedDates = generateRecurringTransactionDates(
                  newDate,
                  updatedTransaction.recurrence,
                  now,
                );

                // Create transactions for all missed dates
                for (const missedDate of missedDates) {
                  const missedTransaction: ExpenseData = {
                    ...updatedTransaction,
                    id: Crypto.randomUUID(),
                    date: missedDate,
                    nextRecurrenceDate: undefined,
                    recurrenceGroup,
                    isRecurrenceParent: false,
                    remarks: updatedTransaction.remarks
                      ? `${updatedTransaction.remarks} (récurrent)`
                      : "(récurrent)",
                  };

                  // Apply this transaction to account balance
                  updateAccountBalance(
                    missedTransaction.accountId,
                    missedTransaction.amount,
                    missedTransaction.type,
                  );

                  updatedTransactions.push(missedTransaction);
                }
              }
            }
          }
        }
        // CASE 2: Removing recurrence
        else if (
          updatedTransaction.recurrence === "none" &&
          oldTransaction.recurrence !== "none"
        ) {
          // If recurrence is being removed, remove this transaction from the group
          recurrenceGroup = undefined;
        }

        // Update the current transaction with correct properties
        return updatedTransactions.map((t) => {
          if (t.id === id) {
            return {
              ...updatedTransaction,
              id,
              recurrenceGroup,
              isRecurrenceParent: updatedTransaction.recurrence !== "none",
              nextRecurrenceDate:
                updatedTransaction.recurrence !== "none"
                  ? calculateNextRecurrenceDate(
                      newDate,
                      updatedTransaction.recurrence,
                    )
                  : undefined,
            };
          }

          // For modifying details of existing recurrences (like amount, category etc.)
          // but not their dates or recurrence pattern
          if (
            recurrenceGroup &&
            t.recurrenceGroup === recurrenceGroup &&
            !recurrenceChanged &&
            !dateChanged &&
            new Date(t.date) >= now
          ) {
            // Update future occurrences with new details
            return {
              ...t,
              amount: updatedTransaction.amount,
              remarks: updatedTransaction.remarks
                ? `${updatedTransaction.remarks} (récurrent)`
                : "(récurrent)",
              accountId: updatedTransaction.accountId,
              mainCategory: updatedTransaction.mainCategory,
              subcategory: updatedTransaction.subcategory,
              type: updatedTransaction.type,
              paymentMethod: updatedTransaction.paymentMethod,
            };
          }

          return t;
        });
      });
    },
    [updateAccountBalance],
  );

  const deleteTransaction = useCallback(
    (id: string, deleteRecurrenceGroup: boolean = false) => {
      setTransactions((prevTransactions) => {
        const transactionToDelete = prevTransactions.find((t) => t.id === id);
        if (!transactionToDelete) return prevTransactions;

        // Annuler la transaction en inversant son effet sur le solde
        updateAccountBalance(
          transactionToDelete.accountId,
          transactionToDelete.amount,
          transactionToDelete.type === "expense" ? "income" : "expense",
        );

        // If we need to delete a recurrence group
        if (deleteRecurrenceGroup && transactionToDelete.recurrenceGroup) {
          const recurrenceGroupId = transactionToDelete.recurrenceGroup;

          // Find all transactions in this recurrence group
          const groupTransactions = prevTransactions.filter(
            (t) => t.recurrenceGroup === recurrenceGroupId && t.id !== id,
          );

          // Reverse the balance effects for all transactions in the group
          for (const groupTransaction of groupTransactions) {
            updateAccountBalance(
              groupTransaction.accountId,
              groupTransaction.amount,
              groupTransaction.type === "expense" ? "income" : "expense",
            );
          }

          // Remove all transactions in this group
          return prevTransactions.filter(
            (t) =>
              !t.recurrenceGroup || t.recurrenceGroup !== recurrenceGroupId,
          );
        }

        // If deleting the parent transaction but keeping recurrences
        if (
          transactionToDelete.isRecurrenceParent &&
          transactionToDelete.recurrenceGroup &&
          !deleteRecurrenceGroup
        ) {
          const recurrenceGroupId = transactionToDelete.recurrenceGroup;

          // Find the next transaction in the recurrence group to make it the parent
          const nextTransactions = prevTransactions.filter(
            (t) =>
              t.recurrenceGroup === recurrenceGroupId &&
              t.id !== id &&
              new Date(t.date) > new Date(), // Only future transactions
          );

          if (nextTransactions.length > 0) {
            // Sort by date to find the closest one
            nextTransactions.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            );
            const newParentId = nextTransactions[0].id;

            // Make the next transaction the parent
            return prevTransactions
              .filter((t) => t.id !== id) // Remove the deleted transaction
              .map((t) => {
                if (t.id === newParentId) {
                  return {
                    ...t,
                    isRecurrenceParent: true,
                    recurrence: transactionToDelete.recurrence, // Keep the recurrence pattern
                    nextRecurrenceDate: calculateNextRecurrenceDate(
                      new Date(t.date),
                      transactionToDelete.recurrence,
                    ),
                  };
                }
                return t;
              });
          }
        }

        // Just delete the single transaction
        return prevTransactions.filter((t) => t.id !== id);
      });
    },
    [updateAccountBalance],
  );

  const addAccount = useCallback(
    (account: Omit<AccountDetailsWithId, "id">) => {
      const newAccount: AccountDetailsWithId = {
        ...account,
        id: Crypto.randomUUID(),
      };
      setAccounts((prev) => [...prev, newAccount]);
    },
    [],
  );

  const updateAccount = useCallback(
    (id: string, updatedAccount: Omit<AccountDetailsWithId, "id">) => {
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === id ? { ...updatedAccount, id } : account,
        ),
      );
    },
    [],
  );

  const deleteAccount = useCallback(
    (id: string) => {
      // Vérifier si des transactions utilisent ce compte
      const hasTransactions = transactions.some((t) => t.accountId === id);
      if (hasTransactions) {
        // Option 1: Empêcher la suppression
        console.warn(
          "Impossible de supprimer un compte avec des transactions associées",
        );
        return false;

        // Option 2 (alternative): Supprimer toutes les transactions associées
        // setTransactions(prev => prev.filter(t => t.accountId !== id));
      }

      setAccounts((prev) => prev.filter((account) => account.id !== id));
      return true;
    },
    [transactions],
  );

  const contextValue: AccountContextType = {
    accounts,
    spendingCategories,
    updateBudget,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    updateAccount,
    deleteAccount,
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
