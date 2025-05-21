import React from "react";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { colors } from "~/lib/theme";
import { glass } from "~/lib/theme-ios18";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BlurView } from "expo-blur";

type DatePickerModalProps = {
  isVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isVisible,
  setIsModalVisible,
  selectedDate,
  onDateChange,
}) => {
  const handleDateChange = (date: Date) => {
    onDateChange(date);
    setIsModalVisible(false);
  };

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <DateTimePickerModal
      onConfirm={handleDateChange}
      onCancel={() => setIsModalVisible(false)}
      mode="date"
      date={new Date(selectedDate)}
      isVisible={isVisible}
      locale={"fr_FR"}
      cancelTextIOS="Annuler"
      customConfirmButtonIOS={(props) => (
        <BlurView
          intensity={isDark ? glass.dark.blur - 5 : glass.light.blur - 5}
          tint={isDark ? "dark" : "light"}
          className="overflow-hidden rounded-xl border-[0.5px] border-gray-200/30 dark:border-muted-darker/30"
        >
          <Button
            {...props}
            variant={"ghost"}
            className={
              "bg-primary/80 dark:bg-primary-darker/80 rounded-xl py-3"
            }
          >
            <Text
              className="text-primary-foreground dark:text-primary-lighter font-medium"
              style={{ fontFamily: "Geist-Medium" }}
            >
              Confirmer
            </Text>
          </Button>
        </BlurView>
      )}
      customCancelButtonIOS={(props) => (
        <BlurView
          intensity={isDark ? glass.dark.blur - 5 : glass.light.blur - 5}
          tint={isDark ? "dark" : "light"}
          className="overflow-hidden rounded-xl border-[0.5px] border-gray-200/30 dark:border-muted-darker/30 mt-2"
        >
          <Button
            {...props}
            className={"bg-white/60 dark:bg-primary-darker/60 rounded-xl py-3"}
            variant={"outline"}
          >
            <Text
              className="text-muted-darker dark:text-muted-light font-medium"
              style={{ fontFamily: "Geist-Medium" }}
            >
              Annuler
            </Text>
          </Button>
        </BlurView>
      )}
      display={"inline"}
      onChange={handleDateChange}
      textColor={isDark ? colors.muted.light : colors.muted.darker}
      buttonTextColorIOS={isDark ? colors.muted.light : colors.muted.darker}
      maximumDate={new Date()}
      accentColor={colors.primary.DEFAULT}
      themeVariant={isDark ? "dark" : "light"}
    />
  );
};
