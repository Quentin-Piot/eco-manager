import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "./button";
import { Text } from "~/components/ui/text";
import { BottomModal } from "~/components/ui/custom-modal";
import { Input } from "~/components/ui/input";

interface MonthlyBudgetModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentBudget: number | null;
  onSave: (newBudget: number) => void;
  totalCategoryBudgets: number;
  // categoryBudgetsDetails?: { name: string; amount: number }[];
}

export function MonthlyBudgetModal({
  isVisible,
  onClose,
  currentBudget,
  onSave,
  totalCategoryBudgets,
  // categoryBudgetsDetails = [],
}: MonthlyBudgetModalProps) {
  const [newBudgetInput, setNewBudgetInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      const initialValue =
        currentBudget !== null
          ? currentBudget.toString()
          : Math.ceil(totalCategoryBudgets * 1.1).toString();
      setNewBudgetInput(initialValue);
      setError(null); // Initialise l'erreur lors de l'ouverture
    } else {
      setNewBudgetInput("");
      setError(null); // Réinitialise l'erreur lors de la fermeture
    }
  }, [isVisible, currentBudget, totalCategoryBudgets]);

  const handleSave = () => {
    const budgetValue = parseFloat(newBudgetInput.replace(",", "."));
    // Réinitialiser l'erreur avant de valider pour ne montrer l'erreur que si la validation échoue maintenant
    +setError(null);

    if (isNaN(budgetValue) || budgetValue <= 0) {
      setError("Veuillez entrer un montant valide supérieur à 0.");
      return;
    }

    if (budgetValue < totalCategoryBudgets) {
      setError(
        `Doit être au moins égal au total des budgets de catégories (${totalCategoryBudgets}€).`,
      );
      return;
    }

    onSave(budgetValue);
    onClose();
  };

  const staticCategoryDetails = [
    { name: "Logement", amount: 900 },
    { name: "Vacances", amount: 250 },
    { name: "Shopping", amount: 250 },
    { name: "Activités", amount: 250 },
  ];

  return (
    <BottomModal visible={isVisible} onRequestClose={onClose}>
      <Text className="text-lg font-semibold mb-1 text-foreground dark:text-primary-foreground">
        {currentBudget === null
          ? "Définir votre budget mensuel"
          : "Modifier le budget mensuel"}{" "}
      </Text>

      <View className=" mt-4 mb-6 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
        <Text className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          Détail des budgets par catégorie :
        </Text>
        {/* Mapper ici si vous avez des données dynamiques */}
        {staticCategoryDetails.map((cat, index) => (
          <View key={index} className="flex-row justify-between mb-1">
            <Text className="text-sm text-neutral-600 dark:text-neutral-400">
              - {cat.name}
            </Text>
            <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {cat.amount}€
            </Text>
          </View>
        ))}
        <View className="flex-row justify-between mt-2 pt-2 border-t border-neutral-300 dark:border-neutral-600">
          <Text className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
            Total catégories
          </Text>
          <Text className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
            {totalCategoryBudgets}€
          </Text>
        </View>
      </View>

      <Text className="text-sm mb-4 text-neutral-600 dark:text-neutral-400">
        Votre budget mensuel doit être supérieur ou égal au total des
        catégories.
      </Text>

      <Input
        onChangeText={(text) => {
          // Ne met à jour que le texte de l'input
          setNewBudgetInput(text);
          // L'erreur sera gérée lors du clic sur sauvegarder
          // setError(null); <-- Supprimez cette ligne
        }}
        value={newBudgetInput}
        placeholder={`Budget mensuel (€) - Minimum ${totalCategoryBudgets}€`}
        keyboardType="numeric"
        className={"mb-4"}
      />

      {error && (
        <Text className="text-sm text-red-500 dark:text-red-400 mb-4">
          {error}
        </Text>
      )}

      <View className="flex-row justify-between w-full space-x-3">
        <Button
          variant="outline"
          onPress={onClose}
          className="flex-1 border-neutral-300 dark:border-neutral-600"
        >
          <Text className="text-foreground dark:text-primary-foreground">
            Annuler
          </Text>
        </Button>
        <Button
          onPress={handleSave}
          className="flex-1 bg-primary dark:bg-primary"
        >
          <Text className="text-primary-foreground dark:text-foreground">
            Sauvegarder
          </Text>
        </Button>
      </View>
    </BottomModal>
  );
}
