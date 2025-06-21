import { MainCategory, Subcategory } from "./categories";
import { RecurrenceType } from "~/lib/context/account-context";

export interface BaseTransaction {
  id: string;
  amount: number;
  remarks?: string;
  amountOriginal?: string;
  date: Date;
  type: "expense" | "income";
  paymentMethod: "cash" | "card";
  mainCategory: MainCategory;
  subcategory: Subcategory;
  recurrence: RecurrenceType;
  nextRecurrenceDate?: Date;

  // For recurring transactions management
  recurrenceGroup?: string; // Unique ID for a group of recurring transactions
  isRecurrenceParent?: boolean; // Whether this is the parent transaction of a recurrence group
}

export type ExpenseData = BaseTransaction;
export type IncomeData = BaseTransaction;
