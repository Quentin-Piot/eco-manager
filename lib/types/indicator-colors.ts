export type CategoryColorKey =
  | "housing"
  | "transport"
  | "shopping"
  | "activities"
  | "vacation"
  | "income";

export interface CategoryColors {
  housing: string;
  transport: string;
  shopping: string;
  activities: string;
  vacation: string;
  income: string;
}

// Couleurs par défaut pour les catégories
export const defaultCategoryColors: CategoryColors = {
  housing: "#4F46E5", // indigo
  transport: "#10B981", // emerald
  shopping: "#F59E0B", // amber
  activities: "#EF4444", // red
  vacation: "#8B5CF6", // violet
  income: "#14B8A6", // teal
};

// Liste des couleurs disponibles pour la personnalisation
export const availableColors = [
  "#4F46E5", // indigo
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#14B8A6", // teal
  "#06B6D4", // cyan
  "#0EA5E9", // sky
  "#EC4899", // pink
  "#6366F1", // indigo
  "#F97316", // orange
  "#84CC16", // lime
];
