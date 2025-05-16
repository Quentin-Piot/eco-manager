import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text as UIText } from "~/components/ui/text";
import { colors } from "~/lib/theme";
import { BottomModal } from "~/components/ui/custom-modal";
import { RecurrenceType } from "~/lib/context/account-context";

interface RecurrenceSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  selectedRecurrence: RecurrenceType;
  onSelect: (recurrence: RecurrenceType) => void;
}

const recurrenceOptions: { value: RecurrenceType; label: string }[] = [
  { value: "none", label: "Aucune" },
  { value: "daily", label: "Journalière" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuelle" },
  { value: "yearly", label: "Annuelle" },
];

export const RecurrenceSelector: React.FC<RecurrenceSelectorProps> = ({
  isVisible,
  onClose,
  selectedRecurrence,
  onSelect,
}) => {
  return (
    <BottomModal visible={isVisible} onRequestClose={onClose}>
      <UIText className="text-lg font-semibold mb-4 text-foreground dark:text-primary-foreground">
        Sélectionner une récurrence
      </UIText>
      <FlatList
        data={recurrenceOptions}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelect(item.value)}
            className="flex-row items-center justify-between p-3 border-b border-border dark:border-border"
          >
            <UIText className="text-base text-foreground dark:text-primary-foreground">
              {item.label}
            </UIText>
            {selectedRecurrence === item.value && (
              <MaterialIcons
                name="check-circle"
                size={20}
                color={colors.primary.DEFAULT}
              />
            )}
          </TouchableOpacity>
        )}
      />
    </BottomModal>
  );
};
