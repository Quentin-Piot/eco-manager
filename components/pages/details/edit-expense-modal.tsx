import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text as UIText } from "~/components/ui/text";
import {
  MainCategory,
  mainCategoryDetailsMap,
  Subcategory,
  subcategoryDetailsMap,
} from "~/lib/types/categories";
import { cn } from "~/lib/utils";
import { colors } from "~/lib/theme";
import { DatePickerModal } from "~/components/ui/date-picker-modal";
import { BottomModal } from "~/components/ui/custom-modal";
import type {
  AccountDetailsWithId,
  ExpenseDataFormatted,
} from "~/lib/context/account-context";
import { useAccount } from "~/lib/context/account-context";

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

  const renderMainCategorySelector = () => (
    <>
      <UIText className="text-lg font-semibold mb-1 text-foreground dark:text-primary-foreground">
        Modifier la catégorie principale
      </UIText>
      <UIText className="text-sm text-muted-foreground mb-4">
        Sélectionnez la catégorie principale de votre dépense.
      </UIText>
      <ScrollView contentContainerStyle={styles.categoryGrid}>
        {Object.entries(mainCategoryDetailsMap)
          .filter(([_, details]) => details.type === "expense")
          .map(([key, details]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.categoryItem,
                selectedMainCategory === key && styles.selectedCategoryItem,
              ]}
              onPress={() => setSelectedMainCategory(key as MainCategory)}
            >
              <View
                style={[
                  styles.categoryIconContainer,
                  {
                    backgroundColor:
                      colors.categories[
                        key as keyof typeof colors.categories
                      ] || colors.muted.DEFAULT,
                  },
                ]}
              >
                <MaterialIcons
                  name={details.iconName}
                  size={24}
                  color={colors.primary.foreground}
                />
              </View>
              <UIText className="text-center text-xs mt-1 text-foreground dark:text-primary-foreground">
                {details.label}
              </UIText>
            </TouchableOpacity>
          ))}
      </ScrollView>
      <View className="flex-row gap-2 mt-4">
        <Button
          variant="outline"
          onPress={handlePreviousStep}
          className="flex-1"
        >
          <UIText className="text-foreground dark:text-primary-foreground">
            Précédent
          </UIText>
        </Button>
        <Button
          onPress={handleNextStep}
          disabled={!selectedMainCategory}
          className="flex-1"
        >
          <UIText className="text-primary-foreground">Suivant</UIText>
        </Button>
      </View>
    </>
  );

  const renderSubcategorySelector = () => {
    if (!selectedMainCategory) {
      return null;
    }
    const subcategories = Object.entries(subcategoryDetailsMap).filter(
      ([key, details]) => details.mainCategory === selectedMainCategory,
    );

    return (
      <>
        <UIText className="text-lg font-semibold mb-1 text-foreground dark:text-primary-foreground">
          Modifier la sous-catégorie
        </UIText>
        <UIText className="text-sm text-muted-foreground mb-4">
          Sélectionnez la sous-catégorie de votre dépense.
        </UIText>
        <ScrollView contentContainerStyle={styles.categoryGrid}>
          {subcategories.map(([key, details]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.categoryItem,
                selectedSubcategory === details.name &&
                  styles.selectedCategoryItem,
              ]}
              onPress={() =>
                setSelectedSubcategory(details.name as Subcategory)
              }
            >
              <View
                style={[
                  styles.categoryIconContainer,
                  {
                    backgroundColor:
                      colors.categories[selectedMainCategory as MainCategory] ||
                      colors.muted.DEFAULT,
                  },
                ]}
              >
                <MaterialIcons
                  name={details.iconName}
                  size={24}
                  color={colors.primary.foreground}
                />
              </View>
              <UIText className="text-center text-xs mt-1 text-foreground dark:text-primary-foreground">
                {details.label}
              </UIText>
            </TouchableOpacity>
          ))}
          {subcategories.length === 0 && (
            <UIText className="text-center text-muted-foreground p-4">
              Aucune sous-catégorie disponible pour{" "}
              {mainCategoryDetailsMap[selectedMainCategory]?.label}.
            </UIText>
          )}
        </ScrollView>
        <View className="flex-row gap-2 mt-4">
          <Button
            variant="outline"
            onPress={handlePreviousStep}
            className="flex-1"
          >
            <UIText className="text-foreground dark:text-primary-foreground">
              Précédent
            </UIText>
          </Button>
          <Button
            onPress={handleNextStep}
            disabled={!selectedSubcategory}
            className="flex-1"
          >
            <UIText className="text-primary-foreground">Mettre à jour</UIText>
          </Button>
        </View>
      </>
    );
  };

  return (
    <BottomModal visible={isVisible} onRequestClose={onClose}>
      {step === 1 && (
        <>
          <UIText className="text-lg font-semibold mb-4 text-foreground dark:text-primary-foreground">
            Modifier la dépense
          </UIText>

          <View className="mb-4">
            <UIText className="text-sm text-muted-foreground mb-1">
              Montant
            </UIText>
            <Input
              placeholder="0,00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
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
                onPress={() => setPaymentMethod("cash")}
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
                onPress={() => setPaymentMethod("card")}
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
          {
            <View className="mb-4">
              <UIText className="text-sm text-muted-foreground mb-1">
                Compte
              </UIText>
              <TouchableOpacity
                onPress={() => setIsAccountSelectorVisible(true)}
                className="flex-row items-center justify-between bg-input dark:bg-input border disabled:bg-gray-300 border-border dark:border-border rounded-md p-3 h-12"
                disabled={
                  availableAccounts.length === 0 || paymentMethod === "cash"
                }
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
          }

          <View className="mb-4">
            <UIText className="text-sm text-muted-foreground mb-1">
              Remarques (optionnel)
            </UIText>
            <Input
              placeholder="Description..."
              value={remarks}
              onChangeText={setRemarks}
              className="h-12"
            />
          </View>

          <View className="mb-4">
            <UIText className="text-sm text-muted-foreground mb-1">Date</UIText>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
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
              setIsModalVisible={setShowDatePicker}
              selectedDate={date}
              onDateChange={onDateChange}
            />
          </View>

          <Button
            onPress={handleNextStep}
            disabled={!amount || !selectedAccountId}
          >
            <UIText className="text-primary-foreground">Suivant</UIText>
          </Button>
        </>
      )}

      {step === 2 && renderMainCategorySelector()}
      {step === 3 && renderSubcategorySelector()}

      <BottomModal
        visible={isAccountSelectorVisible}
        onRequestClose={() => setIsAccountSelectorVisible(false)}
      >
        <UIText className="text-lg font-semibold mb-4 text-foreground dark:text-primary-foreground">
          Sélectionner un compte
        </UIText>
        <FlatList
          data={availableAccounts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleAccountSelect(item.id)}
              style={styles.accountItem}
              className="flex-row items-center justify-between p-3 border-b border-border dark:border-border"
            >
              <UIText className="text-base text-foreground dark:text-primary-foreground">
                {item.title}
              </UIText>
              {selectedAccountId === item.id && (
                <MaterialIcons
                  name="check-circle"
                  size={20}
                  color={colors.primary.DEFAULT}
                />
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <UIText className="text-center text-muted-foreground p-4">
              Aucun compte courant disponible.
            </UIText>
          }
        />
      </BottomModal>
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: Platform.OS === "android" ? 20 : 40,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingBottom: 10,
  },
  categoryItem: {
    width: "28%",
    alignItems: "center",
    marginBottom: 15,
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCategoryItem: {
    borderColor: colors.primary.DEFAULT,
    backgroundColor: colors.primary.DEFAULT + "1A",
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  accountItem: {},
});

export default EditExpenseModal;
