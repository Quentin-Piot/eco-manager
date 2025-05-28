import { MaterialIcons } from "@expo/vector-icons";

export type MainExpenseCategory =
  | "housing"
  | "transport"
  | "shopping"
  | "activities"
  | "vacation";

export type HomeSubcategory =
  | "rent"
  | "insurance"
  | "subscriptions"
  | "bills"
  | "medical"
  | "other";
// Ajout de 'plane' et 'car'
export type TransportSubcategory =
  | "public"
  | "train"
  | "plane"
  | "car"
  | "other";
export type ShoppingSubcategory =
  | "food"
  | "clothing"
  | "pharmacy"
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

export type MainRevenueCategory = "income";

export type IncomeSubcategory = "salary" | "gift" | "other";

export type Subcategory =
  | HomeSubcategory
  | TransportSubcategory
  | ShoppingSubcategory
  | ActivitiesSubcategory
  | VacationSubcategory
  | IncomeSubcategory;

export type MainCategory = MainExpenseCategory | MainRevenueCategory;

export type CategoryType = "expense" | "revenue";

export interface CategoryPath {
  mainCategory: MainCategory;
  subcategory: Subcategory;
}

export interface CategoryDetails {
  name: string;
  type: CategoryType;
  label: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
}

export interface SubcategoryDetails extends CategoryDetails {
  mainCategory: MainCategory;
}

export type Category = string;

export const mainCategoryDetailsMap: Record<MainCategory, CategoryDetails> = {
  housing: {
    name: "housing",
    label: "Logement",
    type: "expense",
    iconName: "home",
  },
  transport: {
    name: "transport",
    label: "Transport",
    type: "expense",
    iconName: "directions-bus",
  },
  shopping: {
    name: "shopping",
    label: "Achats",
    type: "expense",
    iconName: "shopping-bag",
  },
  activities: {
    name: "activities",
    label: "Activités",
    type: "expense",
    iconName: "restaurant",
  },
  vacation: {
    name: "vacation",
    label: "Vacances",
    type: "expense",
    iconName: "beach-access",
  },
  income: {
    name: "income",
    label: "Revenus",
    type: "revenue",
    iconName: "payments",
  },
};

export const subcategoryDetailsMap: Record<string, SubcategoryDetails> = {
  "housing.rent": {
    name: "rent",
    label: "Loyer",
    type: "expense",
    iconName: "house",
    mainCategory: "housing",
  },
  "housing.insurance": {
    name: "insurance",
    label: "Assurance",
    type: "expense",
    iconName: "security",
    mainCategory: "housing",
  },
  "housing.subscriptions": {
    name: "subscriptions",
    label: "Abonnements",
    type: "expense",
    iconName: "subscriptions",
    mainCategory: "housing",
  },
  "housing.bills": {
    name: "bills",
    label: "Factures",
    type: "expense",
    iconName: "receipt",
    mainCategory: "housing",
  },
  "housing.medical": {
    name: "medical",
    label: "Médical",
    type: "expense",
    iconName: "medical-services",
    mainCategory: "housing",
  },
  "housing.other": {
    name: "other",
    label: "Autres",
    type: "expense",
    iconName: "more-horiz",
    mainCategory: "housing",
  },

  "transport.public": {
    name: "public",
    label: "Transport public",
    type: "expense",
    iconName: "directions-bus",
    mainCategory: "transport",
  },
  "transport.train": {
    name: "train",
    label: "Train",
    type: "expense",
    iconName: "train",
    mainCategory: "transport",
  },
  "transport.plane": {
    name: "plane",
    label: "Avion",
    type: "expense",
    iconName: "flight",
    mainCategory: "transport",
  },
  "transport.car": {
    name: "car",
    label: "Voiture",
    type: "expense",
    iconName: "directions-car",
    mainCategory: "transport",
  },
  "transport.other": {
    name: "other",
    label: "Autres",
    type: "expense",
    iconName: "more-horiz",
    mainCategory: "transport",
  },

  "shopping.food": {
    name: "food",
    label: "Restaurants",
    type: "expense",
    iconName: "restaurant",
    mainCategory: "shopping",
  },
  "shopping.drinks": {
    name: "drinks",
    label: "Verres",
    type: "expense",
    iconName: "nightlife",
    mainCategory: "shopping",
  },
  "shopping.clothing": {
    name: "clothing",
    label: "Vêtements",
    type: "expense",
    iconName: "checkroom",
    mainCategory: "shopping",
  },
  "shopping.pharmacy": {
    name: "pharmacy",
    label: "Pharmacie",
    type: "expense",
    iconName: "local-pharmacy",
    mainCategory: "shopping",
  },
  "shopping.gifts": {
    name: "gifts",
    label: "Cadeaux",
    type: "expense",
    iconName: "card-giftcard",
    mainCategory: "shopping",
  },
  "shopping.other": {
    name: "other",
    label: "Autres",
    type: "expense",
    iconName: "more-horiz",
    mainCategory: "shopping",
  },

  "activities.restaurant": {
    name: "restaurant",
    label: "Restaurant",
    type: "expense",
    iconName: "restaurant",
    mainCategory: "activities",
  },
  "activities.cafe": {
    name: "café",
    label: "Café",
    type: "expense",
    iconName: "local-cafe",
    mainCategory: "activities",
  },
  "activities.drinks": {
    name: "drinks",
    label: "Boissons",
    type: "expense",
    iconName: "local-bar",
    mainCategory: "activities",
  },
  "activities.sport": {
    name: "sport",
    label: "Sport",
    type: "expense",
    iconName: "sports",
    mainCategory: "activities",
  },
  "activities.other": {
    name: "other",
    label: "Autres",
    type: "expense",
    iconName: "more-horiz",
    mainCategory: "activities",
  },

  "vacation.transport": {
    name: "transport",
    label: "Transport",
    type: "expense",
    iconName: "flight",
    mainCategory: "vacation",
  },
  "vacation.accommodation": {
    name: "accommodation",
    label: "Hébergement",
    type: "expense",
    iconName: "hotel",
    mainCategory: "vacation",
  },
  "vacation.activities": {
    name: "activities",
    label: "Activités",
    type: "expense",
    iconName: "local-activity",
    mainCategory: "vacation",
  },
  "vacation.restaurant": {
    name: "restaurant",
    label: "Restaurant",
    type: "expense",
    iconName: "restaurant",
    mainCategory: "vacation",
  },
  "housing.groceries": {
    name: "groceries",
    label: "Courses",
    type: "expense",
    iconName: "shopping-cart",
    mainCategory: "housing",
  },
  "vacation.other": {
    name: "other",
    label: "Autres",
    type: "expense",
    iconName: "more-horiz",
    mainCategory: "vacation",
  },

  "income.salary": {
    name: "salary",
    label: "Salaire",
    type: "revenue",
    iconName: "payments",
    mainCategory: "income",
  },
  "income.gift": {
    name: "gift",
    label: "Cadeau",
    type: "revenue",
    iconName: "card-giftcard",
    mainCategory: "income",
  },
  "income.other": {
    name: "other",
    label: "Autres",
    type: "revenue",
    iconName: "more-horiz",
    mainCategory: "income",
  },
};

