import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { calculateNextRecurrenceDate } from "~/lib/utils/date";
import { BottomModal } from "~/components/ui/custom-modal";
import { RecurrenceType, useAccount } from "~/lib/context/account-context";
import { MainCategory, Subcategory } from "~/lib/types/categories";
import { TransactionForm } from "~/components/ui/transaction/transaction-form";
import { CategorySelector } from "~/components/ui/transaction/category-selector";
import { Text } from "~/components/ui/text";
import { cn, parseAmount } from "~/lib/utils";
import { colors } from "~/lib/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "~/components/ui/button";

interface AddExpenseModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isVisible,
  onClose,
}) => {
  const { addTransaction } = useAccount();
  const [step, setStep] = useState(0);
  const [transactionType, setTransactionType] = useState<"expense" | "income">(
    "expense",
  );
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("card");
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<MainCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);

  const [recurrence, setRecurrence] = useState<RecurrenceType>("none");
  const [isRecurrenceSelectorVisible, setIsRecurrenceSelectorVisible] =
    useState(false);

  const handleNextStep = () => {
    if (step === 0) {
      setStep(1);
      if (transactionType === "income") {
        setSelectedMainCategory("income");
      }
    } else if (step === 1 && amount) {
      if (transactionType === "income" && selectedMainCategory) {
        setStep(3);
        setSelectedSubcategory("salary");
      } else {
        setStep(2);
      }
    } else if (step === 2 && selectedMainCategory) {
      setStep(3);
    } else if (step === 3 && selectedSubcategory) {
      handleSubmit();
    }
  };

  const handlePreviousStep = () => {
    if (step === 1) {
      setStep(0);
    } else if (step === 2) {
      setStep(1);
      if (transactionType === "expense") {
        setSelectedMainCategory(null);
      }
    } else if (step === 3) {
      if (transactionType === "expense") {
        setStep(2);
        setSelectedSubcategory(null);
      } else {
        setStep(1);
      }
    }
  };

  const handleSubmit = () => {
    if (!amount || !selectedMainCategory || !selectedSubcategory) {
      return;
    }

    const nextRecurrenceDate = calculateNextRecurrenceDate(date, recurrence);

    const transactionData = {
      amount: parseAmount(amount),
      remarks: remarks,
      date,
      paymentMethod: paymentMethod,

      mainCategory: selectedMainCategory,
      subcategory: selectedSubcategory,
      type: transactionType,
      recurrence,
      nextRecurrenceDate,
    };
    addTransaction(transactionData);
  };

  const resetForm = () => {
    onClose();
    setStep(0);
    setTransactionType("expense");
    setAmount("");
    setRemarks("");
    setDate(new Date());
    setPaymentMethod("cash");
    setSelectedMainCategory(null);
    setSelectedSubcategory(null);
    setRecurrence("none");
    setIsRecurrenceSelectorVisible(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const onDateChange = (selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const renderTransactionTypeSelector = () => (
    <>
      <Text className="text-lg font-semibold mb-4 text-foreground dark:text-primary-foreground">
        Type de transaction
      </Text>
      <Text className="text-sm text-muted-foreground mb-4">
        Sélectionnez le type de transaction que vous souhaitez ajouter.
      </Text>
      <View className="flex-row gap-4 mb-6">
        <TouchableOpacity
          onPress={() => setTransactionType("expense")}
          className={cn(
            "flex-1 p-4 rounded-lg border items-center",
            transactionType === "expense"
              ? "border-primary bg-primary/10"
              : "border-border",
          )}
        >
          <View
            className="w-12 h-12 rounded-full justify-center items-center mb-2"
            style={{ backgroundColor: colors.secondary.DEFAULT }}
          >
            <MaterialIcons
              name="arrow-upward"
              size={24}
              color={colors.primary.foreground}
            />
          </View>
          <Text className="text-center font-medium text-foreground dark:text-primary-foreground">
            Dépense
          </Text>
          <Text className="text-xs text-center text-muted-foreground mt-1">
            Argent sortant
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTransactionType("income")}
          className={cn(
            "flex-1 p-4 rounded-lg border items-center",
            transactionType === "income"
              ? "border-primary bg-primary/10"
              : "border-border",
          )}
        >
          <View
            className="w-12 h-12 rounded-full justify-center items-center mb-2"
            style={{ backgroundColor: colors.secondary.DEFAULT }}
          >
            <MaterialIcons
              name="arrow-downward"
              size={24}
              color={colors.primary.foreground}
            />
          </View>
          <Text className="text-center font-medium text-foreground dark:text-primary-foreground">
            Revenu
          </Text>
          <Text className="text-xs text-center text-muted-foreground mt-1">
            Argent entrant
          </Text>
        </TouchableOpacity>
      </View>

      <Button onPress={handleNextStep}>
        <Text className="text-primary-foreground">Suivant</Text>
      </Button>
    </>
  );

  return (
    <BottomModal visible={isVisible} onRequestClose={handleClose}>
      {step === 0 && renderTransactionTypeSelector()}
      {step === 1 && (
        <TransactionForm
          transactionType={transactionType}
          amount={amount}
          remarks={remarks}
          date={date}
          showDatePicker={showDatePicker}
          paymentMethod={paymentMethod}
          recurrence={recurrence}
          isRecurrenceSelectorVisible={isRecurrenceSelectorVisible}
          onShowRecurrenceSelector={setIsRecurrenceSelectorVisible}
          onRecurrenceChange={setRecurrence}
          onAmountChange={setAmount}
          onRemarksChange={setRemarks}
          onDateChange={onDateChange}
          onPaymentMethodChange={setPaymentMethod}
          onShowDatePicker={setShowDatePicker}
          onNext={handleNextStep}
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
        />
      )}
    </BottomModal>
  );
};
export default AddExpenseModal;
