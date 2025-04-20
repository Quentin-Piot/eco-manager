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
import { Text as UIText } from "~/components/ui/text"; // Alias to avoid conflict
import { Category, categoryDetailsMap } from "~/lib/types/categories";
import { cn } from "~/lib/utils";
import { colors } from "~/lib/theme";
import { DatePickerModal } from "~/components/ui/date-picker-modal";
import { BottomModal } from "~/components/ui/custom-modal";
import type { AccountDetailsWithId } from "~/lib/context/account-context";

interface AddExpenseModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (expense: ExpenseData) => void;
  accounts: AccountDetailsWithId[]; // <-- Ajout de la prop accounts
}

export type ExpenseData = {
  id: string;
  amount: number;
  remarks: string;
  date: Date;
  paymentMethod: "cash" | "card";
  category: Category;
  accountId: string;
};

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  accounts, // Récupération des comptes via props
}) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );
  const [isAccountSelectorVisible, setIsAccountSelectorVisible] =
    useState(false);

  // Filtrer les comptes de type 'current' pour la sélection
  const availableAccounts = React.useMemo(() => {
    return accounts?.filter((acc) => acc.type === "current") || [];
  }, [accounts]);

  // Pré-sélectionner le premier compte 'current' disponible à l'ouverture du modal
  useEffect(() => {
    if (isVisible && availableAccounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(availableAccounts[0].id);
    }
  }, [availableAccounts, isVisible]);

  // Met à jour la sélection si la liste des comptes change ou si la sélection devient invalide
  useEffect(() => {
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
  }, [availableAccounts, selectedAccountId, isVisible]);

  const handleNextStep = () => {
    if (step === 1 && amount && selectedAccountId) {
      setStep(2);
    } else if (step === 2 && selectedCategory) {
      handleSubmit();
    }
  };

  const handlePreviousStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = () => {
    if (!amount || !selectedCategory || !selectedAccountId) {
      console.warn("Amount, category, and account are required.");
      return;
    }
    const expenseData: ExpenseData = {
      id: `exp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      amount: parseFloat(amount.replace(",", ".")),
      remarks,
      date,
      paymentMethod,
      category: selectedCategory,
      accountId: selectedAccountId,
    };
    onSubmit(expenseData);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setAmount("");
    setRemarks("");
    setDate(new Date());
    setPaymentMethod("cash");
    setSelectedCategory(null);
    setSelectedAccountId(
      availableAccounts.length > 0 ? availableAccounts[0].id : null,
    );
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

  // ... (renderStepOne, renderStepTwo, styles, etc. restent inchangés,
  // juste remplacer useAccount() par la prop accounts)

  // Je te remets uniquement la partie modifiée complète ici pour clarté :

  return (
    <BottomModal visible={isVisible} onRequestClose={onClose}>
      {step === 1 ? (
        <>
          <UIText className="text-lg font-semibold mb-4 text-foreground dark:text-primary-foreground">
            Ajouter une dépense
          </UIText>

          {/* Montant */}
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

          {/* Sélecteur de compte */}
          <View className="mb-4">
            <UIText className="text-sm text-muted-foreground mb-1">
              Compte
            </UIText>
            <TouchableOpacity
              onPress={() => setIsAccountSelectorVisible(true)}
              className="flex-row items-center justify-between bg-input dark:bg-input border border-border dark:border-border rounded-md p-3 h-12"
              disabled={availableAccounts.length === 0}
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

          {/* Remarques */}
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

          {/* Date */}
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

          {/* Méthode de paiement */}
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

          <Button
            onPress={handleNextStep}
            disabled={!amount || !selectedAccountId}
          >
            <UIText className="text-primary-foreground">Suivant</UIText>
          </Button>
        </>
      ) : (
        <>
          <UIText className="text-lg font-semibold mb-1 text-foreground dark:text-primary-foreground">
            Choisir une catégorie
          </UIText>
          <UIText className="text-sm text-muted-foreground mb-4">
            Sélectionnez la catégorie de votre dépense.
          </UIText>
          <ScrollView contentContainerStyle={styles.categoryGrid}>
            {Object.entries(categoryDetailsMap)
              .filter(([_, details]) => details.type === "expense")
              .map(([key, details]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.categoryItem,
                    selectedCategory === key && styles.selectedCategoryItem,
                  ]}
                  onPress={() => setSelectedCategory(key as Category)}
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
                    {details.name}
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
              onPress={handleSubmit}
              disabled={!selectedCategory}
              className="flex-1"
            >
              <UIText className="text-primary-foreground">Ajouter</UIText>
            </Button>
          </View>
        </>
      )}

      {/* Modal de sélection de compte */}
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
  accountItem: {
    // Style pour les items de la liste des comptes
  },
});

export default AddExpenseModal;
