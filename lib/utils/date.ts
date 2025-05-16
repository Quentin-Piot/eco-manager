import { RecurrenceType } from "~/lib/context/account-context";

export function calculateNextRecurrenceDate(
  date: Date,
  recurrence: RecurrenceType,
): Date | undefined {
  if (recurrence === "none") return undefined;

  const nextDate = new Date(date);
  switch (recurrence) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  return nextDate;
}

/**
 * Generates dates for recurring transactions from a start date up to an end date
 * @param startDate The first occurrence date
 * @param recurrence The recurrence type
 * @param endDate The date until which to generate recurrences (defaults to current date)
 * @param includeStart Whether to include the start date in the result (defaults to false)
 * @returns Array of dates for each recurrence
 */
export function generateRecurringTransactionDates(
  startDate: Date,
  recurrence: RecurrenceType,
  endDate: Date = new Date(),
  includeStart: boolean = false,
): Date[] {
  if (recurrence === "none") return [];

  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  // Optionally include the start date
  if (includeStart) {
    dates.push(new Date(currentDate));
  }

  // Calculate the first recurrence date
  currentDate = calculateNextRecurrenceDate(currentDate, recurrence) as Date;

  // Generate all recurrences up to the end date
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate = calculateNextRecurrenceDate(currentDate, recurrence) as Date;
  }

  return dates;
}

/**
 * Check if two dates match the pattern for a given recurrence type
 */
export function datesMatchForRecurrence(
  date1: Date,
  date2: Date,
  recurrence: RecurrenceType,
): boolean {
  if (!date1 || !date2) return false;

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  switch (recurrence) {
    case "daily":
      return true; // Every day matches for daily recurrence
    case "weekly":
      return d1.getDay() === d2.getDay(); // Same day of week
    case "monthly":
      return d1.getDate() === d2.getDate(); // Same day of month
    case "yearly":
      return d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate(); // Same month and day
    default:
      return false;
  }
}

/**
 * Determines if a transaction is likely to be a recurring instance of a parent transaction
 */
export function isRecurringInstanceOf(
  transaction: { date: Date; recurrenceGroup?: string },
  parentTransaction: {
    date: Date;
    recurrence: RecurrenceType;
    recurrenceGroup?: string;
  },
): boolean {
  // If they have the same recurrence group, they are related
  if (
    transaction.recurrenceGroup &&
    parentTransaction.recurrenceGroup &&
    transaction.recurrenceGroup === parentTransaction.recurrenceGroup
  ) {
    return true;
  }

  // If the recurrence is none, it can't be a recurring instance
  if (parentTransaction.recurrence === "none") return false;

  const transactionDate = new Date(transaction.date);
  const parentDate = new Date(parentTransaction.date);

  // If the transaction date is before the parent, it cannot be an instance
  if (transactionDate < parentDate) return false;

  // Check if this could be a recurring instance based on date pattern
  return datesMatchForRecurrence(
    transactionDate,
    parentDate,
    parentTransaction.recurrence,
  );
}
