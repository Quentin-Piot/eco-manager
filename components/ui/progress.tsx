import * as ProgressPrimitive from "@rn-primitives/progress";
import * as React from "react";
import { Platform, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { cn } from "~/lib/utils";

const Progress = React.forwardRef<
  ProgressPrimitive.RootRef,
  ProgressPrimitive.RootProps & {
    indicatorClassName?: string;
    noProgressText?: boolean;
    small?: boolean;
  }
>(
  (
    {
      className,
      value,
      indicatorClassName,
      noProgressText = false,
      small = false,
      ...props
    },
    ref,
  ) => {
    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-900",
          small ? "h-2" : "h-4",
          className,
        )}
        {...props}
      >
        <Indicator
          value={Math.min(100, value as number)}
          className={indicatorClassName}
        />
        {!noProgressText && !small && <Label value={value} />}
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

function Indicator({
  value,
  className,
}: {
  value: number | undefined | null;
  className?: string;
}) {
  const progress = useDerivedValue(() => value ?? 0);

  const indicator = useAnimatedStyle(() => {
    return {
      width: withSpring(
        `${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`,
        { overshootClamping: true },
      ),
    };
  });

  if (Platform.OS === "web") {
    return (
      <View
        className={cn(
          "h-full w-full flex-1 bg-primary web:transition-all",
          className,
        )}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      >
        <ProgressPrimitive.Indicator
          className={cn("h-full w-full", className)}
        />
      </View>
    );
  }

  return (
    <ProgressPrimitive.Indicator asChild>
      <Animated.View
        style={indicator}
        className={cn("h-full bg-primary", className)}
      />
    </ProgressPrimitive.Indicator>
  );
}

function Label({ value }: { value: number | undefined | null }) {
  return (
    <View className="absolute inset-0 flex items-center justify-start top-[-1px]">
      <Text
        className={cn(
          "text-xs font-semibold",
          (value || 0) > 50 ? "text-white" : "text-black",
        )}
      >
        {value ? `${Math.round(value)}%` : "0%"}
      </Text>
    </View>
  );
}
