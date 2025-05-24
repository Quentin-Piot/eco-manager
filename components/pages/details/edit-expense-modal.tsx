import React, { useEffect, useState } from "react";
import { BottomModal, FullScreenModal } from "~/components/ui/custom-modal";
import type { ExpenseData } from "~/lib/context/account-context";
import { RecurrenceType, useAccount } from "~/lib/context/account-context";
import { MainCategory, Subcategory } from "~/lib/types/categories";
import { TransactionForm } from "~/components/ui/transaction/transaction-form";
import { CategorySelector } from "~/components/ui/transaction/category-selector";
import { calculateNextRecurrenceDate } from "~/lib/utils/date";
import { Button } from "~/components/ui/button";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface EditExpenseModalProps {
  isVisible: boolean;
  onClose: () => void;
  transaction: ExpenseData;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isVisible,
  onClose,
  transaction,
}) => {
  const { updateTransaction, deleteTransaction } = useAccount();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("card");
  const [transactionType, setTransactionType] = useState<"expense" | "income">(
    "expense",
  );
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<MainCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);

  const [recurrence, setRecurrence] = useState<RecurrenceType>("none");
  const [isRecurrenceSelectorVisible, setIsRecurrenceSelectorVisible] =
    useState(false);

  // Initialiser les états avec les valeurs de la transaction existante
  useEffect(() => {
    if (isVisible && transaction) {
      setAmount(transaction.amount.toString().replace(".", ","));
      setRemarks(transaction.remarks || "");
      setDate(new Date(transaction.date));
      setSelectedMainCategory(transaction.mainCategory);
      setSelectedSubcategory(transaction.subcategory);
      setTransactionType(transaction.type);
      setRecurrence(transaction.recurrence);
      setPaymentMethod(transaction.paymentMethod as "cash" | "card");
    }
  }, [isVisible, transaction]);

  const handleNextStep = () => {
    if (step === 1 && amount) {
      setStep(2);
    } else if (step === 2 && selectedMainCategory) {
      setStep(3);
    } else if (step === 3 && selectedSubcategory) {
      handleSubmit();
    }
  };

  const handlePreviousStep = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    if (!amount || !selectedMainCategory || !selectedSubcategory) {
      return;
    }

    const updatedTransaction: ExpenseData = {
      ...transaction,
      remarks: remarks,
      amount: parseFloat(amount.replace(",", ".")),
      date,
      mainCategory: selectedMainCategory,
      subcategory: selectedSubcategory,
      type: transactionType,
      paymentMethod: paymentMethod,
      recurrence: recurrence,
      nextRecurrenceDate:
        recurrence !== "none"
          ? calculateNextRecurrenceDate(date, recurrence)
          : undefined,
    };

    updateTransaction(transaction.id, updatedTransaction);
    resetForm();
  };

  const resetForm = () => {
    onClose();
    setStep(1);
    setAmount("");
    setRemarks("");
    setDate(new Date());
    setPaymentMethod("card");
    setSelectedMainCategory(null);
    setSelectedSubcategory(null);
    setRecurrence("none");
    setIsRecurrenceSelectorVisible(false);
    setShowDeleteOptions(false);
  };

  const onDateChange = (selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const [showDeleteOptions, setShowDeleteOptions] = useState(false);

  const handleDeleteTransaction = () => {
    // If this is a recurring transaction, ask if they want to delete all recurrences
    if (transaction.recurrence !== "none" || transaction.recurrenceGroup) {
      setShowDeleteOptions(true);
    } else {
      // For non-recurring transactions, just delete it directly
      deleteTransaction(transaction.id);
      resetForm();
    }
  };

  const handleDeleteSingle = () => {
    deleteTransaction(transaction.id, false);
    resetForm();
  };

  const handleDeleteAll = () => {
    deleteTransaction(transaction.id, true);
    resetForm();
  };

  return (
    <>
      <BottomModal visible={isVisible} onRequestClose={onClose}>
        {step === 1 && (
          <TransactionForm
            transactionType={transactionType}
            amount={amount}
            remarks={remarks}
            date={date}
            showDatePicker={showDatePicker}
            paymentMethod={paymentMethod}
            onAmountChange={setAmount}
            onRemarksChange={setRemarks}
            onDateChange={onDateChange}
            onPaymentMethodChange={setPaymentMethod}
            onShowDatePicker={setShowDatePicker}
            onNext={handleNextStep}
            recurrence={recurrence}
            onRecurrenceChange={setRecurrence}
            isRecurrenceSelectorVisible={isRecurrenceSelectorVisible}
            onShowRecurrenceSelector={setIsRecurrenceSelectorVisible}
            isEdit
            onDelete={handleDeleteTransaction}
          />
        )}

        {step === 2 && (
          <CategorySelector
            type="main"
            transactionType={transactionType}
            selectedMainCategory={selectedMainCategory}
            selectedSubcategory={selectedSubcategory}
            onSelectMainCategory={setSelectedMainCategory}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            isEdit
          />
        )}

        {step === 3 && (
          <CategorySelector
            type="sub"
            transactionType={transactionType}
            selectedMainCategory={selectedMainCategory}
            selectedSubcategory={selectedSubcategory}
            onSelectSubcategory={setSelectedSubcategory}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            isEdit
          />
        )}

        <FullScreenModal
          visible={showDeleteOptions}
          onRequestClose={() => setShowDeleteOptions(false)}
        >
          <Text className="text-lg font-semibold mb-4 text-foreground dark:text-primary-foreground">
            Supprimer la transaction
          </Text>
          <Text className="text-sm text-muted-foreground mb-6">
            Cette transaction fait partie d'une série récurrente. Que
            souhaitez-vous supprimer ?
          </Text>

          <View className="gap-4">
            <Button onPress={handleDeleteSingle} className="mb-3">
              <Text className="text-primary-foreground">
                Supprimer uniquement cette transaction
              </Text>
            </Button>

            <Button onPress={handleDeleteAll} className="bg-red-600">
              <Text className="text-primary-foreground">
                Supprimer toutes les transactions récurrentes
              </Text>
            </Button>

            <Button
              variant="outline"
              onPress={() => setShowDeleteOptions(false)}
              className="mt-3"
            >
              <Text>Annuler</Text>
            </Button>
          </View>
        </FullScreenModal>
      </BottomModal>
      {/* Modal for recurring transaction delete options */}
    </>
  );
};

export default EditExpenseModal;
