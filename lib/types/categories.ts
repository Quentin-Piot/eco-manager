// Need to import MaterialIcons for the type
import { MaterialIcons } from "@expo/vector-icons";

// Définition des catégories principales de dépenses
export type MainExpenseCategory =
  | "housing"
  | "transport"
  | "shopping"
  | "activities"
  | "vacation";

// Définition des sous-catégories pour chaque catégorie principale de dépenses
export type HomeSubcategory =
  | "rent"
  | "insurance"
  | "subscriptions"
  | "bills"
  | "medical"
  | "other";
export type TransportSubcategory = "public" | "train" | "other";
export type ShoppingSubcategory =
  | "food"
  | "clothing"
  | "pharmacy"
  | "purchase"
  | "gifts"
  | "other";
export type ActivitiesSubcategory =
  | "restaurant"
  | "cafe"
  | "drinks"
  | "sport"
  | "other";
export type VacationSubcategory =
  | "transport"
  | "accommodation"
  | "activities"
  | "restaurant"
  | "groceries"
  | "other";

// Définition des catégories principales de revenus
export type MainRevenueCategory = "income";

// Définition des sous-catégories pour chaque catégorie principale de revenus
export type IncomeSubcategory = "salary" | "gift" | "other";

// Type pour toutes les sous-catégories possibles
export type Subcategory =
  | HomeSubcategory
  | TransportSubcategory
  | ShoppingSubcategory
  | ActivitiesSubcategory
  | VacationSubcategory
  | IncomeSubcategory;

// Type pour toutes les catégories principales
export type MainCategory = MainExpenseCategory | MainRevenueCategory;

// Type pour le type de catégorie (dépense ou revenu)
export type CategoryType = "expense" | "revenue";

// Interface pour la structure complète d'une catégorie (principale + sous-catégorie)
export interface CategoryPath {
  mainCategory: MainCategory;
  subcategory: Subcategory;
}

// Interface pour les détails d'une catégorie
export interface CategoryDetails {
  name: string;
  type: CategoryType;
  iconName: keyof typeof MaterialIcons.glyphMap; // Utilise les noms de MaterialIcons
}

// Interface pour les détails d'une sous-catégorie
export interface SubcategoryDetails extends CategoryDetails {
  mainCategory: MainCategory;
}

// Type pour la compatibilité avec l'ancien système (pour la transition)
export type Category = string;

// Mapping des catégories principales vers leurs détails
export const mainCategoryDetailsMap: Record<MainCategory, CategoryDetails> = {
  // Dépenses
  housing: { name: "Logement", type: "expense", iconName: "home" },
  transport: { name: "Transport", type: "expense", iconName: "directions-bus" },
  shopping: { name: "Achats", type: "expense", iconName: "shopping-bag" },
  activities: {
    name: "Activités",
    type: "expense",
    iconName: "directions-run",
  },
  vacation: { name: "Vacances", type: "expense", iconName: "beach-access" },
  // Revenus
  income: { name: "Revenus", type: "revenue", iconName: "payments" },
};

