import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AccountDetailsWithId,
  TransactionsState,
} from "~/lib/context/account-context";

export const USER_DATA_KEY = "user_data";

export const saveUserData = async (
  accounts: AccountDetailsWithId[],
  transactions: TransactionsState,
): Promise<void> => {
  try {
    const serializedData = JSON.stringify({
      accounts,
      transactions,
    });
    await AsyncStorage.setItem(USER_DATA_KEY, serializedData);
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

export const getUserData = async (): Promise<{
  accounts: AccountDetailsWithId[];
  transactions: TransactionsState;
} | null> => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);
    return {
      accounts: parsed.accounts,
      transactions: parsed.transactions.map((tx: any) => ({
        ...tx,
        date: new Date(tx.date),
      })),
    };
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};