export function getCategoryKey(
  mainCategory: MainCategory,
  subcategory: Subcategory,
): string {
  return `${mainCategory}.${subcategory}`;
}

export function getCategoryDetails(
  mainCategory: MainCategory,
  subcategory: Subcategory,
): SubcategoryDetails {
  const key = getCategoryKey(mainCategory, subcategory);
  return subcategoryDetailsMap[key];
}

export const categoryDetailsMap: Record<string, CategoryDetails> = {
  shopping: {
    ...mainCategoryDetailsMap.shopping,
    name: "shopping",
    iconName: "shopping-bag",
  },
  housing: {
    ...mainCategoryDetailsMap.housing,
    name: "housing",
    iconName: "home",
  },
  vacation: {
    ...mainCategoryDetailsMap.vacation,
    name: "vacation",
    iconName: "beach-access",
  },
  activities: {
    ...mainCategoryDetailsMap.activities,
    name: "activities",
    iconName: "restaurant",
  },
  other_expenses: {
    name: "other expenses",
    label: "Autres dépenses",
    type: "expense",
    iconName: "receipt-long",
  },
  laundry: {
    ...subcategoryDetailsMap["housing.other"],
    name: "laundry",
  },
  drinks: {
    ...subcategoryDetailsMap["activities.drinks"],
    name: "drinks",
  },
  coffee: {
    ...subcategoryDetailsMap["activities.cafe"],
    name: "coffee",
  },
  groceries: {
    ...subcategoryDetailsMap["shopping.food"],
    name: "groceries",
  },
  entertainment: {
    name: "entertainment",
    label: "Divertissement",
    type: "expense",
    iconName: "local-play",
  },
  fees_charges: {
    name: "fees & charges",
    label: "Frais & Charges",
    type: "expense",
    iconName: "attach-money",
  },
  exchange_fees: {
    name: "exchange fees",
    label: "Frais de change",
    type: "expense",
    iconName: "currency-exchange",
  },
  accommodation: {
    ...subcategoryDetailsMap["vacation.accommodation"],
    name: "accommodation",
  },
  tourism: {
    name: "tourism",
    label: "Tourisme",
    type: "expense",
    iconName: "map",
  },
  transport: {
    ...mainCategoryDetailsMap.transport,
    name: "transport",
  },
  flights: {
    // Note: ceci fait référence au transport des vacances,
    // mais pourrait potentiellement être lié à 'transport.plane' si nécessaire.
    ...subcategoryDetailsMap["vacation.transport"],
    name: "flights",
  },
  restaurants: {
    ...subcategoryDetailsMap["activities.restaurant"],
    name: "restaurants",
  },
  other_revenue: {
    name: "other revenue",
    label: "Autre revenu",
    type: "revenue",
    iconName: "account-balance-wallet",
  },
  gifts: {
    ...subcategoryDetailsMap["income.gift"],
    name: "gifts",
  },
  salary: {
    ...subcategoryDetailsMap["income.salary"],
    name: "salary",
  },
};