// Mapping des sous-catégories vers leurs détails
export const subcategoryDetailsMap: Record<string, SubcategoryDetails> = {
  // Sous-catégories de Home
  "housing.rent": {
    name: "Loyer",
    type: "expense",
    iconName: "house",
    mainCategory: "housing",
  },
  "housing.insurance": {
    name: "Assurance",
    type: "expense",
    iconName: "security",
    mainCategory: "housing",
  },
  "housing.subscriptions": {
    name: "Abonnements",
    type: "expense",
    iconName: "subscriptions",
    mainCategory: "housing",
  },
  "housing.bills": {
    name: "Factures",
    type: "expense",
    iconName: "receipt",
    mainCategory: "housing",
  },
  "housing.medical": {
    name: "Médical",
    type: "expense",
    iconName: "medical-services",
    mainCategory: "housing",
  },
  "housing.other": {
    name: "Autres",
    type: "expense",
    iconName: "more-horiz",
    mainCategory: "housing",
  },

  // Sous-catégories de Transport
  "transport.public": {
    name: "Transport public",
    type: "expense",
    iconName: "directions-bus",
    mainCategory: "transport",
  },
  "transport.train": {
    name: "Train",
    type: "expense",
    iconName: "train",
    mainCategory: "transport",
  },
  "transport.other": {
    name: "Autres",
    type: "expense",
    iconName: "more-horiz",
    mainCategory: "transport",
  },

  // Sous-catégories de Shopping
  "shopping.food": {
    name: "Alimentation",
    type: "expense",
    iconName: "restaurant",
    mainCategory: "shopping",
  },
  "shopping.clothing": {
    name: "Vêtements",
    type: "expense",
    iconName: "checkroom",
    mainCategory: "shopping",
  },
  "shopping.pharmacy": {
    name: "Pharmacie",
    type: "expense",
    iconName: "local-pharmacy",
    mainCategory: "shopping",
  },
  "shopping.purchase": {
    name: "Achats",
    type: "expense",
    iconName: "shopping-cart",
    mainCategory: "shopping",
  },
  "shopping.gifts": {
    name: "Cadeaux",
    type: "expense",
    iconName: "card-giftcard",
    mainCategory: "shopping",
  },
  "shopping.other": {
    name: "Autres",
    type: "expense",
    iconName: "more-horiz",
    mainCategory: "shopping",
  },

  // Sous-catégories d'Activities
  "activities.restaurant": {
    name: "Restaurant",
    type: "expense",
    iconName: "restaurant",
    mainCategory: "activities",
  },
  "activities.cafe": {
    name: "Café",
    type: "expense",
    iconName: "local-cafe",
    mainCategory: "activities",
  },
  "activities.drinks": {
    name: "Boissons",
    type: "expense",
    iconName: "local-bar",
    mainCategory: "activities",
  },
  "activities.sport": {
    name: "Sport",
    type: "expense",
    iconName: "sports",
    mainCategory: "activities",
  },
  "activities.other": {
    name: "Autres",
    type: "expense",
    iconName: "more-horiz",
    mainCategory: "activities",
  },

  // Sous-catégories de Vacation
  "vacation.transport": {
    name: "Transport",
    type: "expense",
    iconName: "flight",
    mainCategory: "vacation",
  },
  "vacation.accommodation": {
    name: "Hébergement",
    type: "expense",
    iconName: "hotel",
    mainCategory: "vacation",
  },
  "vacation.activities": {
    name: "Activités",
    type: "expense",
    iconName: "local-activity",
    mainCategory: "vacation",
  },
  "vacation.restaurant": {
    name: "Restaurant",
    type: "expense",
    iconName: "restaurant",
    mainCategory: "vacation",
  },
  "vacation.groceries": {
    name: "Courses",
    type: "expense",
    iconName: "shopping-cart",
    mainCategory: "vacation",
  },
  "vacation.other": {
    name: "Autres",
    type: "expense",
    iconName: "more-horiz",
    mainCategory: "vacation",
  },

  // Sous-catégories d'Income
  "income.salary": {
    name: "Salaire",
    type: "revenue",
    iconName: "payments",
    mainCategory: "income",
  },
  "income.gift": {
    name: "Cadeau",
    type: "revenue",
    iconName: "card-giftcard",
    mainCategory: "income",
  },
  "income.other": {
    name: "Autres",
    type: "revenue",
    iconName: "more-horiz",
    mainCategory: "income",
  },
};

// Fonction utilitaire pour créer une clé de catégorie complète
export function getCategoryKey(
  mainCategory: MainCategory,
  subcategory: Subcategory,
): string {
  return `${mainCategory}.${subcategory}`;
}

// Fonction utilitaire pour obtenir les détails d'une catégorie complète
export function getCategoryDetails(
  mainCategory: MainCategory,
  subcategory: Subcategory,
): SubcategoryDetails {
  const key = getCategoryKey(mainCategory, subcategory);
  return subcategoryDetailsMap[key];
}

// Pour la compatibilité avec l'ancien système
export const categoryDetailsMap: Record<string, CategoryDetails> = {
  // Conversion des anciennes catégories vers les nouvelles
  shopping: mainCategoryDetailsMap.shopping,
  housing: mainCategoryDetailsMap.housing,
  vacation: mainCategoryDetailsMap.vacation,
  activities: mainCategoryDetailsMap.activities,
  other_expenses: {
    name: "Autres dépenses",
    type: "expense",
    iconName: "receipt-long",
  },
  laundry: subcategoryDetailsMap["housing.other"],
  drinks: subcategoryDetailsMap["activities.drinks"],
  coffee: subcategoryDetailsMap["activities.cafe"],
  groceries: subcategoryDetailsMap["shopping.food"],
  entertainment: {
    name: "Divertissement",
    type: "expense",
    iconName: "local-play",
  },
  fees_charges: {
    name: "Frais & Charges",
    type: "expense",
    iconName: "attach-money",
  },
  exchange_fees: {
    name: "Frais de change",
    type: "expense",
    iconName: "currency-exchange",
  },
  accommodation: subcategoryDetailsMap["vacation.accommodation"],
  tourism: { name: "Tourisme", type: "expense", iconName: "map" },
  transport: mainCategoryDetailsMap.transport,
  flights: subcategoryDetailsMap["vacation.transport"],
  restaurants: subcategoryDetailsMap["activities.restaurant"],
  // Revenus
  other_revenue: {
    name: "Autre revenu",
    type: "revenue",
    iconName: "account-balance-wallet",
  },
  gifts: subcategoryDetailsMap["income.gift"],
  salary: subcategoryDetailsMap["income.salary"],
};
