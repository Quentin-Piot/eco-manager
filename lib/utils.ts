import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function hyphenToCamelCase(s: string): string {
  return s
    .split("-")
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join("");
}

export function camelToHyphenCase(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// Fonctions utilitaires pour le formatage des transactions
export function formatAmount(amount: number): string {
  return amount.toFixed(2).replace(".", ",") + " €";
}

export function parseAmount(amountStr: string): number {
  return parseFloat(amountStr.replace(",", "."));
}

export function formatAmountWithSign(
  amount: number,
  type: "expense" | "income",
): string {
  const sign = type === "income" ? "+" : "-";
  return `${sign}${amount.toFixed(2).replace(".", ",")} €`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
