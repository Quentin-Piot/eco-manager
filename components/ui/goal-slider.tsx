import React from "react";
import { StyleSheet, View } from "react-native";
import { Slider as RNSlider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { colors } from "~/lib/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Card } from "~/components/ui/card";

type SliderProps = {
  minimumValue: number;
  maximumValue: number;
  defaultValue: number;
  onValueChange: (value: number) => void;
};

const descriptionAccordingToGoal = (goal: number) => {
  if (goal < 4) {
    return "Bravo ! Vous êtes aligné avec les objectifs du GIEC.";
  }
  if (goal < 6) {
    return "Très bien ! Encore quelques efforts pour un impact optimal.";
  }
  if (goal < 8) {
    return "Bon début ! Des ajustements peuvent faire la différence.";
  }
  if (goal < 10) {
    return "Engagé ! Intensifiez vos actions pour un vrai changement.";
  }
  if (goal < 12) {
    return "Efforts nécessaires, chaque geste compte !";
  }
  if (goal >= 12) {
    return "Impact élevé : relevez le défi d’une transition durable !";
  }
};

export const GoalSlider = (props: SliderProps) => {
  const { minimumValue, maximumValue, defaultValue, onValueChange } = props;
  const min = useSharedValue(minimumValue);
  const max = useSharedValue(maximumValue);
  const progress = useSharedValue(defaultValue);
  return (
    <View className={"w-full h-44 flex-col items-center gap-3 px-4"}>
      <View className={"w-full gap-6"}>
        <View>
          <Text className={"text-left font-semibold text-primary"}>
            Nouvel objectif:{" "}
            <Text
              className={"text-left font-bold text-primary"}
              style={{ fontFamily: "Geist-Bold" }}
            >
              {defaultValue}
            </Text>
          </Text>
          <Text className={"text-left text-sm h-10"}>
            {descriptionAccordingToGoal(defaultValue)}
          </Text>
        </View>
        <View className={"relative w-[100%]"}>
          <LinearGradient
            colors={[
              colors.categories.energy.light,
              colors.categories.lifestyle.light,
              colors.categories.food.light,
            ]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <RNSlider
            containerStyle={{
              position: "relative",
              height: 8,
              borderRadius: 6,
            }}
            progress={progress}
            onValueChange={onValueChange}
            minimumValue={min}
            maximumValue={max}
            forceSnapToStep
            steps={20}
            theme={{
              minimumTrackTintColor: colors.primary.DEFAULT,
              maximumTrackTintColor: "transparent",
              bubbleBackgroundColor: colors.primary.DEFAULT,
            }}
            renderMark={({ index }) => {
              const stepValue = index / 2 + 2;
              const descriptionIndex = index / 2 - 1; // Index pour les descriptions (tous les 2 pas)

              return (
                (index === 0 || index === 20) && (
                  <>
                    {index === 0 && (
                      <View
                        className={
                          "absolute text-right items-center justify-center top-10 left-[-26px] right-0 w-[60px]"
                        }
                      >
                        <Card className={"bg-secondary px-2 py-2"}>
                          <Text
                            className={
                              "text-white text-xs font-semibold text-center"
                            }
                            style={{ fontFamily: "Geist-SemiBold" }}
                          >
                            Objectif GIEC
                          </Text>
                        </Card>
                      </View>
                    )}
                    <View
                      className={
                        "absolute text-right items-center justify-center top-2 left-[-10px] right-0 w-[20px]"
                      }
                    >
                      <Text className={"text-right w-full  font-semibold"}>
                        {stepValue}
                      </Text>
                    </View>
                  </>
                )
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: "100%",
    height: 8,
    borderRadius: 6,
    position: "absolute",
    top: -4,
  },
});
