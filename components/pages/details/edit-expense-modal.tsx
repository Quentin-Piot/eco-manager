import React, { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { BottomModal } from "~/components/ui/custom-modal";
import type {
  AccountDetailsWithId,
  ExpenseDataFormatted,
} from "~/lib/context/account-context";
import { useAccount } from "~/lib/context/account-context";
import { MainCategory, Subcategory } from "~/lib/types/categories";
import { TransactionForm } from "~/components/ui/transaction/transaction-form";
import { CategorySelector } from "~/components/ui/transaction/category-selector";
import { AccountSelector } from "~/components/ui/transaction/account-selector";

interface EditExpenseModalProps {
  isVisible: boolean;
  onClose: () => void;
  transaction: ExpenseDataFormatted;
  accounts: AccountDetailsWithId[];
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isVisible,
  onClose,
  transaction,
  accounts,
}) => {
  const { updateTransaction } = useAccount();
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
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );
  const [isAccountSelectorVisible, setIsAccountSelectorVisible] =
    useState(false);

  // Initialiser les états avec les valeurs de la transaction existante
  useEffect(() => {
    if (isVisible && transaction) {
      setAmount(transaction.amountEUR.toString().replace(".", ","));
      setRemarks(transaction.description || "");
      setDate(new Date(transaction.date));
      setSelectedMainCategory(transaction.mainCategory);
      setSelectedSubcategory(transaction.subcategory);
      setSelectedAccountId(transaction.accountId);

      // Déterminer le type de transaction (dépense ou revenu)
      setTransactionType(
        transaction.mainCategory === "income" ? "income" : "expense",
      );

      // Déterminer le mode de paiement en fonction du type de compte
      const account = accounts.find((acc) => acc.id === transaction.accountId);
      setPaymentMethod(account?.type === "cash" ? "cash" : "card");
    }
  }, [isVisible, transaction, accounts]);

  const availableAccounts = React.useMemo(() => {
    return (
      accounts?.filter((acc) =>
        paymentMethod === "card" ? acc.type === "current" : acc.type === "cash",
      ) || []
    );
  }, [accounts, paymentMethod]);

  useEffect(() => {
    if (paymentMethod === "card") {
      if (
        isVisible &&
        availableAccounts.length > 0 &&
        (!selectedAccountId ||
          !availableAccounts.find((acc) => acc.id === selectedAccountId))
      ) {
        setSelectedAccountId(availableAccounts[0].id);
      } else if (isVisible && availableAccounts.length === 0) {
        setSelectedAccountId(null);
      }
    } else {
      const cashAccount = availableAccounts.find((acc) => acc.type === "cash");
      if (cashAccount) {
        setSelectedAccountId(cashAccount.id);
      }
    }
  }, [availableAccounts, selectedAccountId, isVisible, paymentMethod]);

  const handleNextStep = () => {
    if (step === 1 && amount && selectedAccountId) {
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
    if (
      !amount ||
      !selectedMainCategory ||
      !selectedSubcategory ||
      !selectedAccountId
    ) {
      return;
    }

    const updatedTransaction: ExpenseDataFormatted = {
      ...transaction,
      description: remarks,
      amountEUR: parseFloat(amount.replace(",", ".")),
      date,
      accountId: selectedAccountId,
      mainCategory: selectedMainCategory,
      subcategory: selectedSubcategory,
      type: transactionType,
    };

    updateTransaction(transaction.id, updatedTransaction);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    onClose();
  };

  const onDateChange = (selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getSelectedAccountName = () => {
    const account = availableAccounts.find(
      (acc) => acc.id === selectedAccountId,
    );
    return account ? account.title : "Sélectionner un compte";
  };

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
    setIsAccountSelectorVisible(false);
  };

  return (
    <BottomModal visible={isVisible} onRequestClose={onClose}>
      {step === 1 && (
        <TransactionForm
          transactionType={transactionType}
          amount={amount}
          remarks={remarks}
          date={date}
          showDatePicker={showDatePicker}
          paymentMethod={paymentMethod}
          selectedAccountId={selectedAccountId}
          availableAccounts={availableAccounts}
          isAccountSelectorVisible={isAccountSelectorVisible}
          onAmountChange={setAmount}
          onRemarksChange={setRemarks}
          onDateChange={onDateChange}
          onPaymentMethodChange={setPaymentMethod}
          onAccountSelect={handleAccountSelect}
          onShowDatePicker={setShowDatePicker}
          onShowAccountSelector={setIsAccountSelectorVisible}
          onNext={handleNextStep}
          isEdit
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

      <AccountSelector
        isVisible={isAccountSelectorVisible}
        onClose={() => setIsAccountSelectorVisible(false)}
        accounts={availableAccounts}
        selectedAccountId={selectedAccountId}
        onSelect={handleAccountSelect}
      />
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: Platform.OS === "android" ? 20 : 40,
  },
});

export default EditExpenseModal;
