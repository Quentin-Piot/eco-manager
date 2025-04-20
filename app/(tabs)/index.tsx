import { BankAccountCard } from "@/components/ui/bank-account-card";
import { SpendingCard } from "@/components/ui/spending-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { View } from "react-native";
import MainLayout from "~/components/layouts/main-layout";
import React, { useMemo, useState } from "react";
import { PieChartTouchLayer, PieSlice } from "~/components/charts/category-pie";
import { colors } from "~/lib/theme";
import { SliceInfoModal } from "~/components/charts/slice-info-modal";
import { Category, categoryDetailsMap } from "~/lib/types/categories"; // Importer Category
import { useAccount } from "~/lib/context/account-context"; // Ajustez le chemin si nécessaire

// Helper function pour formater en devise (simpliste)
const formatCurrency = (value: number) => {
  return `€${value.toFixed(2)}`; // Ajustez selon vos besoins de formatage
};

export default function DashboardScreen() {
  const { accounts, spendingCategories, monthlyChartDataRaw } = useAccount();

  const [selectedSlice, setSelectedSlice] = useState<PieSlice | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const chartData = useMemo(() => {
    // ... (calcul de chartData reste inchangé) ...
    if (!monthlyChartDataRaw) return [];

    const totalValue = monthlyChartDataRaw.reduce(
      (sum, item) => sum + item.value,
      0,
    );

    return monthlyChartDataRaw.map((item) => ({
      label: categoryDetailsMap[item.type]?.name || item.type,
      value: item.value,
      type: item.type,
      color:
        colors.categories[item.type as keyof typeof colors.categories] ||
        colors.primary.DEFAULT,
      percentage:
        totalValue > 0
          ? `${((item.value / totalValue) * 100).toFixed(0)}`
          : "0",
    }));
  }, [monthlyChartDataRaw]);

  // --- Calcul de la carte "Autres Dépenses" ---
  const otherSpendingCardData = useMemo(() => {
    if (!monthlyChartDataRaw || !spendingCategories) {
      return null; // Retourner null si les données ne sont pas prêtes
    }

    // 1. Identifier les types de catégories déjà affichées
    const displayedCategoryTypes = new Set(
      spendingCategories.map((cat) => cat.type),
    );

    // 2. Calculer la somme des "Autres" dépenses
    let otherSpendingTotal = 0;
    monthlyChartDataRaw.forEach((item) => {
      // Vérifier si la catégorie n'est PAS affichée ET si c'est une dépense
      if (
        !displayedCategoryTypes.has(item.type) &&
        categoryDetailsMap[item.type]?.type === "expense"
      ) {
        otherSpendingTotal += item.value;
      }
    });

    // 3. Si aucune autre dépense, ne pas afficher la carte
    if (otherSpendingTotal <= 0) {
      return null;
    }

    // 4. Préparer les données pour la carte
    return {
      // Utiliser 'other_expenses' comme type logique si pertinent, sinon juste pour l'affichage
      type: "other_expenses" as Category,
      title: categoryDetailsMap.other_expenses.name, // "Autres dépenses"
      currentAmount: formatCurrency(otherSpendingTotal),
      budgetAmount: "1000", // Pas de budget défini pour l'agrégat
      percentage: (otherSpendingTotal / 1000) * 100, // Pas de pourcentage calculable sans budget
      color: {
        // Choisir une couleur par défaut ou spécifique pour "Autres"
        bg: "bg-slate-500/20",
        text: "text-slate-700",
        progress: "bg-slate-500",
      },
    };
  }, [monthlyChartDataRaw, spendingCategories]); // Dépend des données brutes et des catégories affichées

  const handleSlicePress = (slice: PieSlice) => {
    setSelectedSlice(slice);
    setIsModalVisible(true);
  };

  return (
    <MainLayout pageName={"Tableau de bord"}>
      {/* Bank Account Cards */}
      <View className="flex-row flex-wrap gap-3 w-full mb-4">
        {/* ... BankAccountCard ... */}
        <View className="flex-1 basis-[45%]">
          <BankAccountCard accounts={accounts} type="current" />
        </View>
        <View className="flex-1 basis-[45%]">
          <BankAccountCard accounts={accounts} type="savings" />
        </View>
      </View>

      {/* Monthly Spending Overview Card */}
      <Card className={"py-6 mb-4"}>
        {/* ... CardHeader, CardContent, Chart ... */}
        <CardHeader>
          <CardTitle>Aperçu des Dépenses Mensuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            data={chartData}
            onSlicePress={handleSlicePress}
            selectedSlice={selectedSlice ?? undefined}
          />
        </CardContent>
      </Card>

      {/* Spending Category Cards */}
      <View className="flex-row flex-wrap gap-3 mb-4">
        {/* Cartes existantes */}
        {spendingCategories.map((category) => (
          <SpendingCard
            key={category.type} // Utiliser category.type comme clé unique
            title={category.title}
            currentAmount={category.currentAmount}
            budgetAmount={category.budgetAmount}
            percentage={category.percentage}
            color={category.color}
          />
        ))}
        {/* Nouvelle carte "Autres Dépenses" si elle existe */}
        {otherSpendingCardData && (
          <SpendingCard
            key="other-spending"
            title={otherSpendingCardData.title}
            currentAmount={otherSpendingCardData.currentAmount}
            budgetAmount={otherSpendingCardData.budgetAmount}
            percentage={otherSpendingCardData.percentage}
            color={otherSpendingCardData.color}
          />
        )}
      </View>

      {/* Modal */}
      <SliceInfoModal
        isVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        slice={selectedSlice}
      />
    </MainLayout>
  );
}

// --- Chart Component Definition (inchangé) ---
type ChartProps = {
  data: PieSlice[];
  onSlicePress: (slice: PieSlice) => void;
  selectedSlice?: PieSlice;
};

const Chart = ({ data, onSlicePress, selectedSlice }: ChartProps) => {
  // ... (contenu du composant Chart inchangé) ...
  return (
    <View
      style={{
        height: 200,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PieChartTouchLayer
        data={data}
        onSlicePress={onSlicePress}
        selectedSlice={selectedSlice}
      />
    </View>
  );
};
