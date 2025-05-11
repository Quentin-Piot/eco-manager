import React, { useEffect, useState } from "react";
import { BottomModal } from "~/components/ui/custom-modal";
import type {
  AccountDetailsWithId,
  ExpenseData,
} from "~/lib/context/account-context";
import { useAccount } from "~/lib/context/account-context";
import { MainCategory, Subcategory } from "~/lib/types/categories";
import { TransactionForm } from "~/components/ui/transaction/transaction-form";
import { CategorySelector } from "~/components/ui/transaction/category-selector";
import { AccountSelector } from "~/components/ui/transaction/account-selector";
import { useBackground } from "~/lib/context/background";

interface EditExpenseModalProps {
  isVisible: boolean;
  onClose: () => void;
  transaction: ExpenseData;
  accounts: AccountDetailsWithId[];
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isVisible,
  onClose,
  transaction,
  accounts,
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
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );
  const [isAccountSelectorVisible, setIsAccountSelectorVisible] =
    useState(false);
  const { removeBlur } = useBackground();

  // Initialiser les états avec les valeurs de la transaction existante
  useEffect(() => {
    if (isVisible && transaction) {
      setAmount(transaction.amount.toString().replace(".", ","));
      setRemarks(transaction.remarks || "");
      setDate(new Date(transaction.date));
      setSelectedMainCategory(transaction.mainCategory);
      setSelectedSubcategory(transaction.subcategory);
      setSelectedAccountId(transaction.accountId);

      // Déterminer le type de transaction (dépense ou revenu)
      setTransactionType(transaction.type);

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

    const updatedTransaction: ExpenseData = {
      ...transaction,
      remarks: remarks,
      amount: parseFloat(amount.replace(",", ".")),
      date,
      accountId: selectedAccountId,
      mainCategory: selectedMainCategory,
      subcategory: selectedSubcategory,
      type: transactionType,
      paymentMethod: paymentMethod,
    };

    updateTransaction(transaction.id, updatedTransaction);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    removeBlur();
    onClose();
  };

  const onDateChange = (selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const handleDeleteTransaction = () => {
    deleteTransaction(transaction.id);
    resetForm();
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

export default EditExpenseModal;
