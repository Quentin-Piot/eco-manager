import React from "react";
import { TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { colors } from "~/lib/theme";
import { DatePickerModal } from "~/components/ui/date-picker-modal";
import { RecurrenceType } from "~/lib/context/account-context";
import { RecurrenceSelector } from "~/components/ui/transaction/recurrence-selector";

interface TransactionFormProps {
  transactionType: "expense" | "income";
  amount: string;
  remarks: string;
  date: Date;
  showDatePicker: boolean;
  paymentMethod: "cash" | "card";
  recurrence: RecurrenceType;
  isRecurrenceSelectorVisible: boolean;
  onShowRecurrenceSelector: (show: boolean) => void;
  onAmountChange: (value: string) => void;
  onRemarksChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onPaymentMethodChange: (method: "cash" | "card") => void;
  onShowDatePicker: (show: boolean) => void;
  onRecurrenceChange: (recurrence: RecurrenceType) => void;
  onNext: () => void;
  isEdit?: boolean;
  onDelete?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transactionType,
  amount,
  remarks,
  date,
  showDatePicker,
  paymentMethod,
  recurrence = "none",
  onAmountChange,
  onRemarksChange,
  onDateChange,
  onPaymentMethodChange,
  onShowDatePicker,
  onRecurrenceChange,
  onNext,
  onDelete,
  isEdit = false,
  isRecurrenceSelectorVisible,
  onShowRecurrenceSelector,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <Text className="text-lg font-semibold mb-4 text-foreground dark:text-primary-foreground">
        {isEdit ? "Modifier" : "Ajouter"}{" "}
        {transactionType === "expense" ? "une dépense" : "un revenu"}
      </Text>

      <View className="mb-4">
        <Text className="text-sm text-muted-foreground mb-1">Montant</Text>
        <Input
          placeholder="0,00"
          keyboardType="numeric"
          value={amount}
          onChangeText={onAmountChange}
          className="text-2xl h-12"
        />
      </View>
      <View className="mb-4">
        <Text className="text-sm text-muted-foreground mb-1">
          Intitulé (optionnel)
        </Text>
        <Input
          placeholder={
            transactionType === "expense"
              ? "Achat de ..."
              : "Salaire mensuel ..."
          }
          value={remarks}
          onChangeText={onRemarksChange}
          className="h-12"
        />
      </View>
      <View className="mb-6">
        <Text className="text-sm text-muted-foreground mb-2">
          {transactionType === "expense" ? "Payé avec" : "Compte concerné"}
        </Text>
        <View className="flex-row gap-2">
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
            <Text
              className={cn(
                paymentMethod === "card"
                  ? "text-primary-foreground"
                  : "text-foreground dark:text-primary-foreground",
              )}
            >
              Carte
            </Text>
          </Button>
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
            <Text
              className={cn(
                paymentMethod === "cash"
                  ? "text-primary-foreground"
                  : "text-foreground dark:text-primary-foreground",
              )}
            >
              Espèces
            </Text>
          </Button>
        </View>
      </View>
      <View className="mb-4">
        <Text className="text-sm text-muted-foreground mb-1">Date</Text>
        <TouchableOpacity
          onPress={() => onShowDatePicker(true)}
          className="flex-row bg-gray-50 items-center  dark:bg-input  rounded-md p-3 h-12 border border-input"
        >
          <MaterialIcons
            name="calendar-today"
            size={20}
            color={colors.muted.foreground}
            className="mr-2"
          />
          <Text className="text-lg dark:text-primary-foreground">
            {formatDate(date)}
          </Text>
        </TouchableOpacity>
        <DatePickerModal
          isVisible={showDatePicker}
          setIsModalVisible={onShowDatePicker}
          selectedDate={date}
          onDateChange={onDateChange}
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm text-muted-foreground mb-1">Récurrence</Text>
        <TouchableOpacity
          onPress={() => onShowRecurrenceSelector(true)}
          className="flex-row items-center justify-between bg-gray-50 dark:bg-input rounded-md p-3 h-12 border border-input"
        >
          <Text className="dark:text-primary-foreground">
            {recurrence === "none"
              ? "Aucune"
              : recurrence === "daily"
                ? "Journalière"
                : recurrence === "weekly"
                  ? "Hebdomadaire"
                  : recurrence === "monthly"
                    ? "Mensuelle"
                    : "Annuelle"}
          </Text>
          <MaterialIcons
            name="arrow-drop-down"
            size={24}
            color={colors.muted.foreground}
          />
        </TouchableOpacity>
        <RecurrenceSelector
          isVisible={isRecurrenceSelectorVisible}
          onClose={() => onShowRecurrenceSelector(false)}
          selectedRecurrence={recurrence}
          onSelect={(value) => {
            onRecurrenceChange(value);
            onShowRecurrenceSelector(false);
          }}
        />
      </View>

      <View className={"w-full flex-row gap-3"}>
        {isEdit && onDelete && (
          <Button onPress={onDelete} className={"bg-red-600 flex-1"}>
            <Text className="text-primary-foreground">Supprimer</Text>
          </Button>
        )}

        <Button onPress={onNext} disabled={!amount} className={"flex-1"}>
          <Text className="text-primary-foreground">Suivant</Text>
        </Button>
      </View>
    </>
  );
};
