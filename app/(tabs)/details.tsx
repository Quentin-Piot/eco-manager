import MainLayout from "~/components/layouts/main-layout";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Category, categoryDetailsMap } from "~/lib/types/categories";
import { Card } from "~/components/ui/card";
import React, { useMemo, useState } from "react";
import AddExpenseModal, { ExpenseData } from "~/components/ui/AddExpenseModal";
import { colors } from "~/lib/theme";
// Importez AccountDetailsWithId au lieu de BankAccount
import type { AccountDetailsWithId } from "~/lib/context/account-context";
import { useAccount } from "~/lib/context/account-context"; // Import useAccount

// Assuming first account ID from context or a mock one for initial data
const MOCK_ACCOUNT_ID = "mock-account-id-1"; // Placeholder

type TransactionsState = {
  [dateGroup: string]: ExpenseDataFormatted[];
};

// Add accountId to the formatted data structure
type ExpenseDataFormatted = {
  id: string;
  category: Category;
  description: string; // Keep description for remarks? Or remove if only account matters? Let's keep for now.
  amountEUR: number;
  amountOriginal?: string;
  date: Date;
  accountId: string; // Added accountId
};

// Helper functions (isToday, isYesterday, formatDateKey) remain the same...
const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

const isYesterday = (someDate: Date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    someDate.getDate() === yesterday.getDate() &&
    someDate.getMonth() === yesterday.getMonth() &&
    someDate.getFullYear() === yesterday.getFullYear()
  );
};

const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// --- Update Initial Mock Transactions with accountId ---
const initialMockTransactions: TransactionsState = {
  today: [
    {
      id: "1",
      category: "coffee",
      description: "Starbucks", // Keep remarks/description separate
      amountEUR: 4.19,
      amountOriginal: "21,00 MYR",
      date: new Date(),
      accountId: MOCK_ACCOUNT_ID, // Add account ID
    },
    {
      id: "2",
      category: "activities",
      description: "Cinema",
      amountEUR: 9.98,
      amountOriginal: "50,00 MYR",
      date: new Date(),
      accountId: MOCK_ACCOUNT_ID, // Add account ID
    },
    // ... add accountId to all other mock transactions ...
    {
      id: "3",
      category: "restaurants",
      description: "Dinner",
      amountEUR: 5.19,
      amountOriginal: "26,00 MYR",
      date: new Date(),
      accountId: MOCK_ACCOUNT_ID, // Add account ID
    },
    {
      id: "4",
      category: "coffee",
      description: "Local Cafe",
      amountEUR: 1.6,
      amountOriginal: "8,00 MYR",
      date: new Date(),
      accountId: MOCK_ACCOUNT_ID, // Add account ID
    },
    {
      id: "5",
      category: "laundry",
      description: "", // Empty remark
      amountEUR: 3.19,
      amountOriginal: "16,00 MYR",
      date: new Date(),
      accountId: MOCK_ACCOUNT_ID, // Add account ID
    },
    {
      id: "6",
      category: "accommodation",
      description: "Hotel Night",
      amountEUR: 15.5,
      date: new Date(),
      accountId: MOCK_ACCOUNT_ID, // Add account ID
    },
    {
      id: "7",
      category: "fees_charges",
      description: "Bank Fee",
      amountEUR: 3.7,
      date: new Date(),
      accountId: MOCK_ACCOUNT_ID, // Add account ID
    },
  ],
  yesterday: [
    {
      id: "8",
      category: "restaurants",
      description: "Lunch",
      amountEUR: 6.18,
      amountOriginal: "31,00 MYR",
      date: new Date(Date.now() - 86400000),
      accountId: MOCK_ACCOUNT_ID, // Add account ID
    },
    {
      id: "9",
      category: "coffee",
      description: "Morning Coffee",
      amountEUR: 7.4,
      amountOriginal: "37,00 MYR",
      date: new Date(Date.now() - 86400000),
      accountId: MOCK_ACCOUNT_ID, // Add account ID
    },
  ],
};

// --- Modify TransactionItem to display Account Name ---
// Utilisez AccountDetailsWithId ici
const TransactionItem = ({
  item,
  account, // Receive the specific account object
}: {
  item: ExpenseDataFormatted;
  account?: AccountDetailsWithId; // Utilisez AccountDetailsWithId
}) => {
  const details = categoryDetailsMap[item.category];
  const iconName = details?.iconName || "help-outline";
  const categoryName = details?.name || item.category;

  const categoryColor =
    colors.categories[item.category as keyof typeof colors.categories] ||
    colors.muted.darker;
  const iconColor = colors.primary.foreground;

  // Utilisez .title pour le nom du compte
  const accountName = account ? account.title : "Compte inconnu"; // Utilisez account.title

  return (
    <View className="flex-row items-center border-b-[1px] border-muted/50 py-3">
      {/* Icon */}
      <View
        style={[
          { backgroundColor: categoryColor },
          {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          },
        ]}
      >
        <MaterialIcons name={iconName} size={24} color={iconColor} />
      </View>
      {/* Details */}
      <View className="flex-1 mr-2">
        <Text
          className="text-base font-medium text-foreground"
          numberOfLines={1}
        >
          {categoryName}
        </Text>
        {/* Display Account Name instead of description */}
        <Text
          className="text-xs text-muted-foreground mt-0.5"
          numberOfLines={1}
        >
          {accountName} {item.description ? `(${item.description})` : ""}
        </Text>
      </View>
      {/* Amount */}
      <View className="items-end">
        <Text className="text-base font-semibold text-foreground">
          € {item.amountEUR.toFixed(2).replace(".", ",")}
        </Text>
        {/* Optionally display original amount if needed */}
        {item.amountOriginal && (
          <Text className="text-xs text-muted-foreground mt-0.5">
            {item.amountOriginal}
          </Text>
        )}
      </View>
    </View>
  );
};

