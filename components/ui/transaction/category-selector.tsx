import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text as UIText } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import {
  MainCategory,
  mainCategoryDetailsMap,
  Subcategory,
  subcategoryDetailsMap,
} from "~/lib/types/categories";
import { colors } from "~/lib/theme";
import { useIndicatorColors } from "~/lib/context/indicator-colors-context";

interface CategorySelectorProps {
  type: "main" | "sub";
  transactionType: "expense" | "income" | null;
  selectedMainCategory: MainCategory | null;
  selectedSubcategory: Subcategory | null;
  onSelectMainCategory?: (category: MainCategory) => void;
  onSelectSubcategory?: (category: Subcategory) => void;
  onPrevious: () => void;
  onNext: () => void;
  isEdit?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  type,
  transactionType,
  selectedMainCategory,
  selectedSubcategory,
  onSelectMainCategory,
  onSelectSubcategory,
  onPrevious,
  onNext,
  isEdit = false,
}) => {
  const { getColorForCategory } = useIndicatorColors();
  if (type === "main") {
    return (
      <>
        <UIText className="text-lg font-semibold mb-1 text-foreground dark:text-primary-foreground">
          {isEdit ? "Modifier" : "Choisir"} la catégorie principale
        </UIText>
        <UIText className="text-sm text-muted-foreground mb-4">
          Sélectionnez la catégorie principale de votre{" "}
          {transactionType === "expense" ? "dépense" : "revenu"}.
        </UIText>
        <ScrollView contentContainerStyle={styles.categoryGrid}>
          {Object.entries(mainCategoryDetailsMap)
            .filter(([_, details]) =>
              transactionType === "expense"
                ? details.type === "expense"
                : details.type === "revenue",
            )
            .map(([key, details]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.categoryItem,
                  selectedMainCategory === key && styles.selectedCategoryItem,
                ]}
                onPress={() => onSelectMainCategory?.(key as MainCategory)}
              >
                <View
                  style={[
                    styles.categoryIconContainer,
                    {
                      backgroundColor: getColorForCategory(key),
                    },
                  ]}
                >
                  <MaterialIcons
                    name={details.iconName}
                    size={24}
                    color={colors.primary.foreground}
                  />
                </View>
                <UIText className="text-center text-xs mt-1 text-foreground dark:text-primary-foreground">
                  {details.label}
                </UIText>
              </TouchableOpacity>
            ))}
        </ScrollView>
        <View className="flex-row gap-2 mt-4">
          <Button variant="outline" onPress={onPrevious} className="flex-1">
            <UIText className="text-foreground dark:text-primary-foreground">
              Précédent
            </UIText>
          </Button>
          <Button
            onPress={onNext}
            disabled={!selectedMainCategory}
            className="flex-1"
          >
            <UIText className="text-primary-foreground">Suivant</UIText>
          </Button>
        </View>
      </>
    );
  }

  if (!selectedMainCategory) {
    return null;
  }

  const subcategories = Object.entries(subcategoryDetailsMap).filter(
    ([key, details]) => details.mainCategory === selectedMainCategory,
  );

  return (
    <>
      <UIText className="text-lg font-semibold mb-1 text-foreground dark:text-primary-foreground">
        {isEdit ? "Modifier" : "Choisir"} la sous-catégorie
      </UIText>
      <UIText className="text-sm text-muted-foreground mb-4">
        Sélectionnez la sous-catégorie de votre dépense.
      </UIText>
      <ScrollView contentContainerStyle={styles.categoryGrid}>
        {subcategories.map(([key, details]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.categoryItem,
              selectedSubcategory === details.name &&
                styles.selectedCategoryItem,
            ]}
            onPress={() => onSelectSubcategory?.(details.name as Subcategory)}
          >
            <View
              style={[
                styles.categoryIconContainer,
                {
                  backgroundColor: getColorForCategory(selectedMainCategory),
                },
              ]}
            >
              <MaterialIcons
                name={details.iconName}
                size={24}
                color={colors.primary.foreground}
              />
            </View>
            <UIText className="text-center text-xs mt-1 text-foreground dark:text-primary-foreground">
              {details.label}
            </UIText>
          </TouchableOpacity>
        ))}
        {subcategories.length === 0 && (
          <UIText className="text-center text-muted-foreground p-4">
            Aucune sous-catégorie disponible pour{" "}
            {mainCategoryDetailsMap[selectedMainCategory]?.label}.
          </UIText>
        )}
      </ScrollView>
      <View className="flex-row gap-2 mt-4">
        <Button variant="outline" onPress={onPrevious} className="flex-1">
          <UIText className="text-foreground dark:text-primary-foreground">
            Précédent
          </UIText>
        </Button>
        <Button
          onPress={onNext}
          disabled={!selectedSubcategory}
          className="flex-1"
        >
          <UIText className="text-primary-foreground">
            {isEdit ? "Mettre à jour" : "Ajouter"}
          </UIText>
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingBottom: 10,
  },
  categoryItem: {
    width: "28%",
    alignItems: "center",
    marginBottom: 15,
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCategoryItem: {
    borderColor: colors.primary.DEFAULT,
    backgroundColor: colors.primary.DEFAULT + "1A",
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
