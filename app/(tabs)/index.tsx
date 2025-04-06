import { BankCard } from "@/components/ui/bank-card";
import { SpendingCard } from "@/components/ui/spending-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { View } from "react-native";
import MainLayout from "~/components/layouts/main-layout";
import React, { useState } from "react";

export default function DashboardScreen() {
  const [value, setValue] = useState<string>("current");
  return (
    <MainLayout pageName={"Tableau de bord"}>
      <Tabs className="space-y-4" value={value} onValueChange={setValue}>
        <TabsList className={"flex-row justify-between items-center mb-6"}>
          <TabsTrigger value="current" className={"flex-1"}>
            <Text className={"font-bold"}>Comptes Courants</Text>
          </TabsTrigger>
          <TabsTrigger value="savings" className={"flex-1"}>
            <Text className={"font-bold"}>Comptes Épargne</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="space-y-4">
          <View className="flex-row flex-wrap gap-3 w-full">
            <View className="flex-1 basis-[45%]">
              <BankCard
                title="Total"
                amount="€4,550.25"
                borderColor="border-l-green-500"
              />
            </View>
            <View className="flex-1 basis-[45%]">
              <BankCard
                title="LCL"
                amount="€1,250.75"
                borderColor="border-l-blue-500"
              />
            </View>
            <View className="flex-1 basis-[45%]">
              <BankCard
                title="Compte Joint"
                amount="€2,340.50"
                borderColor="border-l-purple-500"
              />
            </View>
            <View className="flex-1 basis-[45%]">
              <BankCard
                title="Bourso Personal"
                amount="€750.00"
                borderColor="border-l-orange-500"
              />
            </View>
            <View className="flex-1 basis-[45%]">
              <BankCard
                title="Revolut Personal"
                amount="€159.00"
                borderColor="border-l-cyan-500"
              />
            </View>
            <View className="flex-1 basis-[45%]">
              <BankCard
                title="Espèces"
                amount="€50.00"
                borderColor="border-l-yellow-500"
              />
            </View>
          </View>
        </TabsContent>
        <TabsContent value="savings" className="space-y-4">
          <View className="flex-row flex-wrap gap-3 w-full">
            <View className="flex-1 basis-[45%]">
              <BankCard
                title="Total"
                amount="€12,750.80"
                borderColor="border-l-green-500"
              />
            </View>
            <View className="flex-1 basis-[45%]">
              <BankCard
                title="Livret A"
                amount="€8,250.30"
                borderColor="border-l-blue-500"
              />
            </View>
            <View className="flex-1 basis-[45%]">
              <BankCard
                title="Développement Durable"
                amount="€2,500.50"
                borderColor="border-l-teal-500"
              />
            </View>
            <View className="flex-1 basis-[45%]">
              <BankCard
                title="Épargne Générale"
                amount="€2,000.00"
                borderColor="border-l-amber-500"
              />
            </View>
          </View>
        </TabsContent>
      </Tabs>

      <Card className={"py-6"}>
        <CardHeader>
          <CardTitle>Aperçu des Dépenses Mensuelles</CardTitle>
        </CardHeader>
        <CardDescription>Vos dépenses depuis le 1er du mois</CardDescription>
        <CardContent>{/*<DashboardChart />*/}</CardContent>
      </Card>

      <View className="flex-row flex-wrap gap-4">
        <SpendingCard
          title="Logement"
          currentAmount="€850"
          budgetAmount="€900"
          percentage={94}
          color={{
            bg: "bg-rose-500/20",
            text: "text-rose-700",
            progress: "bg-rose-500",
          }}
        />
        <SpendingCard
          title="Transport"
          currentAmount="€120"
          budgetAmount="€200"
          percentage={60}
          color={{
            bg: "bg-blue-500/20",
            text: "text-blue-700",
            progress: "bg-blue-500",
          }}
        />
        <SpendingCard
          title="Shopping"
          currentAmount="€320"
          budgetAmount="€300"
          percentage={107}
          color={{
            bg: "bg-purple-500/20",
            text: "text-purple-700",
            progress: "bg-purple-500",
          }}
        />
        <SpendingCard
          title="Loisirs"
          currentAmount="€180"
          budgetAmount="€250"
          percentage={72}
          color={{
            bg: "bg-amber-500/20",
            text: "text-amber-700",
            progress: "bg-amber-500",
          }}
        />
        <SpendingCard
          title="Épargne"
          currentAmount="€400"
          budgetAmount="€500"
          percentage={80}
          color={{
            bg: "bg-green-500/20",
            text: "text-green-700",
            progress: "bg-green-500",
          }}
        />
      </View>
    </MainLayout>
  );
}
