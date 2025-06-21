import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "~/lib/config/firebase";
import { authService } from "./auth.service";
import { ExpenseData, SpendingCategory } from "~/lib/context/account-context";

// Type for serialized transactions (dates as strings)
export type SerializedExpenseData = Omit<
  ExpenseData,
  "date" | "nextRecurrenceDate"
> & {
  date: string;
  nextRecurrenceDate?: string;
};

export interface UserCloudData {
  transactions?: SerializedExpenseData[];
  spendingCategories?: SpendingCategory[];
  monthlyBudget?: number | null;
  lastUpdated: any;
}

export class CloudStorageService {
  private static instance: CloudStorageService;

  private constructor() {}

  public static getInstance(): CloudStorageService {
    if (!CloudStorageService.instance) {
      CloudStorageService.instance = new CloudStorageService();
    }
    return CloudStorageService.instance;
  }

  // Save financial data to cloud
  public async saveFinancialData(data: {
    transactions: ExpenseData[];
    monthlyBudget: number | null;
    spendingCategories: SpendingCategory[];
  }): Promise<void> {
    const { transactions, monthlyBudget, spendingCategories } = data;
    try {
      // Check if user is authenticated before attempting cloud access
      if (!authService.isAuthenticated()) {
        return;
      }

      const userDocRef = this.getUserDocRef();

      // Serialize dates for Firestore
      const serializedTransactions = transactions.map((t) => ({
        ...t,
        date: t.date.toISOString(),
        nextRecurrenceDate: t.nextRecurrenceDate
          ? t.nextRecurrenceDate.toISOString()
          : undefined,
      }));

      await updateDoc(userDocRef, {
        transactions: serializedTransactions,
        monthlyBudget,
        spendingCategories,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      // If document doesn't exist, create it
      if (
        error instanceof Error &&
        error.message.includes("No document to update")
      ) {
        const serializedTransactions = transactions.map((t) => ({
          ...t,
          date: t.date.toISOString(),
          nextRecurrenceDate: t.nextRecurrenceDate
            ? t.nextRecurrenceDate.toISOString()
            : undefined,
        }));

        await this.createUserDocument({
          transactions: serializedTransactions,
          monthlyBudget,
          spendingCategories,
        });
      } else {
        console.error("Error saving financial data to cloud:", error);
        throw error;
      }
    }
  }

  // Get financial data from cloud
  public async getFinancialData(): Promise<{
    transactions: ExpenseData[];
    monthlyBudget: number | null;
    spendingCategories: SpendingCategory[];
  } | null> {
    try {
      // Check if user is authenticated before attempting cloud access
      if (!authService.isAuthenticated()) {
        return null;
      }

      const userDocRef = this.getUserDocRef();
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Deserialize dates
        const transactions = data.transactions
          ? data.transactions.map((t: any) => ({
              ...t,
              date: new Date(t.date),
              nextRecurrenceDate: t.nextRecurrenceDate
                ? new Date(t.nextRecurrenceDate)
                : undefined,
            }))
          : [];

        return {
          transactions,
          monthlyBudget: data.monthlyBudget || null,
          spendingCategories: data.spendingCategories || [],
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting financial data from cloud:", error);
      return null;
    }
  }

  // Save transactions only
  public async saveTransactions(transactions: ExpenseData[]): Promise<void> {
    try {
      if (!authService.isAuthenticated()) {
        return;
      }

      const userDocRef = this.getUserDocRef();
      const serializedTransactions = transactions.map((t) => ({
        ...t,
        date: t.date.toISOString(),
        nextRecurrenceDate: t.nextRecurrenceDate
          ? t.nextRecurrenceDate.toISOString()
          : undefined,
      }));

      await updateDoc(userDocRef, {
        transactions: serializedTransactions,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("No document to update")
      ) {
        const serializedTransactions = transactions.map((t) => ({
          ...t,
          date: t.date.toISOString(),
          nextRecurrenceDate: t.nextRecurrenceDate
            ? t.nextRecurrenceDate.toISOString()
            : undefined,
        }));
        await this.createUserDocument({ transactions: serializedTransactions });
      } else {
        console.error("Error saving transactions to cloud:", error);
        throw error;
      }
    }
  }

  // Save spending categories only
  public async saveSpendingCategories(
    spendingCategories: SpendingCategory[],
  ): Promise<void> {
    try {
      if (!authService.isAuthenticated()) {
        return;
      }

      const userDocRef = this.getUserDocRef();
      await updateDoc(userDocRef, {
        spendingCategories,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("No document to update")
      ) {
        await this.createUserDocument({ spendingCategories });
      } else {
        console.error("Error saving spending categories to cloud:", error);
        throw error;
      }
    }
  }

  // Save monthly budget only
  public async saveMonthlyBudget(monthlyBudget: number | null): Promise<void> {
    try {
      if (!authService.isAuthenticated()) {
        return;
      }

      const userDocRef = this.getUserDocRef();
      await updateDoc(userDocRef, {
        monthlyBudget,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("No document to update")
      ) {
        await this.createUserDocument({ monthlyBudget });
      } else {
        console.error("Error saving monthly budget to cloud:", error);
        throw error;
      }
    }
  }

  // Get all user data from cloud
  public async getAllUserData(): Promise<UserCloudData | null> {
    try {
      // Check if user is authenticated before attempting cloud access
      if (!authService.isAuthenticated()) {
        return null;
      }

      const userDocRef = this.getUserDocRef();
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        return docSnap.data() as UserCloudData;
      }
      return null;
    } catch (error) {
      console.error("Error getting all user data from cloud:", error);
      return null;
    }
  }

  // Sync all financial data to cloud
  public async syncAllDataToCloud(): Promise<void> {
    // This method is kept for compatibility but doesn't do anything
    // as financial data is already synced through saveFinancialData
    console.log("Financial data sync is handled by saveFinancialData method");
  }

  // Check if cloud data is newer than local data
  public async isCloudDataNewer(localTimestamp: Date): Promise<boolean> {
    try {
      const userDocRef = this.getUserDocRef();
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lastUpdated) {
          const cloudTimestamp = data.lastUpdated.toDate();
          return cloudTimestamp > localTimestamp;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking cloud data timestamp:", error);
      return false;
    }
  }

  // Get user document reference
  private getUserDocRef() {
    const userId = authService.getUserId();
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return doc(db, "users", userId);
  }

  // Create user document
  private async createUserDocument(
    initialData: Partial<UserCloudData>,
  ): Promise<void> {
    try {
      const userDocRef = this.getUserDocRef();
      await setDoc(userDocRef, {
        ...initialData,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating user document:", error);
      throw error;
    }
  }
}

export const cloudStorageService = CloudStorageService.getInstance();