export default function DetailsScreen() {
  const { accounts } = useAccount(); // Get accounts from context
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Initialize state with mock data including accountId
  const [transactions, setTransactions] = useState<TransactionsState>(
    // Ensure mock data has accountId fields added as shown above
    initialMockTransactions,
  );

  // --- Map account IDs to account objects for quick lookup ---
  const accountsMap = useMemo(() => {
    // Utilisez AccountDetailsWithId ici
    const map = new Map<string, AccountDetailsWithId>();
    accounts?.forEach((acc) => map.set(acc.id, acc));
    // Add a mock account entry if using mock ID and accounts aren't loaded yet
    if (!map.has(MOCK_ACCOUNT_ID) && accounts === undefined) {
      // Assurez-vous que la structure correspond à AccountDetailsWithId
      map.set(MOCK_ACCOUNT_ID, {
        id: MOCK_ACCOUNT_ID,
        title: "Compte Principal (Mock)", // Utilisez title
        type: "current",
        amount: 0, // amount est requis par AccountDetails
        borderColor: { borderLeftColor: colors.primary.DEFAULT }, // borderColor est requis par AccountDetails
      });
    }
    return map;
  }, [accounts]);

  // Calculation logic for totals remains the same
  const { todayTotal, currentMonthTotal, groupedTransactions } = useMemo(() => {
    // ... calculation logic unchanged ...
    let todaySum = 0;
    let monthSum = 0;
    const allTransactions: ExpenseDataFormatted[] = [];

    Object.values(transactions).forEach((group) => {
      group.forEach((t) => {
        allTransactions.push(t);
        const transactionDate = new Date(t.date);
        if (isToday(transactionDate)) {
          todaySum += t.amountEUR;
        }
        if (
          transactionDate.getMonth() === new Date().getMonth() &&
          transactionDate.getFullYear() === new Date().getFullYear()
        ) {
          monthSum += t.amountEUR;
        }
      });
    });

    // Grouping logic also remains the same, sorts by date
    const grouped: TransactionsState = {};
    allTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    allTransactions.forEach((t) => {
      const transactionDate = new Date(t.date);
      let groupKey: string;
      if (isToday(transactionDate)) {
        groupKey = "today";
      } else if (isYesterday(transactionDate)) {
        groupKey = "yesterday";
      } else {
        groupKey = formatDateKey(transactionDate);
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(t);
    });

    return {
      todayTotal: todaySum,
      currentMonthTotal: monthSum,
      groupedTransactions: grouped,
    };
  }, [transactions]);

  // --- Update handleAddExpense to include accountId ---
  const handleAddExpense = (newExpense: ExpenseData) => {
    console.log("New Expense Added:", newExpense);

    const formattedExpense: ExpenseDataFormatted = {
      id: newExpense.id,
      category: newExpense.category,
      description: newExpense.remarks, // Use remarks directly for description
      amountEUR: newExpense.amount,
      date: newExpense.date,
      accountId: newExpense.accountId, // Pass accountId here
    };

    const transactionDate = new Date(formattedExpense.date);
    let groupKey: string;
    if (isToday(transactionDate)) {
      groupKey = "today";
    } else if (isYesterday(transactionDate)) {
      groupKey = "yesterday";
    } else {
      groupKey = formatDateKey(transactionDate);
    }

    setTransactions((prevTransactions) => {
      const updatedTransactions = { ...prevTransactions };

      if (!updatedTransactions[groupKey]) {
        updatedTransactions[groupKey] = [];
      }
      // Prepend the new
      // ... (le reste de la fonction reste inchangé)
      updatedTransactions[groupKey].unshift(formattedExpense); // Ajoute au début
      return updatedTransactions;
    });

    setIsModalVisible(false); // Close modal after adding
  };

  // --- Rendu du composant ---
  return (
    <MainLayout
      pageName={"Dépenses Détaillées"}
      fab={
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          className="bg-primary p-3 rounded-full shadow-md absolute justify-center items-center right-6 width-50 height-50 z-10"
          style={
            Platform.OS === "ios"
              ? {
                  bottom: 120,
                }
              : { bottom: 45 }
          }
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      }
    >
      <ScrollView>
        {/* Header with totals and Add button */}
        <Card className={"mb-4 bg-card/80 border-border/50"}>
          <View className="p-4 flex-row justify-between items-center">
            <View>
              <Text className="text-sm text-muted-foreground">
                Dépenses du mois
              </Text>
              <Text className="text-2xl font-bold text-foreground">
                € {currentMonthTotal.toFixed(2).replace(".", ",")}
              </Text>
              <Text className="text-xs text-muted-foreground mt-1">
                Aujourd'hui: € {todayTotal.toFixed(2).replace(".", ",")}
              </Text>
            </View>
          </View>
        </Card>

        {/* Transaction List */}
        {Object.entries(groupedTransactions).map(([dateGroup, items]) => (
          <View key={dateGroup} className="mb-4">
            <Text className="text-lg font-semibold text-foreground mb-2 px-1">
              {
                dateGroup === "today"
                  ? "Aujourd'hui"
                  : dateGroup === "yesterday"
                    ? "Hier"
                    : dateGroup /* Format this date later if needed */
              }
            </Text>
            <Card className="p-4">
              {items.map((item) => (
                // Récupérer le compte correspondant à l'aide de accountsMap
                <TransactionItem
                  key={item.id}
                  item={item}
                  account={accountsMap.get(item.accountId)} // Passer le compte trouvé
                />
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddExpense}
        // Passez les comptes disponibles au modal
        accounts={accounts || []} // Fournir un tableau vide si accounts est undefined
      />
    </MainLayout>
  );
}
