import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "./button";
import { Text } from "~/components/ui/text"; // Importer le composant Text personnalisé
import {
  categoryDetailsMap,
  MainExpenseCategory,
} from "~/lib/types/categories";
import { BottomModal } from "~/components/ui/custom-modal";
import { Input } from "~/components/ui/input"; // Importer cn si nécessaire pour combiner les classes

interface EditBudgetModalProps {
  isVisible: boolean;
  onClose: () => void;
  categoryType: MainExpenseCategory | null;
  currentBudget: number | null;
  onSave: (categoryType: MainExpenseCategory, newBudget: number) => void;
}

export function EditBudgetModal({
  isVisible,
  onClose,
  categoryType,
  currentBudget,
  onSave,
}: EditBudgetModalProps) {
  const [newBudgetInput, setNewBudgetInput] = useState<string>("");

  useEffect(() => {
    // Pré-remplir l'input avec le budget actuel lorsque le modal s'ouvre
    if (isVisible && currentBudget) {
      // Extraire seulement le nombre
      setNewBudgetInput(currentBudget.toString());
    } else {
      setNewBudgetInput(""); // Réinitialiser si pas visible ou pas de budget
    }
  }, [isVisible, currentBudget]);

  const handleSave = () => {
    const budgetValue = parseFloat(newBudgetInput);
    if (categoryType && !isNaN(budgetValue) && budgetValue >= 0) {
      onSave(categoryType, budgetValue);
      onClose(); // Fermer le modal après sauvegarde
    }
    // Ajouter une gestion d'erreur si l'input n'est pas valide
  };

  if (categoryType === null) return null;

  return (
    <BottomModal visible={isVisible} onRequestClose={onClose}>
      <Text className="text-lg font-semibold mb-1 text-foreground dark:text-primary-foreground">
        Modifier le budget pour{" "}
        {categoryDetailsMap[categoryType].name ?? "Catégorie"}
      </Text>

      <Input
        onChangeText={setNewBudgetInput}
        value={newBudgetInput}
        placeholder="Nouveau budget (€)"
        keyboardType="numeric"
        className={"mb-4"}
      />

      {/* Conteneur des boutons avec Tailwind */}
      <View className="flex-row justify-between w-full space-x-3">
        <Button variant="outline" onPress={onClose} className="flex-1">
          <Text className="text-foreground dark:text-primary-foreground">
            Annuler
          </Text>
        </Button>
        <Button onPress={handleSave} className="flex-1">
          <Text className="text-primary-foreground">Sauvegarder</Text>
        </Button>
      </View>
    </BottomModal>
  );
}

// StyleSheet.create est supprimé car les styles sont maintenant gérés par Tailwind
