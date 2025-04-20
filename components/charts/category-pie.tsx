import React from "react";
import { StyleSheet, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { Category, categoryDetailsMap } from "~/lib/types/categories"; // Import categoryDetailsMap
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const CHART_SIZE = 180;
const ICON_WIDTH = 20;
const ICON_MARGIN = 35; // Marge entre le cercle et l'icône

const styles = StyleSheet.create({
  iconContainer: {
    position: "absolute",
    width: ICON_WIDTH,
    height: ICON_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

const calculateGradientPoints = (
  radius: number,
  startAngle: number,
  endAngle: number,
  centerX: number,
  centerY: number,
) => {
  const midAngle = (startAngle + endAngle) / 2;

  const startRad = (Math.PI / 180) * startAngle;
  const midRad = (Math.PI / 180) * midAngle;

  const startX = centerX + radius * 0.5 * Math.cos(startRad);
  const startY = centerY + radius * 0.5 * Math.sin(startRad);

  const endX = centerX + radius * Math.cos(midRad);
  const endY = centerY + radius * Math.sin(midRad);

  return { startX, startY, endX, endY };
};

export type PieSlice = {
  label: string;
  value: number;
  color: string;
  percentage: string;
  type: Category;
};
type PieChartTouchLayerProps = {
  data: PieSlice[];
  size?: number;
  onSlicePress: (slice: PieSlice) => void;
  selectedSlice: PieSlice | undefined;
};

const typeToIconNameMap = {
  transport: "flight",
  shopping: "shopping-cart",
  activities: "restaurant",
  housing: "home",
};
export const PieChartTouchLayer: React.FC<PieChartTouchLayerProps> = ({
  data,
  size = CHART_SIZE + 25,
  onSlicePress,
  selectedSlice,
}) => {
  const center = size / 2;
  const radius = size * 0.45;
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let startAngle = 270;

  const getArcPath = (startAngle: number, sliceAngle: number) => {
    const endAngle = startAngle + sliceAngle;
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);
    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <Svg
      width={size}
      height={size}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -(size / 2) }, { translateY: -(size / 2) }],
        zIndex: 1000,
      }}
    >
      {data
        .filter((slice) => slice.value > 0)
        .map((slice, index) => {
          const sliceAngle = (slice.value / total) * 360;
          const pathData = getArcPath(startAngle, sliceAngle);
          const midAngle = startAngle + sliceAngle / 2;
          const midAngleRad = (midAngle * Math.PI) / 180;

          // Calcul de la position de l'icône à l'extérieur du cercle
          const iconRadius = radius - ICON_MARGIN;
          const iconX =
            center + iconRadius * Math.cos(midAngleRad) - ICON_WIDTH / 2;
          const iconY =
            center + iconRadius * Math.sin(midAngleRad) - ICON_WIDTH / 2;
          startAngle += sliceAngle;

          // Calculate percentage
          const percentage = (slice.value / total) * 100;
          // Get icon name from categoryDetailsMap
          const iconName =
            categoryDetailsMap[slice.type]?.iconName || "help-outline"; // Default icon

          return (
            <React.Fragment key={index}>
              <Path
                d={pathData}
                opacity={selectedSlice?.label === slice.label ? 0.5 : 1}
                fill={slice.color}
                onPressIn={() => {
                  onSlicePress(slice);
                }}
              />

              {/* Conditionally render icon if percentage > 10 */}
              {percentage > 5 && (
                <View
                  style={[styles.iconContainer, { left: iconX, top: iconY }]}
                >
                  <MaterialIcons
                    size={ICON_WIDTH}
                    name={iconName}
                    color={"white"}
                  />
                </View>
              )}
            </React.Fragment>
          );
        })}
    </Svg>
  );
};
