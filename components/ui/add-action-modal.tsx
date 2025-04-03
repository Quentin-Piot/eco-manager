import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { randomUUID } from "expo-crypto";
import {
  ObjectCategory,
  OccasionalAction,
  PunctualTransportType,
  PurchaseCondition,
  PurchaseOccasionalActionDetails,
  TransportOccasionalActionDetails,
} from "~/lib/types/carbon-footprint.types";
import { useCarbonImpact } from "~/lib/context/carbon-impact";
import { Input } from "@/components/ui/input";
import {
  CategoryIcons,
  CategoryLabels,
  ClothesSubCategoryLabels,
  FurnitureSubCategoryLabels,
  HomeAppliancesSubCategoryLabels,
  MultimediaSubCategoryLabels,
  PunctualTransportTypeIcons,
  PunctualTransportTypeLabels,
} from "@/lib/adapters/category.adapter";
import { saveCarbonFootprint } from "~/lib/storage/carbon-footprint-storage";
import { Button } from "~/components/ui/button";
import { colors } from "~/lib/theme";
import { useUser } from "~/lib/context/user";
import { EXPERIENCE_POINTS, GAME_MESSAGES } from "~/lib/constants/game";
import { showToast } from "~/components/ui/toast";
import { BottomModal } from "~/components/ui/custom-modal";
import { ToggleSelector } from "./toggle-selector";
import { DatePickerModal } from "~/components/ui/date-picker-modal";
import { CardHeader, CardTitle } from "~/components/ui/card";

type AddActionModalProps = {
  isVisible: boolean;
  onClose: () => void;
  initialAction?: OccasionalAction | null;
};

type ActionType = "transport" | "purchase";

const NumberInput = memo(
  ({
    value,
    onChange,
    step,
    min,
    max,
    title,
  }: {
    value: number;
    onChange: (value: number) => void;
    step: number;
    min?: number;
    max?: number;
    title: string;
  }) => {
    const [localError, setLocalError] = React.useState<string>("");

    const validateNumber = useCallback(
      (value: string) => {
        if (value === "") {
          const error = "Veuillez entrer un nombre entier valide";
          setLocalError(error);
          onChange(-1);
          return;
        }

        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) {
          const error = "Veuillez entrer un nombre entier valide";
          setLocalError(error);
          return;
        }

        if (min !== undefined && numValue < min) {
          const error = `La valeur minimale est ${min}`;
          setLocalError(error);
          onChange(numValue);
          return;
        }

        if (max !== undefined && numValue > max) {
          const error = `La valeur maximale est ${max}`;
          setLocalError(error);
          onChange(numValue);
          return;
        }

        setLocalError("");
        onChange(numValue);
      },
      [min, max, onChange, title],
    );

    return (
      <View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => validateNumber(`${value - step}`)}
            className="p-1 rounded-full bg-card dark:bg-primary-darker border-[1px] border-border dark:border-primary-dark"
          >
            <Ionicons name="remove" size={20} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <Input
            keyboardType="number-pad"
            value={`${value !== -1 ? value : ""}`}
            onChangeText={validateNumber}
            style={{ fontSize: 14 }}
            className={`min-w-[72px] text-center mx-2 ${localError ? "border-red-700" : ""}`}
          />
          <TouchableOpacity
            onPress={() => validateNumber(`${value + step}`)}
            className="p-1 rounded-full bg-card dark:bg-primary-darker border-[1px] border-border dark:border-primary-dark"
          >
            <Ionicons name="add" size={20} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>
        {localError && <Text className="text-red-700 mt-2">{localError}</Text>}
      </View>
    );
  },
);

const ActionButton = memo(
  ({
    label,
    isSelected,
    onPress,
    icon,
  }: {
    label: string;
    isSelected: boolean;
    onPress: () => void;
    icon?: any;
  }) => (
    <TouchableOpacity
      className={`p-4 rounded-xl border bg-white dark:bg-black ${
        isSelected ? "border-primary" : "border-border"
      }`}
      onPress={onPress}
    >
      <View className="flex-row items-center gap-2">
        {icon && (
          <Ionicons name={icon} size={20} color={colors.primary.DEFAULT} />
        )}
        <Text>{label}</Text>
      </View>
    </TouchableOpacity>
  ),
);

// Step Components
const ActionTypeStep = ({
  selectedActionType,
  onActionTypeSelect,
}: {
  selectedActionType: ActionType | null;
  onActionTypeSelect: (type: ActionType) => void;
}) => (
  <View className="gap-2">
    <ActionButton
      label="Transport"
      isSelected={selectedActionType === "transport"}
      onPress={() => onActionTypeSelect("transport")}
      icon="airplane-outline"
    />
    <ActionButton
      label="Achat"
      isSelected={selectedActionType === "purchase"}
      onPress={() => onActionTypeSelect("purchase")}
      icon="cart-outline"
    />
  </View>
);

