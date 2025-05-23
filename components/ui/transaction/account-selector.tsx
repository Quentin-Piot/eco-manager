import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text as UIText } from "~/components/ui/text";
import { colors } from "~/lib/theme";
import { BottomModal } from "~/components/ui/custom-modal";

interface AccountSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  accounts: any[];
  selectedAccountId: string | null;
  onSelect: (accountId: string) => void;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  isVisible,
  onClose,
  accounts,
  selectedAccountId,
  onSelect,
}) => {
  return (
    <BottomModal visible={isVisible} onRequestClose={onClose}>
      <UIText className="text-lg font-semibold mb-4 text-foreground dark:text-primary-foreground">
        Sélectionner un compte
      </UIText>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelect(item.id)}
            className="flex-row items-center justify-between p-3 border-b border-border dark:border-border"
          >
            <UIText className="text-base text-foreground dark:text-primary-foreground">
              {item.title}
            </UIText>
            {selectedAccountId === item.id && (
              <MaterialIcons
                name="check-circle"
                size={20}
                color={colors.primary.DEFAULT}
              />
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <UIText className="text-center text-muted-foreground p-4">
            Aucun compte courant disponible.
          </UIText>
        }
      />
    </BottomModal>
  );
};
