import React, { useCallback, useEffect, useMemo } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useValidation } from "~/lib/context/validation";
import { colors } from "~/lib/theme";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Purchase } from "~/lib/types/questionnaire.types";

// Types extraits pour plus de clarté
export type QuestionOption<T> = {
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: T;
};

export type QuestionType =
  | "purchase"
  | "single"
  | "multiple"
  | "number"
  | "select"
  | "boolean";

type QuestionCardProps<T> = {
  title: string;
  type?: QuestionType;
  options?: QuestionOption<T>[];
  selectedValue: T;
  onSelect: (value: any) => void;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
};

// Composants extraits pour une meilleure réutilisation
const NumberInput = React.memo(
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
    const { setError: setContextError, clearError } = useValidation();
    const [localError, setLocalError] = React.useState<string>("");

    const validateNumber = useCallback(
      (value: string) => {
        if (value === "") {
          const error = "Veuillez entrer un nombre entier valide";
          setLocalError(error);
          setContextError(title, error);
          onChange(-1);
          return;
        }

        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) {
          const error = "Veuillez entrer un nombre entier valide";
          setLocalError(error);
          setContextError(title, error);
          return;
        }

        if (min !== undefined && numValue < min) {
          const error = `La valeur minimale est ${min}`;
          setLocalError(error);
          setContextError(title, error);
          onChange(numValue);
          return;
        }

        if (max !== undefined && numValue > max) {
          const error = `La valeur maximale est ${max}`;
          setLocalError(error);
          setContextError(title, error);
          onChange(numValue);
          return;
        }

        setLocalError("");
        clearError(title);
        onChange(numValue);
      },
      [min, max, onChange, setContextError, clearError, title],
    );

    return (
      <View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => validateNumber(`${value - step}`)}
            className="p-1 rounded-full bg-card dark:bg-primary-darker border-[1px] border-border "
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
            className="p-1 rounded-full bg-card dark:bg-primary-darker border-[1px] border-border "
          >
            <Ionicons name="add" size={20} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>
        {localError && <Text className="text-red-700 mt-2">{localError}</Text>}
      </View>
    );
  },
);

const PurchaseInput = React.memo(
  ({
    value,
    onChange,
    step,
    min,
    max,
    title,
  }: {
    value: Purchase[];
    onChange: (value: Purchase[]) => void;
    step: number;
    min?: number;
    max?: number;
    title: string;
  }) => {
    const { setError: setContextError, clearError } = useValidation();
    const [localError, setLocalError] = React.useState<string>("");

    const validatePurchase = useCallback(
      (value: string) => {
        if (value === "") {
          const error = "Veuillez entrer un nombre entier valide";
          setLocalError(error);
          setContextError(title, error);
          onChange([]);
          return;
        }

        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) {
          const error = "Veuillez entrer un nombre entier valide";
          setLocalError(error);
          setContextError(title, error);
          return;
        }

        const generatedValue = Array.from({ length: numValue }).map(() => ({
          dateOfPurchase: new Date(),
        }));

        if (min !== undefined && numValue < min) {
          const error = `La valeur minimale est ${min}`;
          setLocalError(error);
          setContextError(title, error);
          onChange(generatedValue);
          return;
        }

        if (max !== undefined && numValue > max) {
          const error = `La valeur maximale est ${max}`;
          setLocalError(error);
          setContextError(title, error);
          onChange(generatedValue);
          return;
        }

        setLocalError("");
        clearError(title);
        onChange(generatedValue);
      },
      [min, max, onChange, setContextError, clearError, title],
    );

    return (
      <View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => validatePurchase(`${(value?.length || 0) - step}`)}
            className="p-1 rounded-full bg-card dark:bg-primary-darker border-[1px] border-border "
          >
            <Ionicons name="remove" size={14} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <Input
            keyboardType="number-pad"
            value={`${value !== undefined ? value.length : ""}`}
            onChangeText={validatePurchase}
            style={{ fontSize: 14 }}
            className={`min-w-[72px] text-center mx-2 ${localError ? "border-red-700" : ""}`}
          />
          <TouchableOpacity
            onPress={() => validatePurchase(`${(value?.length || 0) + step}`)}
            className="p-1 rounded-full bg-card dark:bg-primary-darker border-[1px] border-border "
          >
            <Ionicons name="add" size={14} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>
        {localError && <Text className="text-red-700 mt-2">{localError}</Text>}
      </View>
    );
  },
);

export const QuestionCard = React.memo(function <T>({
  title,
  type = "single",
  options = [],
  selectedValue,
  onSelect,
  description,
  min = 0,
  max,
  step = 1,
}: QuestionCardProps<T>) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const booleanOptions = useMemo(
    () => [
      { label: "Oui", value: true },
      { label: "Non", value: false },
    ],
    [],
  );

  const renderContent = useCallback(() => {
    switch (type) {
      case "number":
        return (
          <NumberInput
            value={selectedValue as number}
            onChange={onSelect}
            step={step}
            min={min}
            max={max}
            title={title}
          />
        );
      case "purchase":
        return (
          <PurchaseInput
            value={selectedValue as Purchase[]}
            onChange={onSelect}
            step={step}
            min={min}
            max={max}
            title={title}
          />
        );
      case "boolean":
        return (
          <View className="gap-2">
            {booleanOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onSelect(option.value as T)}
                className={`flex-row items-center px-4 py-3 rounded-xl ${
                  selectedValue === option.value
                    ? "bg-primary/20"
                    : "bg-card dark:bg-primary-darker"
                } border-[1px] border-border `}
              >
                <Text className="flex-1 text-neutral-800 dark:text-neutral-200">
                  {option.label}
                </Text>
                {selectedValue === option.value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.primary.DEFAULT}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );
      case "select":
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={selectedValue as string} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, index) => (
                <SelectItem
                  key={index}
                  value={option.value as string}
                  label={option.label}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <View className="gap-2">
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onSelect(option.value)}
                className={`flex-row items-center px-4 py-3 rounded-xl ${
                  selectedValue === option.value
                    ? "bg-primary/20 dark:bg-primary-dark"
                    : "bg-card dark:bg-primary-darker"
                } border-[1px] border-border `}
              >
                {option.icon && (
                  <View className="bg-primary-light/10 dark:bg-primary-dark/20 p-2 rounded-full mr-3">
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={colors.primary.DEFAULT}
                    />
                  </View>
                )}
                <Text className="flex-1 text-neutral-800 dark:text-neutral-200">
                  {option.label}
                </Text>
                {selectedValue === option.value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.primary.DEFAULT}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );
    }
  }, [
    type,
    selectedValue,
    step,
    min,
    max,
    title,
    options,
    onSelect,
    booleanOptions,
  ]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 24,
      }}
    >
      <Text className="text-lg font-semibold mb-0 text-primary dark:text-neutral-200">
        {title}
      </Text>

      {description && (
        <Text className="text-base mb-3 text-neutral-600 dark:text-neutral-400">
          {description}
        </Text>
      )}

      {renderContent()}
    </Animated.View>
  );
});