const CategorySelectionStep = ({
  selectedActionType,
  selectedObjectCategory,
  onCategorySelect,
  selectedTransportMode,
  onTransportModeSelect,
}: {
  selectedActionType: ActionType | null;
  selectedObjectCategory: ObjectCategory | null;
  onCategorySelect: (category: ObjectCategory) => void;
  selectedTransportMode: string | null;
  onTransportModeSelect: (mode: string) => void;
}) => {
  if (selectedActionType === "transport") {
    return (
      <View className="gap-2">
        <View className="gap-2">
          {Object.entries(PunctualTransportType).map(([key, value]) => (
            <ActionButton
              key={value}
              label={PunctualTransportTypeLabels[value] || key}
              isSelected={selectedTransportMode === value}
              onPress={() => onTransportModeSelect(value)}
              icon={PunctualTransportTypeIcons[value]}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="gap-2">
      {Object.values(ObjectCategory).map((category) => (
        <ActionButton
          key={category}
          label={CategoryLabels[category]}
          isSelected={selectedObjectCategory === category}
          onPress={() => onCategorySelect(category)}
          icon={CategoryIcons[category]}
        />
      ))}
    </View>
  );
};

const DetailsInputStep = ({
  selectedActionType,
  distanceInput,
  onDistanceChange,
  subCategoryLabels,
  selectedObjectSubCategory,
  onSubCategorySelect,
  labelInput,
  onLabelChange,
}: {
  selectedActionType: ActionType | null;
  distanceInput: number;
  onDistanceChange: (distance: number) => void;
  subCategoryLabels: Record<string, string>;
  selectedObjectSubCategory: string | null;
  onSubCategorySelect: (subCategory: string) => void;
  labelInput: string;
  onLabelChange: (label: string) => void;
}) => {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  if (selectedActionType === "transport") {
    return (
      <View className="mt-4 gap-2">
        <View>
          <Text className="mb-2">Distance (km)</Text>
          <NumberInput
            value={distanceInput as number}
            onChange={onDistanceChange}
            step={10}
            min={1}
            title={"Entrez une distance"}
          />
        </View>

        <View className="mb-2">
          <Text className="mb-2">Type de trajet</Text>
          <ToggleSelector
            fullWidth
            options={[
              { label: "Aller simple", value: "one-way" },
              { label: "Aller-retour", value: "round-trip" },
            ]}
            value={isRoundTrip ? "round-trip" : "one-way"}
            onChange={(value) => setIsRoundTrip(value === "round-trip")}
          />
        </View>
        <View>
          <Text className="mb-2">Label (optionnel)</Text>
          <Input
            value={labelInput}
            onChangeText={onLabelChange}
            placeholder="Ex: Voyage Paris"
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="space-y-4 max-h-96">
      <View className="gap-2">
        {Object.entries(subCategoryLabels).map(([key, label]) => (
          <ActionButton
            key={key}
            label={label as string}
            isSelected={selectedObjectSubCategory === key}
            onPress={() => onSubCategorySelect(key)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const QuantityInputStep = ({
  quantityInput,
  onQuantityChange,
  labelInput,
  onLabelChange,
  selectedCondition,
  onConditionChange,
  dateInput,
  onDateChange,
}: {
  quantityInput: number;
  onQuantityChange: (quantity: number) => void;
  labelInput: string;
  onLabelChange: (label: string) => void;
  selectedCondition: PurchaseCondition;
  onConditionChange: (condition: PurchaseCondition) => void;
  dateInput: Date;
  onDateChange: (date: Date) => void;
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View className="mt-4 gap-3">
      <View>
        <Text className="mb-2">Quantité</Text>
        <NumberInput
          value={quantityInput as number}
          onChange={onQuantityChange}
          step={1}
          min={0}
          title={"Entrer la quantité"}
        />
      </View>
      <View className="gap-2">
        <Text>État</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => onConditionChange(PurchaseCondition.New)}
            className={`flex-1 p-2 rounded-lg border bg-white dark:bg-black ${selectedCondition === PurchaseCondition.New ? "border-primary" : "border-border"}`}
          >
            <Text className="font-medium text-center">Neuf</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onConditionChange(PurchaseCondition.Used)}
            className={`flex-1 p-2 rounded-lg border bg-white dark:bg-black ${selectedCondition === PurchaseCondition.Used ? "border-primary" : "border-border"}`}
          >
            <Text className="font-medium text-center">Occasion</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className={"gap-2"}>
        <Text>Label (optionnel)</Text>
        <Input
          value={labelInput}
          onChangeText={onLabelChange}
          placeholder="Ex: Cadeau anniversaire"
        />
      </View>
      <View className={"gap-2"}>
        <Text>Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="p-4 rounded-xl border bg-white dark:bg-black border-border"
        >
          <Text>{dateInput.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <DatePickerModal
          isVisible={showDatePicker}
          setIsModalVisible={setShowDatePicker}
          selectedDate={dateInput}
          onDateChange={(date) => {
            onDateChange(date);
            if (Platform.OS === "android") {
              setShowDatePicker(false);
            }
          }}
        />
      </View>
    </View>
  );
};

export function AddActionModal({
  isVisible,
  onClose,
  initialAction,
}: AddActionModalProps) {
  const { carbonFootprint, refreshCarbonFootprint } = useCarbonImpact();
  const { addStreakInfo } = useUser();
  const { experienceSystem, addExperience } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedActionType, setActionType] = useState<ActionType | null>(null);
  const [selectedObjectCategory, setSelectedCategory] =
    useState<ObjectCategory | null>(null);
  const [selectedObjectSubCategory, setSelectedSubCategory] = useState<
    string | null
  >(null);
  const [selectedTransportMode, setTransportMode] = useState<string | null>(
    null,
  );
  const [distanceInput, setDistanceInput] = useState<number>(10);
  const [quantityInput, setQuantityInput] = useState<number>(1);
  const [dateInput, setDateInput] = useState<Date>(new Date());
  const [labelInput, setLabelInput] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<PurchaseCondition>(
    PurchaseCondition.New,
  );
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);

  const subCategoryLabels = useMemo(() => {
    switch (selectedObjectCategory) {
      case ObjectCategory.Multimedia:
        return MultimediaSubCategoryLabels;
      case ObjectCategory.Clothes:
        return ClothesSubCategoryLabels;
      case ObjectCategory.Furniture:
        return FurnitureSubCategoryLabels;
      case ObjectCategory.HomeAppliances:
        return HomeAppliancesSubCategoryLabels;
      default:
        return {};
    }
  }, [selectedObjectCategory]);

  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setActionType(null);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setTransportMode(null);
    setDistanceInput(10);
    setQuantityInput(1);
    setDateInput(new Date());
    setLabelInput("");
  }, []);

  useEffect(() => {
    if (initialAction) {
      setActionType(initialAction.type);
      setLabelInput(initialAction.label || "");
      if (initialAction.type === "transport") {
        setTransportMode(
          (initialAction.details as TransportOccasionalActionDetails).type,
        );
        setDistanceInput(
          (initialAction.details as TransportOccasionalActionDetails).distance,
        );
      } else {
        const purchaseDetails =
          initialAction.details as PurchaseOccasionalActionDetails;
        setSelectedCategory(purchaseDetails.category);
        setSelectedSubCategory(purchaseDetails.subCategory);
        setQuantityInput(purchaseDetails.quantity);
        setDateInput(initialAction.date);
        setSelectedCondition(
          purchaseDetails.condition || PurchaseCondition.New,
        );
      }
      setCurrentStep(initialAction.type === "transport" ? 3 : 4);
    }
  }, [initialAction]);

  const handleAddAction = useCallback(async () => {
    let newAction: OccasionalAction | null = null;

    const id = initialAction?.id || randomUUID();

    if (
      selectedActionType === "transport" &&
      selectedTransportMode &&
      distanceInput
    ) {
      newAction = {
        id,
        date: dateInput || initialAction?.date || new Date(),
        type: "transport",
        label: labelInput || undefined,

        details: {
          type: selectedTransportMode,
          distance: isRoundTrip ? distanceInput * 2 : distanceInput,
        } as TransportOccasionalActionDetails,
        carbonImpact: 0,
      };
    } else if (
      selectedActionType === "purchase" &&
      selectedObjectCategory &&
      selectedObjectSubCategory &&
      quantityInput
    ) {
      newAction = {
        id,
        type: "purchase",
        date: dateInput || initialAction?.date || new Date(),
        label: labelInput || undefined,
        details: {
          category: selectedObjectCategory,
          subCategory: selectedObjectSubCategory,
          quantity: quantityInput,
          condition: selectedCondition,
        } as PurchaseOccasionalActionDetails,
        carbonImpact: 0,
      };
    }

    if (newAction) {
      if (initialAction) {
        carbonFootprint.updateOccasionalAction(newAction);
      } else {
        carbonFootprint.addOccasionalAction(newAction);
        addStreakInfo();
        addExperience(EXPERIENCE_POINTS.ADD_ACTION);
        showToast({
          title: GAME_MESSAGES.ACTION_ADDED,
        });
      }
    }

    await saveCarbonFootprint(carbonFootprint);
    void refreshCarbonFootprint();

    onClose();
    resetForm();
  }, [
    selectedActionType,
    selectedTransportMode,
    distanceInput,
    selectedObjectCategory,
    selectedObjectSubCategory,
    quantityInput,
    carbonFootprint,
    refreshCarbonFootprint,
    onClose,
    resetForm,
    dateInput,
    initialAction,
    labelInput,
    isRoundTrip,
    selectedCondition,
    addStreakInfo,
    addExperience,
  ]);

  const canProceed = useMemo(() => {
    if (currentStep === 1) {
      return selectedActionType !== null;
    }
    if (currentStep === 2) {
      if (selectedActionType === "transport") return selectedTransportMode;
      return selectedObjectCategory !== null;
    }
    if (currentStep === 3) {
      if (selectedActionType === "transport") return distanceInput > 0;
      return selectedObjectSubCategory !== null;
    }
    return quantityInput > 0;
  }, [
    currentStep,
    selectedActionType,
    selectedTransportMode,
    distanceInput,
    selectedObjectCategory,
    selectedObjectSubCategory,
    quantityInput,
  ]);

  const getTitle = useCallback(() => {
    if (currentStep === 1) {
      return "Choisir une action";
    }
    if (selectedActionType === "transport" && currentStep === 2) {
      return "Transport";
    }
    if (currentStep === 2) {
      return "Catégorie";
    }
    if (currentStep === 3 && selectedActionType === "purchase") {
      return "Sous-catégorie";
    }
    return "Détails";
  }, [currentStep, selectedActionType]);

  const isLastStep =
    currentStep === 4 ||
    (selectedActionType === "transport" && currentStep === 3);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ActionTypeStep
            selectedActionType={selectedActionType}
            onActionTypeSelect={(type) => {
              setActionType(type);
              setCurrentStep(2);
            }}
          />
        );
      case 2:
        return (
          <CategorySelectionStep
            selectedActionType={selectedActionType}
            selectedObjectCategory={selectedObjectCategory}
            onCategorySelect={(category) => {
              setSelectedCategory(category);
              setCurrentStep(3);
            }}
            selectedTransportMode={selectedTransportMode}
            onTransportModeSelect={(mode) => {
              setTransportMode(mode);
              setCurrentStep(3);
            }}
          />
        );
      case 3:
        return (
          <DetailsInputStep
            selectedActionType={selectedActionType}
            distanceInput={distanceInput}
            onDistanceChange={(distance) => setDistanceInput(distance)}
            subCategoryLabels={subCategoryLabels}
            selectedObjectSubCategory={selectedObjectSubCategory}
            onSubCategorySelect={(subCategory) => {
              setSelectedSubCategory(subCategory);
              setCurrentStep(4);
            }}
            labelInput={labelInput}
            onLabelChange={setLabelInput}
          />
        );
      case 4:
        return (
          <QuantityInputStep
            quantityInput={quantityInput}
            onQuantityChange={(quantity) => setQuantityInput(quantity)}
            labelInput={labelInput}
            onLabelChange={setLabelInput}
            selectedCondition={selectedCondition}
            onConditionChange={setSelectedCondition}
            dateInput={dateInput}
            onDateChange={setDateInput}
          />
        );
      default:
        return null;
    }
  };

  return (
    <BottomModal
      visible={isVisible}
      onRequestClose={() => {
        onClose();
        resetForm();
      }}
    >
      <View className="flex-row justify-between items-center">
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
          <TouchableOpacity
            onPress={() => {
              onClose();
              resetForm();
            }}
          >
            <Ionicons name="close" size={24} color="gray" />
          </TouchableOpacity>
        </CardHeader>
      </View>

      {renderStepContent()}

      {canProceed && (
        <Button
          className={`mt-6 p-4 rounded-xl items-center ${
            canProceed ? "bg-primary" : "bg-gray-300"
          }`}
          onPress={
            isLastStep
              ? handleAddAction
              : () => setCurrentStep((prev) => prev + 1)
          }
          disabled={!canProceed}
        >
          <Text className="font-medium">
            {isLastStep ? "Valider" : "Suivant"}
          </Text>
        </Button>
      )}
    </BottomModal>
  );
}
