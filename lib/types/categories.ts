// Need to import MaterialIcons for the type
import { MaterialIcons } from "@expo/vector-icons";

export type ExpenseCategory =
  | "shopping"
  | "housing"
  | "activities"
  | "other_expenses"
  | "laundry"
  | "drinks"
  | "coffee"
  | "groceries"
  | "entertainment"
  | "fees_charges"
  | "exchange_fees"
  | "accommodation"
  | "tourism"
  | "transport"
  | "flights"
  | "restaurants";

export type RevenueCategory = "other_revenue" | "gifts" | "salary";

export type Category = ExpenseCategory | RevenueCategory;

export type CategoryType = "expense" | "revenue";

export interface CategoryDetails {
  name: string;
  type: CategoryType;
  iconName: keyof typeof MaterialIcons.glyphMap; // Use MaterialIcons names
}

export const categoryDetailsMap: Record<Category, CategoryDetails> = {
  // Expenses
  shopping: { name: "Achats", type: "expense", iconName: "shopping-bag" },
  housing: { name: "Logement", type: "expense", iconName: "home" },

  activities: {
    name: "Activités",
    type: "expense",
    iconName: "directions-run",
  }, // Example icon
  other_expenses: {
    name: "Autres dépenses",
    type: "expense",
    iconName: "receipt-long",
  }, // Example icon
  laundry: {
    name: "Blanchisserie",
    type: "expense",
    iconName: "local-laundry-service",
  },
  drinks: { name: "Boissons", type: "expense", iconName: "local-bar" },
  coffee: { name: "Cafés", type: "expense", iconName: "local-cafe" },
  groceries: { name: "Courses", type: "expense", iconName: "shopping-cart" },
  entertainment: {
    name: "Divertissement",
    type: "expense",
    iconName: "local-play",
  }, // Example icon
  fees_charges: {
    name: "Frais & Charges",
    type: "expense",
    iconName: "attach-money",
  }, // Example icon
  exchange_fees: {
    name: "Frais de change",
    type: "expense",
    iconName: "currency-exchange",
  },
  accommodation: { name: "Hébergements", type: "expense", iconName: "hotel" },
  tourism: { name: "Tourisme", type: "expense", iconName: "map" }, // Example icon
  transport: { name: "Transport", type: "expense", iconName: "directions-bus" },
  flights: { name: "Vols", type: "expense", iconName: "flight" },
  restaurants: { name: "Restaurants", type: "expense", iconName: "restaurant" },
  // Revenue
  other_revenue: {
    name: "Autre revenu",
    type: "revenue",
    iconName: "account-balance-wallet",
  }, // Example icon
  gifts: { name: "Cadeaux", type: "revenue", iconName: "card-giftcard" },
  salary: { name: "Salaire", type: "revenue", iconName: "payments" }, // Example icon
};
