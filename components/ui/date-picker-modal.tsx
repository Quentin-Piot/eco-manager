import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BottomModal } from "~/components/ui/custom-modal";
import { Button } from "~/components/ui/button";

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
  const isIos = Platform.OS === "ios";
  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      onDateChange(date);
    }
  };

  return isIos ? (
    <BottomModal
      visible={isVisible}
      onRequestClose={() => setIsModalVisible(false)}
      className={"bg-white"}
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text
          className="text-2xl font-bold text-primary"
          style={{ fontFamily: "Geist" }}
        >
          Sélectionner une date
        </Text>
        <TouchableOpacity onPress={() => setIsModalVisible(false)}>
          <Ionicons name="close" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="spinner"
        onChange={handleDateChange}
        maximumDate={new Date()}
      />
      <Button onPress={() => setIsModalVisible(false)}>
        <Text>Confirmer</Text>
      </Button>
    </BottomModal>
  ) : (
    isVisible && (
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="spinner"
        onChange={handleDateChange}
        maximumDate={new Date()}
      />
    )
  );
};
