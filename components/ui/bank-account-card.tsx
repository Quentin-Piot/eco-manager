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
  const borderColor =
    type === "current"
      ? { borderLeftColor: "#3b82f6" } // blue
      : { borderLeftColor: "#22c55e" }; // green

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
          <Card style={[styles.card, borderColor]} className={className}>
            <CardHeader className="flex-row items-center justify-between space-y-0 mb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {title}
              </CardTitle>
              <TouchableOpacity onPress={handleAddAccount}>
                <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
              </TouchableOpacity>
            </CardHeader>
            <CardContent className="pl-0">
              <Text className="w-full text-center">
                <Text className={"font-semibold text-base"}>€ </Text>
                <Text className="text-xl font-semibold">{totalAmount}</Text>
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
        >
          <View className="gap-2">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center"
                >
                  <View className="flex-row items-center">
                    <View
                      style={[
                        styles.colorIndicator,
                        {
                          backgroundColor: account.borderColor.borderLeftColor,
                        },
                      ]}
                    />
                    <Text className="text-sm text-popover-foreground mr-4">
                      {account.title}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-sm font-semibold text-popover-foreground mr-2">
                      {account.amount.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleEditAccount(account)}
                      className="mr-1"
                    >
                      <Ionicons name="pencil" size={16} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteAccount(account)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-sm text-gray-500 italic">
                Aucun compte {type === "current" ? "courant" : "d'épargne"}
              </Text>
            )}
            <TouchableOpacity
              onPress={handleAddAccount}
              className="flex-row items-center justify-center mt-2 py-2 bg-gray-100 rounded-md"
            >
              <Ionicons name="add" size={16} color="#3b82f6" />
              <Text className="text-sm text-primary ml-1">
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
  card: {
    borderLeftWidth: 4,
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
});
