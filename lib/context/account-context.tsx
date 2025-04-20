import React, { createContext, useContext, useState } from "react";
// Supposons que AccountDetails inclut maintenant ou devrait inclure un 'id'
import { AccountDetails } from "@/components/ui/bank-account-card";
import {
  Category,
  categoryDetailsMap,
  ExpenseCategory,
} from "~/lib/types/categories";
import { bankColors } from "~/lib/constants/bank-colors";

// Interface pour les données de catégorie de dépenses (inchangée pour l'instant)
interface SpendingCategoryData {
  type: Category;
  title: string;
  currentAmount: string;
  budgetAmount: string;
  percentage: number;
  color: {
    bg: string;
    text: string;
    progress: string;
  };
}

// Interface pour les données brutes du graphique, avec ajout de accountId
interface ChartDataRaw {
  type: ExpenseCategory;
  value: number;
  accountId: string; // Ajout de l'identifiant du compte
}

// Type étendu pour AccountDetails (si non défini dans l'import)
// Assurez-vous que AccountDetails dans bank-account-card.tsx a bien un 'id'
export interface AccountDetailsWithId extends AccountDetails {
  id: string;
}

// Type pour la valeur du contexte
type AccountContextType = {
  accounts: AccountDetailsWithId[]; // Utiliser le type avec ID
  spendingCategories: SpendingCategoryData[];
  monthlyChartDataRaw: ChartDataRaw[];
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  // --- Données des comptes avec ID unique ---
  const [accounts] = useState<AccountDetailsWithId[]>([
    {
      id: "acc-lcl", // ID unique
      title: "LCL",
      amount: 1250.75,
      type: "current",
      borderColor: bankColors[1].color,
    },
    {
      id: "acc-joint", // ID unique
      title: "Compte Joint",
      amount: 2340.5,
      type: "current",
      borderColor: bankColors[2].color,
    },
    {
      id: "acc-bourso", // ID unique
      title: "Bourso Personal",
      amount: 750.0,
      type: "current",
      borderColor: bankColors[3].color,
    },
    {
      id: "acc-revolut", // ID unique
      title: "Revolut Personal",
      amount: 159.0,
      type: "current",
      borderColor: bankColors[4].color,
    },
    {
      id: "acc-cash", // ID unique
      title: "Espèces",
      amount: 50.0,
      type: "current",
      borderColor: bankColors[5].color,
    },
    // Note: Les comptes épargne n'auront probablement pas de dépenses associées
    {
      id: "sav-livreta", // ID unique
      title: "Livret A",
      amount: 8250.3,
      type: "savings",
      borderColor: bankColors[1].color,
    },
    {
      id: "sav-devdurable", // ID unique
      title: "Développement Durable",
      amount: 2500.5,
      type: "savings",
      borderColor: bankColors[6].color,
    },
    {
      id: "sav-general", // ID unique
      title: "Épargne Générale",
      amount: 2000.0,
      type: "savings",
      borderColor: bankColors[7].color,
    },
  ]);

  // --- Catégories de dépenses principales (inchangées) ---
  const [spendingCategories] = useState<SpendingCategoryData[]>([
    {
      type: "housing" as Category,
      title: categoryDetailsMap.housing.name,
      currentAmount: "€850",
      budgetAmount: "€900",
      percentage: 94,
      color: {
        bg: "bg-rose-500/20",
        text: "text-rose-700",
        progress: "bg-rose-500",
      },
    },
    {
      type: "transport" as Category,
      title: categoryDetailsMap.transport.name,
      currentAmount: "€120",
      budgetAmount: "€200",
      percentage: 60,
      color: {
        bg: "bg-blue-500/20",
        text: "text-blue-700",
        progress: "bg-blue-500",
      },
    },
    {
      type: "shopping" as Category,
      title: categoryDetailsMap.shopping.name,
      currentAmount: "€320",
      budgetAmount: "€300",
      percentage: 107,
      color: {
        bg: "bg-purple-500/20",
        text: "text-purple-700",
        progress: "bg-purple-500",
      },
    },
    {
      type: "activities" as Category,
      title: categoryDetailsMap.activities.name,
      currentAmount: "€180",
      budgetAmount: "€250",
      percentage: 72,
      color: {
        bg: "bg-amber-500/20",
        text: "text-amber-700",
        progress: "bg-amber-500",
      },
    },
    // ... autres catégories principales si nécessaire ...
  ]);

  // --- Données brutes des dépenses mensuelles avec accountId ---
  const [monthlyChartDataRaw] = useState<ChartDataRaw[]>([
    // Associer chaque dépense à un compte courant (exemples)
    { type: "housing", value: 850, accountId: "acc-joint" }, // Payé depuis le compte joint
    { type: "transport", value: 50, accountId: "acc-lcl" }, // Dépense transport LCL
    { type: "transport", value: 100, accountId: "acc-joint" }, // Dépense transport Compte Joint
    { type: "shopping", value: 200, accountId: "acc-lcl" }, // Shopping LCL
    { type: "shopping", value: 120, accountId: "acc-bourso" }, // Shopping Bourso
    { type: "activities", value: 180, accountId: "acc-joint" }, // Activités Compte Joint
    { type: "groceries", value: 150, accountId: "acc-joint" }, // Courses Compte Joint
    { type: "groceries", value: 60.5, accountId: "acc-lcl" }, // Courses LCL
    { type: "restaurants", value: 70, accountId: "acc-lcl" }, // Restaurant LCL
    { type: "restaurants", value: 45.75, accountId: "acc-revolut" }, // Restaurant Revolut
    { type: "entertainment", value: 75.0, accountId: "acc-bourso" }, // Divertissement Bourso
    { type: "coffee", value: 25.2, accountId: "acc-revolut" }, // Cafés Revolut
    { type: "fees_charges", value: 15.0, accountId: "acc-lcl" }, // Frais LCL
    // ... potentiellement d'autres dépenses ...
  ]);

  // Valeur fournie par le contexte
  const contextValue: AccountContextType = {
    accounts,
    spendingCategories,
    monthlyChartDataRaw,
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
