import React, { useEffect } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "~/lib/theme";
import { QuestionOption } from "~/components/ui/question-card";

type MultipleQuestionCardProps<T> = {
  title: string;
  options: QuestionOption<T>[];
  selectedValues: T[];
  onSelect: (values: T[]) => void;
  description?: string;
};

export function MultipleQuestionCard<T>({
  title,
  options,
  selectedValues,
  onSelect,
  description,
}: MultipleQuestionCardProps<T>) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSelect = (value: T) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelect(newSelected);
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        flex: 1,
        padding: 24,
      }}
    >
      <Text className="text-xl font-semibold mb-1 text-primary dark:text-neutral-200">
        {title}
      </Text>

      {description && (
        <Text className="text-base mb-4 text-neutral-600 dark:text-neutral-400">
          {description}
        </Text>
      )}

      <View className="gap-2">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelect(option.value)}
            className={`flex-row items-center p-4 rounded-xl ${
              selectedValues.includes(option.value)
                ? "bg-primary/20"
                : "bg-card dark:bg-primary-darker"
            } border-[1px] border-border dark:border-primary-dark`}
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
            {selectedValues.includes(option.value) && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.primary.DEFAULT}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}
