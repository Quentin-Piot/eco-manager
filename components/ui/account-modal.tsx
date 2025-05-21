import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
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
import { Ionicons } from "@expo/vector-icons";

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
      Alert.alert("Erreur", "Veuillez entrer un nom de compte");
      return;
    }

    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(parsedAmount)) {
      Alert.alert("Erreur", "Veuillez entrer un montant valide");
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
      <View className="flex-row items-center justify-between pb-4 border-b border-b-neutral-200 dark:border-b-neutral-700">
        <Text
          className="text-xl font-bold text-neutral-900 dark:text-neutral-50"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {account ? "Modifier le compte" : "Ajouter un compte"}
        </Text>
        <TouchableOpacity onPress={onClose} className="p-1 -mr-2">
          <Ionicons name="close-circle" size={28} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      <View className="my-4">
        <Text
          className="mb-2 text-base text-neutral-700 dark:text-neutral-200"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Nom du compte
        </Text>
        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Compte courant"
          className="bg-neutral-100/70 dark:bg-neutral-800/70 border-neutral-200 dark:border-neutral-700"
        />
      </View>
      <View className="mb-4">
        <Text
          className="mb-2 text-base text-neutral-700 dark:text-neutral-200"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {account ? "Solde actuel (€)" : "Solde initial (€)"}
        </Text>
        <Input
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0.00"
          className="bg-neutral-100/70 dark:bg-neutral-800/70 border-neutral-200 dark:border-neutral-700"
        />
      </View>

      <View className="mb-4">
        <Text
          className="mb-2 text-base text-neutral-700 dark:text-neutral-200"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Type de compte
        </Text>
        <View className="flex-row gap-2">
          {["current", "savings", "cash"].map((accountType) => (
            <TouchableOpacity
              key={accountType}
              onPress={() => setType(accountType as AccountType)}
              className={`py-2 px-4 rounded-full ${
                type === accountType
                  ? "bg-blue-500 dark:bg-blue-600"
                  : "bg-neutral-200 dark:bg-neutral-700"
              }`}
            >
              <Text
                className={`text-base text-nowrap font-medium ${
                  type === accountType
                    ? "text-white"
                    : "text-neutral-700 dark:text-neutral-200"
                }`}
                numberOfLines={1}
                ellipsizeMode="tail"
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
        <Text
          className="mb-2 text-base text-neutral-700 dark:text-neutral-200"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Couleur
        </Text>
        <View className="flex-row flex-wrap gap-3">
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
      <View className="flex-row justify-end gap-3">
        <Button
          variant="outline"
          onPress={onClose}
          className="border-neutral-300 dark:border-neutral-600 bg-transparent dark:bg-transparent"
        >
          <Text
            className="text-neutral-700 dark:text-neutral-200"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Annuler
          </Text>
        </Button>
        <Button onPress={handleSubmit} className="bg-blue-500 dark:bg-blue-600">
          <Text className="text-white" numberOfLines={1} ellipsizeMode="tail">
            {account ? "Mettre à jour" : "Ajouter"}
          </Text>
        </Button>
      </View>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
});
