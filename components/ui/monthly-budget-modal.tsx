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
}

export function MonthlyBudgetModal({
  isVisible,
  onClose,
  currentBudget,
  onSave,
  totalCategoryBudgets,
}: MonthlyBudgetModalProps) {
  const [newBudgetInput, setNewBudgetInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible && currentBudget !== null) {
      setNewBudgetInput(currentBudget.toString());
      setError(null);
    } else if (isVisible) {
      const suggestedBudget = Math.ceil(totalCategoryBudgets * 1.1);
      setNewBudgetInput(suggestedBudget.toString());
      setError(null);
    } else {
      setNewBudgetInput("");
      setError(null);
    }
  }, [isVisible, currentBudget, totalCategoryBudgets]);

  const handleSave = () => {
    const budgetValue = parseFloat(newBudgetInput);
    if (isNaN(budgetValue) || budgetValue <= 0) {
      setError("Veuillez entrer un montant valide supérieur à 0.");
      return;
    }

    if (budgetValue < totalCategoryBudgets) {
      setError(
        `Le budget mensuel doit être au moins égal au total des budgets de catégories (${totalCategoryBudgets}€).`,
      );
      return;
    }

    onSave(budgetValue);
    onClose();
  };

  return (
    <BottomModal visible={isVisible} onRequestClose={onClose}>
      <Text className="text-lg font-semibold mb-1 text-foreground dark:text-primary-foreground">
        {currentBudget === null
          ? "Définir votre budget mensuel"
          : "Modifier votre budget mensuel"}
      </Text>

      <Text className="text-sm mb-4 text-neutral-600 dark:text-neutral-400">
        Le budget mensuel représente le montant total que vous souhaitez
        dépenser sur l'ensemble de vos catégories. Il doit être au moins égal à
        la somme de vos budgets par catégorie ({totalCategoryBudgets}€) pour
        assurer une gestion cohérente de vos dépenses.
      </Text>

      <Text className="text-sm mb-4 text-neutral-600 dark:text-neutral-400">
        Vos budgets par catégorie :{"\n"}- Logement : 900€
        {"\n"}- Vacances : 250€
        {"\n"}- Shopping : 250€
        {"\n"}- Activités : 250€
        {"\n"}Total : {totalCategoryBudgets}€
      </Text>

      <Text className="text-sm mb-4 text-neutral-600 dark:text-neutral-400">
        💡 Ce budget vous permet de :{"\n"}- Avoir une vue globale de vos
        dépenses mensuelles
        {"\n"}- Définir une limite supérieure à l'ensemble de vos dépenses
        {"\n"}- Suivre facilement votre progression par rapport à votre objectif
      </Text>

      <Input
        onChangeText={(text) => {
          setNewBudgetInput(text);
          setError(null);
        }}
        value={newBudgetInput}
        placeholder="Budget mensuel (€)"
        keyboardType="numeric"
        className={"mb-2"}
      />

      {error && <Text className="text-sm text-red-500 mb-4">{error}</Text>}

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
