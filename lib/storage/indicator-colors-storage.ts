import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CategoryColors,
  defaultCategoryColors,
} from "~/lib/types/indicator-colors";

export const INDICATOR_COLORS_KEY = "indicator_colors";

export const saveIndicatorColors = async (
  colors: CategoryColors,
): Promise<void> => {
  try {
    const serializedData = JSON.stringify(colors);
    await AsyncStorage.setItem(INDICATOR_COLORS_KEY, serializedData);
  } catch (error) {
    console.error("Error saving indicator colors:", error);
    throw error;
  }
};

export const getIndicatorColors = async (): Promise<CategoryColors> => {
  try {
    const data = await AsyncStorage.getItem(INDICATOR_COLORS_KEY);
    if (!data) return defaultCategoryColors;

    return JSON.parse(data);
  } catch (error) {
    console.error("Error getting indicator colors:", error);
    return defaultCategoryColors;
  }
};
