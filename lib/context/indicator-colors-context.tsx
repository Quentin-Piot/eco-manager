import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CategoryColorKey,
  CategoryColors,
  defaultCategoryColors,
} from "~/lib/types/indicator-colors"; // Assurez-vous que ce chemin est correct
import {
  getIndicatorColors,
  saveIndicatorColors,
} from "~/lib/storage/indicator-colors-storage"; // Assurez-vous que ce chemin est correct

interface IndicatorColorsContextType {
  colors: CategoryColors;
  updateColor: (category: CategoryColorKey, color: string) => Promise<void>;
  getColorForCategory: (category: string) => string;
}

const IndicatorColorsContext = createContext<IndicatorColorsContextType>({
  colors: defaultCategoryColors,
  updateColor: async () => {},
  getColorForCategory: () => "#000000",
});

export const useIndicatorColors = () => useContext(IndicatorColorsContext);

export const IndicatorColorsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [colors, setColors] = useState<CategoryColors>(defaultCategoryColors);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadColors = async () => {
      try {
        const savedColors = await getIndicatorColors();
        setColors(savedColors);
      } catch (error) {
        console.error("Failed to load indicator colors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadColors();
  }, []); // Le tableau de dépendances vide est correct ici pour charger une seule fois

  const updateColor = useCallback(
    async (category: CategoryColorKey, color: string) => {
      try {
        const newColors = { ...colors, [category]: color };
        await saveIndicatorColors(newColors);
        setColors(newColors);
      } catch (error) {
        console.error("Failed to update indicator color:", error);
      }
    },
    [colors], // Dépend de `colors` pour que la closure ait la version à jour
  );

  const getColorForCategory = useCallback(
    (category: string): string => {
      if (category in colors) {
        return colors[category as CategoryColorKey];
      }
      return "#000000"; // Couleur par défaut si la catégorie n'existe pas
    },
    [colors], // Dépend de `colors`
  );

  // Mémoïser l'objet de valeur du contexte
  // Il ne changera de référence que si `colors`, `updateColor`, ou `getColorForCategory` changent.
  // Puisque `updateColor` et `getColorForCategory` sont mémoïsés et dépendent de `colors`,
  // cet objet changera principalement lorsque `colors` change.
  const contextValue = useMemo(
    () => ({
      colors,
      updateColor,
      getColorForCategory,
    }),
    [colors, updateColor, getColorForCategory],
  );

  if (isLoading) {
    return null; // Ou un composant de chargement
  }

  return (
    <IndicatorColorsContext.Provider value={contextValue}>
      {children}
    </IndicatorColorsContext.Provider>
  );
};
