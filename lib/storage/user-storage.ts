import AsyncStorage from "@react-native-async-storage/async-storage";
import { TransactionsState } from "~/lib/context/account-context";
import { MainExpenseCategory } from "~/lib/types/categories";

export const USER_DATA_KEY = "user_data";

export const saveUserData = async (
  transactions: TransactionsState,
  monthlyBudget?: number | null,
  spendingCategories?: { type: MainExpenseCategory; budgetAmount: number }[],
): Promise<void> => {
  try {
    const serializedData = JSON.stringify({
      transactions,
      monthlyBudget,
      spendingCategories,
    });
    await AsyncStorage.setItem(USER_DATA_KEY, serializedData);
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

export const getUserData = async (): Promise<{
  transactions: TransactionsState;
  monthlyBudget?: number | null;
  spendingCategories?: { type: MainExpenseCategory; budgetAmount: number }[];
} | null> => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);
    return {
      transactions: parsed.transactions.map((tx: any) => ({
        ...tx,
        date: new Date(tx.date),
        nextRecurrenceDate: tx.nextRecurrenceDate
          ? new Date(tx.nextRecurrenceDate)
          : undefined,
      })),
      monthlyBudget: parsed.monthlyBudget || null,
      spendingCategories: parsed.spendingCategories || [],
    };
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};
