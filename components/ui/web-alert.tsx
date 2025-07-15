import {useState} from "react";
import {Platform, TouchableOpacity, View} from "react-native";
import {Text} from "~/components/ui/text";
import {useColorScheme} from "@/hooks/useColorScheme";
import {cn} from "~/lib/utils";
import {MaterialIcons} from "@expo/vector-icons";

export function WebAlert() {
  const [isVisible, setIsVisible] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const closeAlert = () => {
    setIsVisible(false);
  };

  if (Platform.OS !== "web") {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <View className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center p-2 mt-2">
      <View className={cn("w-full rounded-xl  px-4 py-3", "bg-primary")}>
        <View className="flex-row items-center justify-between">
          <MaterialIcons
            name="info-outline"
            size={20}
            color={"white"}
            style={{ marginRight: 8 }}
          />
          <Text className={cn("flex-1 font-medium text-sm text-white")}>
            Version de démonstration web • L'application native mobile offre la
            véritable expérience utilisateur optimisée
          </Text>
          <TouchableOpacity onPress={closeAlert}>
            <MaterialIcons
              name="close"
              size={20}
              color={"white"}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
