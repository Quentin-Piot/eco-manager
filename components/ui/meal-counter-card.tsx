import React from "react";
import {TouchableOpacity, View} from "react-native";
import {Text} from "~/components/ui/text";
import {Card} from "~/components/ui/card";
import {MealType} from "~/lib/types/questionnaire.types";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "~/lib/theme";

type MealCounterCardProps = {
    mealType: MealType;
    count: number;
    onIncrement: () => void;
    onDecrement: () => void;
    disabled?: boolean;
};

const mealIcons: Record<MealType, string> = {
    [MealType.Vegan]: "leaf",
    [MealType.Vegetarian]: "nutrition",
    [MealType.WhitePoultry]: "restaurant",
    [MealType.RedMeat]: "fast-food",
    [MealType.FattyFish]: "fish",
    [MealType.WhiteFish]: "fish",
};

const mealLabels: Record<MealType, string> = {
    [MealType.Vegan]: "Vegan",
    [MealType.Vegetarian]: "Végétarien",
    [MealType.WhitePoultry]: "Volaille",
    [MealType.RedMeat]: "Viande rouge",
    [MealType.FattyFish]: "Poisson gras",
    [MealType.WhiteFish]: "Poisson blanc",
};

export function MealCounterCard({
                                    mealType,
                                    count,
                                    onIncrement,
                                    onDecrement,
                                    disabled = false,
                                }: MealCounterCardProps) {
    return (
        <Card className="py-4 px-2 my-2">
            <TouchableOpacity
                className="items-center justify-center"
                disabled={disabled}
            >
                <Text className="text-sm mb-2 text-center">{mealLabels[mealType]}</Text>
                <Ionicons
                    name={mealIcons[mealType] as any}
                    size={24}
                    color={disabled ? "black" : colors.primary.DEFAULT}
                />
                <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                        onPress={onDecrement}
                        disabled={count === 0 || disabled}
                        className="p-2"
                    >
                        <Ionicons
                            name="remove-circle-outline"
                            size={16}
                            color={count === 0 || disabled ? "gray" : colors.primary.DEFAULT}
                        />
                    </TouchableOpacity>
                    <Text className="mx-1 text-lg">{count}</Text>
                    <TouchableOpacity
                        onPress={onIncrement}
                        disabled={disabled}
                        className="p-2"
                    >
                        <Ionicons
                            name="add-circle-outline"
                            size={16}
                            color={disabled ? "gray" : colors.primary.DEFAULT}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Card>
    );
}
