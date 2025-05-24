import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUserData, saveUserData } from "~/lib/storage/user-storage";
import {
  MainCategory,
  MainExpenseCategory,
  Subcategory,
} from "~/lib/types/categories";
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

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export type ExpenseData = {
  id: string;
  remarks: string;
  amount: number;
  amountOriginal?: string;
  date: Date;
  paymentMethod: "cash" | "card";
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
  spendingCategories: SpendingCategory[];
  updateBudget: (categoryType: MainCategory, newBudget: number) => void;
  transactions: TransactionsState;
  addTransaction: (transaction: Omit<ExpenseData, "id">) => void;
  updateTransaction: (id: string, updatedTransaction: ExpenseData) => void;
  deleteTransaction: (id: string, deleteRecurrenceGroup?: boolean) => void;
  monthlyBudget: number | null;
  updateMonthlyBudget: (newBudget: number) => void;
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
    paymentMethod: "card",
    mainCategory: "activities",
    subcategory: "cafe",
    type: "expense",
    recurrence: "daily",
    nextRecurrenceDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  },
  {
    id: "10",
    remarks: "Salaire",
    amount: 2500,
    date: new Date(new Date().setDate(10)), // 10th of current month
    paymentMethod: "card",
    mainCategory: "income",
    subcategory: "salary",
    type: "income",
    recurrence: "monthly",
    nextRecurrenceDate: new Date(
      new Date().setMonth(new Date().getMonth() + 1),
    ),
  },
  {
    id: "11",
    remarks: "Bonus",
    amount: 500,
    date: new Date(new Date().setMonth(new Date().getMonth() - 1, 15)), // 15th of last month
    paymentMethod: "card",
    mainCategory: "income",
    subcategory: "salary",
    type: "income",
    recurrence: "none",
  },
];

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [spendingCategories, setSpendingCategories] = useState<
    SpendingCategory[]
  >([
    {
      type: "transport",
      budgetAmount: 250,
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
  const [transactions, setTransactions] = useState<TransactionsState>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);

  // Charger les données du storage au démarrage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          if (userData.transactions) {
            // Ensure dates are parsed correctly
            const loadedTransactions = userData.transactions.map(
              (t: ExpenseData) => ({
                ...t,
                date: new Date(t.date),
                nextRecurrenceDate: t.nextRecurrenceDate
                  ? new Date(t.nextRecurrenceDate)
                  : undefined,
              }),
            );
            setTransactions(loadedTransactions);
          }

          if (userData.monthlyBudget !== undefined) {
            setMonthlyBudget(userData.monthlyBudget);
          }
        } else {
          // Utiliser les données mock uniquement au premier démarrage
          setTransactions(
            initialMockTransactions.map((t) => ({
              // Ensure dates are Date objects
              ...t,
              date: new Date(t.date),
              nextRecurrenceDate: t.nextRecurrenceDate
                ? new Date(t.nextRecurrenceDate)
                : undefined,
            })),
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur:",
          error,
        );
        // En cas d'erreur, utiliser les données mock
        setTransactions(
          initialMockTransactions.map((t) => ({
            // Ensure dates are Date objects
            ...t,
            date: new Date(t.date),
            nextRecurrenceDate: t.nextRecurrenceDate
              ? new Date(t.nextRecurrenceDate)
              : undefined,
          })),
        );
      }
    };

    loadUserData();
  }, []);

  // Sauvegarder les données à chaque modification des transactions ou du budget mensuel
  useEffect(() => {
    const saveData = async () => {
      try {
        await saveUserData(transactions, monthlyBudget);
      } catch (error) {
        console.error(
          "Erreur lors de la sauvegarde des données utilisateur:",
          error,
        );
      }
    };

    saveData();
  }, [transactions, monthlyBudget]);

  // Sauvegarder les données à chaque modification des transactions
  useEffect(() => {
    const saveData = async () => {
      try {
        await saveUserData(transactions);
      } catch (error) {
        console.error(
          "Erreur lors de la sauvegarde des données utilisateur:",
          error,
        );
      }
    };

    saveData();
  }, [transactions]);

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

  const updateMonthlyBudget = useCallback((newBudget: number) => {
    setMonthlyBudget(newBudget);
  }, []);

  // Fonction pour vérifier et créer les transactions récurrentes
  const checkRecurringTransactions = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliser à minuit

    setTransactions((prevTransactions) => {
      const newTransactions: ExpenseData[] = [];
      const updatedTransactions = prevTransactions.map((transaction) => {
        // Only process parent transactions that have a recurrence setup
        if (
          transaction.recurrence !== "none" &&
          transaction.nextRecurrenceDate &&
          transaction.isRecurrenceParent
        ) {
          const nextDate = new Date(transaction.nextRecurrenceDate);
          nextDate.setHours(0, 0, 0, 0); // Normaliser à minuit

          // If the recurrence date is reached or passed
          if (nextDate <= today) {
            // Calculate the next recurrence date for the parent transaction
            const newNextDate = calculateNextRecurrenceDate(
              nextDate,
              transaction.recurrence,
            ) as Date;

            // Create a new instance transaction based on the recurrence
            const newTransactionInstance: ExpenseData = {
              ...transaction,
              id: Crypto.randomUUID(), // New unique ID for the instance
              date: new Date(nextDate), // Date of the current recurrence
              nextRecurrenceDate: undefined, // Instances don't have their own next recurrence dates
              recurrence: "none", // Instances are not recurring themselves
              recurrenceGroup: transaction.recurrenceGroup || transaction.id, // Ensure a group ID
              isRecurrenceParent: false, // This is an instance, not a parent
              remarks: transaction.remarks
                ? `${transaction.remarks} (récurrent)`
                : "(récurrent)", // Mark as recurring instance
            };

            // Add the new instance to the list
            newTransactions.push(newTransactionInstance);

            // Return the updated parent transaction with its new nextRecurrenceDate
            return {
              ...transaction,
              nextRecurrenceDate: newNextDate,
            };
          }
        }
        return transaction;
      });

      // Filter out any duplicates if the logic was not perfect, and add new transactions
      const finalTransactions = [...updatedTransactions, ...newTransactions];
      const uniqueTransactionIds = new Set<string>();
      return finalTransactions.filter((t) => {
        if (uniqueTransactionIds.has(t.id)) {
          return false;
        }
        uniqueTransactionIds.add(t.id);
        return true;
      });
    });
  }, []);

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

  const addTransaction = useCallback((transaction: Omit<ExpenseData, "id">) => {
    const transactionId = Crypto.randomUUID();
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize 'now' to start of day

    // Determine if this new transaction should be a parent
    const isNewParent = transaction.recurrence !== "none";
    const recurrenceGroup = isNewParent ? Crypto.randomUUID() : undefined;

    const newTransaction: ExpenseData = {
      ...transaction,
      id: transactionId,
      recurrenceGroup: recurrenceGroup,
      isRecurrenceParent: isNewParent,
      nextRecurrenceDate: isNewParent
        ? calculateNextRecurrenceDate(transactionDate, transaction.recurrence)
        : undefined,
    };

    setTransactions((prev) => {
      let updatedTransactions = [...prev];

      // Add the new transaction
      updatedTransactions.push(newTransaction);

      // If it's a recurring transaction and its original date is in the past,
      // generate instances from the original date up to "now".
      if (isNewParent && transactionDate < now) {
        const recurringDates = generateRecurringTransactionDates(
          transactionDate,
          transaction.recurrence,
          now,
        );

        for (const recurDate of recurringDates) {
          const recurringInstance: ExpenseData = {
            ...transaction,
            id: Crypto.randomUUID(), // Unique ID for each instance
            date: recurDate,
            nextRecurrenceDate: undefined,
            recurrence: "none", // Instances are not recurring
            recurrenceGroup: recurrenceGroup,
            isRecurrenceParent: false,
            remarks: transaction.remarks
              ? `${transaction.remarks} (récurrent)`
              : "(récurrent)",
          };

          updatedTransactions.push(recurringInstance);
        }
      }
      return updatedTransactions;
    });
  }, []);

  const updateTransaction = useCallback(
    (id: string, updatedTransaction: ExpenseData) => {
      setTransactions((prevTransactions) => {
        const oldTransaction = prevTransactions.find((t) => t.id === id);
        if (!oldTransaction) return prevTransactions;

        const oldDate = new Date(oldTransaction.date);
        const newDate = new Date(updatedTransaction.date);
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Normalize 'now'

        let updatedTransactions = prevTransactions.filter((t) => t.id !== id);
        let newRecurrenceGroup =
          updatedTransaction.recurrence !== "none"
            ? oldTransaction.recurrenceGroup || Crypto.randomUUID()
            : undefined;

        // If the updated transaction becomes a parent, handle its recurring instances
        if (updatedTransaction.recurrence !== "none") {
          // Filter out existing instances of this group that are future instances
          updatedTransactions = updatedTransactions.filter(
            (t) =>
              !(
                t.recurrenceGroup ===
                  (oldTransaction.recurrenceGroup || newRecurrenceGroup) &&
                new Date(t.date) > now &&
                t.id !== id
              ),
          );

          // Generate new instances from the new date up to "now" if new date is in the past
          if (newDate < now) {
            const missedDates = generateRecurringTransactionDates(
              newDate,
              updatedTransaction.recurrence,
              now,
            );

            for (const missedDate of missedDates) {
              const missedInstance: ExpenseData = {
                ...updatedTransaction,
                id: Crypto.randomUUID(),
                date: missedDate,
                nextRecurrenceDate: undefined,
                recurrence: "none",
                recurrenceGroup: newRecurrenceGroup,
                isRecurrenceParent: false,
                remarks: updatedTransaction.remarks
                  ? `${updatedTransaction.remarks} (récurrent)`
                  : "(récurrent)",
              };

              updatedTransactions.push(missedInstance);
            }
          }
        } else {
          // Recurrence is being removed
          // Remove all future instances of the old recurrence group
          if (oldTransaction.recurrenceGroup) {
            updatedTransactions = updatedTransactions.filter(
              (t) =>
                !(
                  t.recurrenceGroup === oldTransaction.recurrenceGroup &&
                  new Date(t.date) > now &&
                  t.id !== id
                ),
            );
          }
        }

        // Add the updated transaction itself
        updatedTransactions.push({
          ...updatedTransaction,
          id,
          recurrenceGroup: newRecurrenceGroup,
          isRecurrenceParent: updatedTransaction.recurrence !== "none",
          nextRecurrenceDate:
            updatedTransaction.recurrence !== "none"
              ? calculateNextRecurrenceDate(
                  newDate,
                  updatedTransaction.recurrence,
                )
              : undefined,
        });

        return updatedTransactions;
      });
    },
    [],
  );

  const deleteTransaction = useCallback(
    (id: string, deleteRecurrenceGroup: boolean = false) => {
      setTransactions((prevTransactions) => {
        const transactionToDelete = prevTransactions.find((t) => t.id === id);
        if (!transactionToDelete) return prevTransactions;

        // If we need to delete a recurrence group
        if (deleteRecurrenceGroup && transactionToDelete.recurrenceGroup) {
          const recurrenceGroupId = transactionToDelete.recurrenceGroup;

          // Find all transactions in this recurrence group (excluding the current one already reverted)
          const groupTransactions = prevTransactions.filter(
            (t) => t.recurrenceGroup === recurrenceGroupId && t.id !== id,
          );

          // Reverse the balance effects for all transactions in the group that are in the future
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          for (const groupTransaction of groupTransactions) {
            if (
              new Date(groupTransaction.date) > now ||
              groupTransaction.isRecurrenceParent
            ) {
              // Also revert parent's balance if it's not a past instance
            }
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
          // This logic should find the next actual instance, not necessarily just future ones
          const now = new Date();
          const potentialNewParents = prevTransactions.filter(
            (t) =>
              t.recurrenceGroup === recurrenceGroupId &&
              t.id !== id &&
              new Date(t.date) > now, // Consider only future instances as potential new parents
          );

          if (potentialNewParents.length > 0) {
            potentialNewParents.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            );
            const newParentCandidate = potentialNewParents[0];

            return prevTransactions
              .filter((t) => t.id !== id) // Remove the deleted transaction
              .map((t) => {
                if (t.id === newParentCandidate.id) {
                  return {
                    ...t,
                    isRecurrenceParent: true,
                    // Take recurrence properties from the old parent
                    recurrence: transactionToDelete.recurrence,
                    nextRecurrenceDate: calculateNextRecurrenceDate(
                      new Date(newParentCandidate.date),
                      transactionToDelete.recurrence,
                    ),
                  };
                }
                return t;
              });
          } else {
            // If no future instances, just remove the parent and leave past instances
            return prevTransactions.filter((t) => t.id !== id);
          }
        }

        // Just delete the single transaction
        return prevTransactions.filter((t) => t.id !== id);
      });
    },
    [],
  );

  const getTransactionsByType = useCallback(
    (type: "expense" | "income") => {
      return transactions.filter((transaction) => transaction.type === type);
    },
    [transactions],
  );

  const getTransactionsByDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return transactions.filter(
        (transaction) =>
          transaction.date >= startDate && transaction.date <= endDate,
      );
    },
    [transactions],
  );

  const getTransactionsBySearch = useCallback(
    (searchTerm: string) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return transactions.filter(
        (transaction) =>
          transaction.remarks.toLowerCase().includes(lowerSearchTerm) ||
          transaction.mainCategory.toLowerCase().includes(lowerSearchTerm) ||
          transaction.subcategory.toLowerCase().includes(lowerSearchTerm) ||
          transaction.paymentMethod.toLowerCase().includes(lowerSearchTerm),
      );
    },
    [transactions],
  );

  const getTransactionsByRecurrence = useCallback(
    (recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly") => {
      return transactions.filter(
        (transaction) => transaction.recurrence === recurrence,
      );
    },
    [transactions],
  );

  const getTransactionsByRecurrenceAndMonth = useCallback(
    (
      recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly",
      month: Date,
    ) => {
      return transactions.filter(
        (transaction) =>
          transaction.recurrence === recurrence &&
          transaction.date.getMonth() === month.getMonth() &&
          transaction.date.getFullYear() === month.getFullYear(),
      );
    },
    [transactions],
  );

  const getTransactionsByRecurrenceAndDateRange = useCallback(
    (
      recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly",
      startDate: Date,
      endDate: Date,
    ) => {
      return transactions.filter(
        (transaction) =>
          transaction.recurrence === recurrence &&
          transaction.date >= startDate &&
          transaction.date <= endDate,
      );
    },
    [transactions],
  );

  const getTransactionsByRecurrenceAndCategory = useCallback(
    (
      recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly",
      mainCategory: string,
    ) => {
      return transactions.filter(
        (transaction) =>
          transaction.recurrence === recurrence &&
          transaction.mainCategory === mainCategory,
      );
    },
    [transactions],
  );

  const getTransactionsByRecurrenceAndSubcategory = useCallback(
    (
      recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly",
      mainCategory: string,
      subcategory: string,
    ) => {
      return transactions.filter(
        (transaction) =>
          transaction.recurrence === recurrence &&
          transaction.mainCategory === mainCategory &&
          transaction.subcategory === subcategory,
      );
    },
    [transactions],
  );

  const getTransactionsByRecurrenceAndPaymentMethod = useCallback(
    (
      recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly",
      paymentMethod: string,
    ) => {
      return transactions.filter(
        (transaction) =>
          transaction.recurrence === recurrence &&
          transaction.paymentMethod === paymentMethod,
      );
    },
    [transactions],
  );

  const getTransactionsByRecurrenceAndType = useCallback(
    (
      recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly",
      type: "expense" | "income",
    ) => {
      return transactions.filter(
        (transaction) =>
          transaction.recurrence === recurrence && transaction.type === type,
      );
    },
    [transactions],
  );

  const getTransactionsByRecurrenceAndSearch = useCallback(
    (
      recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly",
      searchTerm: string,
    ) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return transactions.filter(
        (transaction) =>
          transaction.recurrence === recurrence &&
          (transaction.remarks.toLowerCase().includes(lowerSearchTerm) ||
            transaction.mainCategory.toLowerCase().includes(lowerSearchTerm) ||
            transaction.subcategory.toLowerCase().includes(lowerSearchTerm) ||
            transaction.paymentMethod.toLowerCase().includes(lowerSearchTerm)),
      );
    },
    [transactions],
  );

  const contextValue: AccountContextType = {
    spendingCategories,
    updateBudget,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    monthlyBudget,
    updateMonthlyBudget,
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
