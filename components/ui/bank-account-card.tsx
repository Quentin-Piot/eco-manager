import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AccountDetailsWithId,
  useAccount,
} from "~/lib/context/account-context";
import { AccountModal } from "./account-modal";
import { Ionicons } from "@expo/vector-icons";

export type AccountType = "current" | "savings" | "cash";

export type AccountDetails = {
  title: string;
  amount: number;
  type: AccountType;
  borderColor: { borderLeftColor: string };
};

type BankAccountCardProps = {
  accounts: AccountDetailsWithId[];
  type: AccountType;
  className?: string;
};

export function BankAccountCard({
  accounts,
  type,
  className,
}: BankAccountCardProps) {
  const { deleteAccount } = useAccount();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<
    AccountDetailsWithId | undefined
  >(undefined);

  const filteredAccounts = accounts.filter((account) => {
    if (type === "savings") return account.type === "savings";
    return account.type !== "savings";
  });

  const totalAmount = filteredAccounts.reduce(
    (sum, account) => sum + account.amount,
    0,
  );

  const title = type === "current" ? "Comptes courants" : "Épargnes";
  const iconColor =
    type === "current"
      ? "#007AFF" // iOS Blue
      : "#34C759"; // iOS Green

  const handleAddAccount = () => {
    setSelectedAccount(undefined);
    setModalVisible(true);
  };

  const handleEditAccount = (account: AccountDetailsWithId) => {
    setSelectedAccount(account);
    setModalVisible(true);
  };

  const handleDeleteAccount = (account: AccountDetailsWithId) => {
    Alert.alert(
      "Supprimer le compte",
      `Êtes-vous sûr de vouloir supprimer le compte ${account.title} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteAccount(account.id);
          },
        },
      ],
    );
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Card className={className}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                {title}
              </CardTitle>
              <TouchableOpacity
                onPress={handleAddAccount}
                className="p-1 -mr-2"
              >
                <Ionicons name="add-circle" size={24} color={iconColor} />
              </TouchableOpacity>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                € {totalAmount.toLocaleString("fr-FR")}
              </Text>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent
          insets={{
            left: type === "current" ? 10 : 0,
            right: type === "current" ? 0 : 10,
            top: 190,
          }}
          className="flex-1 w-96 rounded-xl p-4 bg-white/90 dark:bg-neutral-800/90 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50"
        >
          <View className="gap-2">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center py-1"
                >
                  <View className="flex-row items-center flex-1 pr-2">
                    <View
                      style={[
                        styles.colorIndicator,
                        {
                          backgroundColor: account.borderColor.borderLeftColor,
                        },
                      ]}
                    />
                    <Text className="text-base text-neutral-800 dark:text-neutral-100 flex-shrink text-nowrap">
                      {account.title}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-base font-semibold text-neutral-800 dark:text-neutral-100 mr-2">
                      {account.amount.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleEditAccount(account)}
                      className="p-1"
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={18}
                        color="#007AFF"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteAccount(account)}
                      className="p-1 ml-1"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#FF3B30"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-sm text-neutral-500 italic text-center py-2">
                Aucun compte {type === "current" ? "courant" : "d'épargne"}
              </Text>
            )}
            <TouchableOpacity
              onPress={handleAddAccount}
              className="flex-row items-center justify-center mt-3 py-2 bg-neutral-100/70 dark:bg-neutral-700/70 rounded-lg"
            >
              <Ionicons name="add" size={20} color="#007AFF" />
              <Text className="text-base text-primary ml-1 text-neutral-800 dark:text-neutral-100">
                Ajouter un compte {type === "current" ? "courant" : "d'épargne"}
              </Text>
            </TouchableOpacity>
          </View>
        </TooltipContent>
      </Tooltip>

      <AccountModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        account={selectedAccount}
      />
    </>
  );
}

const styles = StyleSheet.create({
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
});
