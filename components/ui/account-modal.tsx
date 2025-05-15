import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "./text";
import { Input } from "./input";
import { Button } from "./button";
import { BottomModal } from "./custom-modal";
import {
  AccountDetailsWithId,
  useAccount,
} from "~/lib/context/account-context";
import { bankColors } from "~/lib/constants/bank-colors";
import { AccountType } from "./bank-account-card";

type AccountModalProps = {
  isVisible: boolean;
  onClose: () => void;
  account?: AccountDetailsWithId;
};

export function AccountModal({
  isVisible,
  onClose,
  account,
}: AccountModalProps) {
  const { addAccount, updateAccount } = useAccount();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("0");
  const [type, setType] = useState<AccountType>("current");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const resetForm = useCallback(() => {
    if (!account) {
      setTitle("");
      setAmount("0");
      setType("current");
      setSelectedColorIndex(0);
    }
  }, [account]);

  useEffect(() => {
    if (account) {
      setTitle(account.title);
      setAmount(account.amount.toString());
      setType(account.type);
      setSelectedColorIndex(
        bankColors.findIndex(
          (c) =>
            c.color.borderLeftColor === account.borderColor.borderLeftColor,
        ),
      );
    } else {
      resetForm();
    }
  }, [account, resetForm]);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Veuillez entrer un nom de compte");
      return;
    }

    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(parsedAmount)) {
      alert("Veuillez entrer un montant valide");
      return;
    }

    const accountData = {
      title: title.trim(),
      amount: parsedAmount,
      type,
      borderColor: bankColors[selectedColorIndex].color,
    };

    if (account) {
      updateAccount(account.id, accountData);
    } else {
      addAccount(accountData);
    }

    resetForm();
    onClose();
  };

  return (
    <BottomModal visible={isVisible} onRequestClose={onClose}>
      <Text className="text-xl font-bold mb-4">
        {account ? "Modifier le compte" : "Ajouter un compte"}
      </Text>
      <View className="mb-4">
        <Text className="mb-1">Nom du compte</Text>
        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Compte courant"
        />
      </View>
      <View className="mb-4">
        <Text className="mb-1">
          {account ? "Solde actuel (€)" : "Solde initial (€)"}
        </Text>
        <Input
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0.00"
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Type de compte</Text>
        <View className="flex-row gap-2">
          {["current", "savings", "cash"].map((accountType) => (
            <TouchableOpacity
              key={accountType}
              onPress={() => setType(accountType as AccountType)}
              className={`py-2 px-3 rounded-full ${type === accountType ? "bg-primary" : "bg-gray-200"}`}
            >
              <Text
                className={`${type === accountType ? "text-white" : "text-gray-700"}`}
              >
                {accountType === "current"
                  ? "Courant"
                  : accountType === "savings"
                    ? "Épargne"
                    : "Espèces"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View className="mb-6">
        <Text className="mb-2">Couleur</Text>
        <View className="flex-row flex-wrap gap-2">
          {bankColors.map((color, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedColorIndex(index)}
              style={[
                styles.colorCircle,
                { backgroundColor: color.color.borderLeftColor },
                selectedColorIndex === index && styles.selectedColor,
              ]}
            />
          ))}
        </View>
      </View>
      <View className="flex-row justify-end gap-2">
        <Button variant="outline" onPress={onClose}>
          <Text>Annuler</Text>
        </Button>
        <Button onPress={handleSubmit}>
          <Text>{account ? "Mettre à jour" : "Ajouter"}</Text>
        </Button>
      </View>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: "#000",
  },
});
