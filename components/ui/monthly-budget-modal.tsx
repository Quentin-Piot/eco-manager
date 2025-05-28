import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Button } from "./button";
import { Text } from "~/components/ui/text";
import { BottomModal } from "~/components/ui/custom-modal";
import { Input } from "~/components/ui/input";
import { useAccount } from "~/lib/context/account-context";
import { categoryDetailsMap } from "~/lib/types/categories";

interface MonthlyBudgetModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentBudget: number | null;
  onSave: (newBudget: number) => void;
}

export function MonthlyBudgetModal({
  isVisible,
  onClose,
  currentBudget,
  onSave,
}: MonthlyBudgetModalProps) {
  const { spendingCategories } = useAccount();
  const [newBudgetInput, setNewBudgetInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reset = () => {
      setError(null);
      setNewBudgetInput(
        currentBudget !== null
          ? currentBudget.toString()
          : Math.ceil(totalCategoryBudgets).toString(),
      );
    };

    if (isVisible) {
      reset();
    }
  }, [currentBudget, isVisible]);

  const handleSave = () => {
    const budgetValue = parseFloat(newBudgetInput.replace(",", "."));
    setError(null);

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

  const totalCategoryBudgets = useMemo(() => {
    return spendingCategories.reduce(
      (total, category) => total + category.budgetAmount,
      0,
    );
  }, [spendingCategories]);

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
        {spendingCategories.map((cat, index) => (
          <View key={index} className="flex-row justify-between mb-1">
            <Text className="text-sm text-neutral-600 dark:text-neutral-400">
              - {categoryDetailsMap[cat.type].label}
            </Text>
            <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {cat.budgetAmount}€
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
          setNewBudgetInput(text);
        }}
        value={newBudgetInput}
        placeholder={`Budget mensuel (€) - Minimum ${totalCategoryBudgets}€`}
        keyboardType="number-pad"
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
