import React from "react";
import { TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text as UIText } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { colors } from "~/lib/theme";
import { DatePickerModal } from "~/components/ui/date-picker-modal";
import type { AccountDetailsWithId } from "~/lib/context/account-context";

interface TransactionFormProps {
  transactionType: "expense" | "income";
  amount: string;
  remarks: string;
  date: Date;
  showDatePicker: boolean;
  paymentMethod: "cash" | "card";
  selectedAccountId: string | null;
  availableAccounts: AccountDetailsWithId[];
  isAccountSelectorVisible: boolean;
  onAmountChange: (value: string) => void;
  onRemarksChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onPaymentMethodChange: (method: "cash" | "card") => void;
  onAccountSelect: (accountId: string) => void;
  onShowDatePicker: (show: boolean) => void;
  onShowAccountSelector: (show: boolean) => void;
  onNext: () => void;
  isEdit?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transactionType,
  amount,
  remarks,
  date,
  showDatePicker,
  paymentMethod,
  selectedAccountId,
  availableAccounts,
  isAccountSelectorVisible,
  onAmountChange,
  onRemarksChange,
  onDateChange,
  onPaymentMethodChange,
  onAccountSelect,
  onShowDatePicker,
  onShowAccountSelector,
  onNext,
  isEdit = false,
}) => {
  const getSelectedAccountName = () => {
    const account = availableAccounts.find(
      (acc) => acc.id === selectedAccountId,
    );
    return account ? account.title : "Sélectionner un compte";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <UIText className="text-lg font-semibold mb-4 text-foreground dark:text-primary-foreground">
        {isEdit ? "Modifier" : "Ajouter"}{" "}
        {transactionType === "expense" ? "une dépense" : "un revenu"}
      </UIText>

      <View className="mb-4">
        <UIText className="text-sm text-muted-foreground mb-1">Montant</UIText>
        <Input
          placeholder="0,00"
          keyboardType="numeric"
          value={amount}
          onChangeText={onAmountChange}
          className="text-2xl h-12"
        />
      </View>
      <View className="mb-6">
        <UIText className="text-sm text-muted-foreground mb-2">
          Payé avec
        </UIText>
        <View className="flex-row gap-2">
          <Button
            variant={paymentMethod === "cash" ? "default" : "outline"}
            onPress={() => onPaymentMethodChange("cash")}
            className="flex-1 flex-row items-center gap-2"
          >
            <MaterialIcons
              name="account-balance-wallet"
              size={18}
              color={
                paymentMethod === "cash"
                  ? colors.primary.foreground
                  : colors.foreground
              }
            />
            <UIText
              className={cn(
                paymentMethod === "cash"
                  ? "text-primary-foreground"
                  : "text-foreground dark:text-primary-foreground",
              )}
            >
              Espèces
            </UIText>
          </Button>
          <Button
            variant={paymentMethod === "card" ? "default" : "outline"}
            onPress={() => onPaymentMethodChange("card")}
            className="flex-1 flex-row items-center gap-2"
          >
            <MaterialIcons
              name="credit-card"
              size={18}
              color={
                paymentMethod === "card"
                  ? colors.primary.foreground
                  : colors.foreground
              }
            />
            <UIText
              className={cn(
                paymentMethod === "card"
                  ? "text-primary-foreground"
                  : "text-foreground dark:text-primary-foreground",
              )}
            >
              Carte
            </UIText>
          </Button>
        </View>
      </View>

      <View className="mb-4">
        <UIText className="text-sm text-muted-foreground mb-1">Compte</UIText>
        <TouchableOpacity
          onPress={() => onShowAccountSelector(true)}
          className="flex-row items-center justify-between bg-input dark:bg-input border disabled:bg-gray-300 border-border dark:border-border rounded-md p-3 h-12"
          disabled={availableAccounts.length === 0 || paymentMethod === "cash"}
        >
          <UIText
            className={cn(
              "text-foreground dark:text-primary-foreground",
              !selectedAccountId && "text-muted-foreground",
            )}
          >
            {getSelectedAccountName()}
          </UIText>
          <MaterialIcons
            name="arrow-drop-down"
            size={24}
            color={colors.muted.foreground}
          />
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <UIText className="text-sm text-muted-foreground mb-1">
          Remarques (optionnel)
        </UIText>
        <Input
          placeholder="Description..."
          value={remarks}
          onChangeText={onRemarksChange}
          className="h-12"
        />
      </View>

      <View className="mb-4">
        <UIText className="text-sm text-muted-foreground mb-1">Date</UIText>
        <TouchableOpacity
          onPress={() => onShowDatePicker(true)}
          className="flex-row items-center bg-input dark:bg-input border border-border dark:border-border rounded-md p-3 h-12"
        >
          <MaterialIcons
            name="calendar-today"
            size={20}
            color={colors.muted.foreground}
            className="mr-2"
          />
          <UIText className="text-foreground dark:text-primary-foreground">
            {formatDate(date)}
          </UIText>
        </TouchableOpacity>
        <DatePickerModal
          isVisible={showDatePicker}
          setIsModalVisible={onShowDatePicker}
          selectedDate={date}
          onDateChange={onDateChange}
        />
      </View>

      <Button onPress={onNext} disabled={!amount || !selectedAccountId}>
        <UIText className="text-primary-foreground">Suivant</UIText>
      </Button>
    </>
  );
};
