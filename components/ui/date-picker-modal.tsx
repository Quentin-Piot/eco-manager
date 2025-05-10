import React from "react";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { colors } from "~/lib/theme";

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
        <Button {...props} variant={"ghost"} className={"rounded-none"}>
          <Text>Confirmer</Text>
        </Button>
      )}
      customCancelButtonIOS={(props) => (
        <Button className={"rounded-md"} variant={"outline"} {...props}>
          <Text>Annuler</Text>
        </Button>
      )}
      display={"inline"}
      onChange={handleDateChange}
      textColor={colors.muted.darker}
      buttonTextColorIOS={colors.muted.darker}
      maximumDate={new Date()}
      accentColor={colors.primary.DEFAULT}
      themeVariant={"light"}
    />
  );
};
