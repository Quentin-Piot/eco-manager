export const colors = {
  border: "rgba(127, 179, 213, 0.3)", // Plus transparent
  input: "rgba(129, 174, 204, 0.5)", // Plus transparent
  ring: "rgba(67, 130, 172, 0.5)", // Plus transparent
  background: {
    DEFAULT: "rgba(251, 251, 251, 0.8)", // Légèrement transparent
    dark: "rgba(23, 32, 42, 0.85)", // Légèrement transparent
  },
  foreground: "#272727",
  primary: {
    DEFAULT: "rgba(67, 130, 172, 0.9)", // Plus transparent
    foreground: "#FFFFFF",
    light: "rgba(129, 174, 204, 0.8)", // Plus transparent
    dark: "rgba(41, 128, 185, 0.9)", // Plus transparent
    darker: "rgba(26, 82, 118, 0.95)", // Plus transparent
  },
  secondary: {
    DEFAULT: "rgba(133, 193, 233, 0.8)", // Plus transparent
    foreground: "#FFFFFF",
    light: "rgba(214, 234, 248, 0.7)", // Plus transparent
    dark: "rgba(52, 152, 219, 0.9)", // Plus transparent
  },
  destructive: {
    DEFAULT: "rgba(211, 47, 47, 0.9)", // Plus transparent
    foreground: "#FFFFFF",
  },
  muted: {
    light: "rgba(237, 243, 246, 0.7)", // Plus transparent
    DEFAULT: "rgba(212, 230, 241, 0.7)", // Plus transparent
    darker: "rgba(86, 101, 115, 0.8)", // Plus transparent
    foreground: "rgba(101, 110, 110, 0.9)", // Plus transparent
  },
  accent: {
    DEFAULT: "rgba(174, 214, 241, 0.8)", // Plus transparent
    foreground: "#FFFFFF",
  },
  popover: {
    DEFAULT: "rgba(244, 250, 251, 0.7)", // Plus transparent avec effet de verre
    foreground: "rgba(67, 130, 172, 0.9)", // Plus transparent
  },
  card: {
    DEFAULT: "rgba(244, 250, 251, 0.7)", // Plus transparent avec effet de verre
    foreground: "rgba(67, 130, 172, 0.9)", // Plus transparent
  },
  // Catégories avec des couleurs plus vives et légèrement transparentes
  categories: {
    // Dépenses
    shopping: "rgba(96, 165, 250, 0.9)", // Bleu clair
    housing: "rgba(167, 139, 250, 0.9)", // Violet
    activities: "rgba(251, 146, 60, 0.9)", // Orange
    other_expenses: "rgba(248, 113, 113, 0.9)", // Rouge
    laundry: "rgba(52, 211, 153, 0.9)", // Émeraude
    vacation: "rgba(52, 211, 153, 0.9)", // Émeraude
    drinks: "rgba(251, 191, 36, 0.9)", // Ambre
    coffee: "rgba(161, 98, 7, 0.9)", // Marron/Jaune foncé
    groceries: "rgba(59, 130, 246, 0.9)", // Bleu
    entertainment: "rgba(236, 72, 153, 0.9)", // Rose
    fees_charges: "rgba(139, 92, 246, 0.9)", // Violet
    exchange_fees: "rgba(16, 185, 129, 0.9)", // Vert
    accommodation: "rgba(217, 70, 239, 0.9)", // Fuchsia
    tourism: "rgba(14, 165, 233, 0.9)", // Bleu ciel
    transport: "rgba(45, 212, 191, 0.9)", // Turquoise
    flights: "rgba(20, 184, 166, 0.9)", // Turquoise
    restaurants: "rgba(239, 68, 68, 0.9)", // Rouge
    income: "rgba(239, 68, 68, 0.9)", // Rouge
    // Revenus
    other_revenue: "rgba(34, 197, 94, 0.9)", // Vert
    gifts: "rgba(234, 179, 8, 0.9)", // Jaune
    salary: "rgba(99, 102, 241, 0.9)", // Indigo
  },
};

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
  DEFAULT:
    "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
};

export const borderRadius = {
  sm: 8, // Augmenté pour un look plus moderne
  DEFAULT: 12, // Augmenté pour un look plus moderne
  md: 16, // Augmenté pour un look plus moderne
  lg: 20, // Augmenté pour un look plus moderne
  full: 9999,
};

// Nouvelles constantes pour les effets de verre (glassmorphism)
export const glass = {
  light: {
    background: "rgba(255, 255, 255, 0.6)",
    border: "rgba(255, 255, 255, 0.2)",
    shadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
    blur: 10, // Valeur pour BlurView
  },
  dark: {
    background: "rgba(30, 30, 30, 0.7)",
    border: "rgba(40, 40, 40, 0.2)",
    shadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
    blur: 15, // Valeur pour BlurView
  },
};
