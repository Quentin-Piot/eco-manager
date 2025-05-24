import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { categoryDetailsMap, MainCategory } from "~/lib/types/categories";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const CHART_SIZE = 180;
const ICON_WIDTH = 20;
const ICON_MARGIN = 30;

const styles = StyleSheet.create({
  chartContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  iconContainer: {
    position: "absolute",
    width: ICON_WIDTH,
    height: ICON_WIDTH,
    alignItems: "center",
    justifyContent: "center",
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
  percentage: number;
  type: MainCategory;
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
  const slicesWithData = useMemo(() => {
    let startAngle = 270;

    const center = size / 2;
    const radius = size * 0.45;
    const total = data.reduce((acc, item) => acc + item.value, 0);

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

    return data.map((slice, index) => {
      const sliceAngle = (slice.value / total) * 360;
      const pathData = getArcPath(startAngle, sliceAngle);
      const midAngle = startAngle + sliceAngle / 2;
      const midAngleRad = (midAngle * Math.PI) / 180;

      const iconDistanceFromCenter = radius - ICON_MARGIN;
      const iconX =
        center +
        iconDistanceFromCenter * Math.cos(midAngleRad) -
        ICON_WIDTH / 2;
      const iconY =
        center +
        iconDistanceFromCenter * Math.sin(midAngleRad) -
        ICON_WIDTH / 2;
      startAngle += sliceAngle;

      const iconName =
        categoryDetailsMap[slice.type]?.iconName || "help-outline";

      return { ...slice, pathData, iconX, iconY, iconName };
    });
  }, [data, size]);

  return (
    <View
      style={[
        styles.chartContainer,
        {
          width: size,
          height: size,
          transform: [{ translateX: -(size / 2) }, { translateY: -(size / 2) }],
        },
      ]}
    >
      <Svg
        width={size}
        height={size}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {slicesWithData.map((slice, index) => (
          <Path
            key={`path-${index}`}
            d={slice.pathData}
            opacity={selectedSlice?.label === slice.label ? 0.5 : 1}
            fill={slice.color}
            onPress={() => {
              onSlicePress(slice);
            }}
          />
        ))}
      </Svg>

      {slicesWithData
        .filter((slice) => slice.percentage > 5)
        .map((slice, index) => (
          <View
            key={`icon-${index}`}
            style={[
              styles.iconContainer,
              { left: slice.iconX, top: slice.iconY, pointerEvents: "none" },
            ]}
          >
            <MaterialIcons
              size={ICON_WIDTH}
              name={slice.iconName}
              color={"white"}
            />
          </View>
        ))}
    </View>
  );
};
