import React, { useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "~/lib/theme";
import { cn } from "~/lib/utils";
import { useColorScheme } from "~/lib/useColorScheme";

type ActionCardProps = {
  title: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  description?: string;
  variant?: "centered" | "horizontal";
  className?: string;
  containerClassName?: string;
  category?: "transport" | "lifestyle";
};

export function ActionCard({
  title,
  value,
  icon,
  description,
  variant = "centered",
  className,
  category,
  containerClassName,
}: ActionCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const { textColor, bgColor, iconBgColor, iconColor } = useMemo(() => {
    if (!category)
      return {
        textColor: "text-primary",
        bgColor: "",
        iconColor: colors.primary.DEFAULT,
      };
    switch (category) {
      case "transport":
        return {
          textColor: "text-transport-dark dark:text-transport-light",
          bgColor: "bg-transport-lighter dark:bg-transport-darker",
          iconBgColor: "bg-transport-light dark:bg-transport-dark",
          iconColor: !isDark
            ? colors.categories.transport.lighter
            : colors.categories.transport.light,
        };
      case "lifestyle":
        return {
          textColor: "text-lifestyle-dark dark:text-lifestyle-light",
          bgColor: "bg-lifestyle-lighter dark:bg-lifestyle-darker",
          iconBgColor: "bg-lifestyle-light dark:bg-lifestyle-dark",
          iconColor: !isDark
            ? colors.categories.lifestyle.lighter
            : colors.categories.lifestyle.light,
        };
    }
  }, [category, isDark]);
  return (
    <Card className={cn(className, bgColor, "py-4")}>
      <View className={`${variant === "centered" ? "items-center" : ""}`}>
        <View
          className={`${variant === "horizontal" ? "flex-row items-center mb-2" : "flex items-center justify-center"}`}
        >
          <View
            className={cn(
              "w-[30px] h-[30px]  rounded-full flex items-center justify-center",
              iconBgColor,
            )}
          >
            <Ionicons name={icon} size={18} color={iconColor} />
          </View>
          <Text
            className={cn(
              `font-medium text-card-foreground dark:text-gray-50 ${variant === "centered" ? "text-sm mt-2 text-center w-full" : "text-lg ml-3"}`,
              textColor,
            )}
          >
            {title}
          </Text>
        </View>

        {description && (
          <Text
            className={cn(
              "text-sm text-muted-foreground mb-2 dark:text-gray-200",
              textColor,
            )}
          >
            {description}
          </Text>
        )}

        <Text
          className={cn(
            `font-bold text-primary ${variant === "centered" ? "text-xl mt-1" : "text-base"}`,
            textColor,
          )}
          style={{ fontFamily: "Geist-Bold" }}
        >
          {value}
        </Text>
      </View>
    </Card>
  );
}
