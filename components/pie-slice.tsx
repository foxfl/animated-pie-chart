import { usePieSliceContext } from "@/contexts/pie-slice-context";
import { SPRING_CONFIG } from "@/lib/charts/animation";
import { createArcPath } from "@/lib/charts/draw";
import { Path } from "@shopify/react-native-skia";
import {
  SharedValue,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

export interface PieChartDataEntry {
  value: number;
  color: string;
  label: string;
}

export interface PieSliceData {
  item: PieChartDataEntry;
  startAngle: number;
  index: number;
  radius: number;
  center: number;
  fullSweepAngle: number;
  gap: number;
  animatedValue: SharedValue<number>;
  strokeWidth: number;
  selectedSlice: SharedValue<number | null>;
}

export function PieSlice() {
  const { slice } = usePieSliceContext();

  const {
    index,
    item,
    startAngle,
    fullSweepAngle,
    gap,
    animatedValue,
    radius,
    center,
    strokeWidth,
    selectedSlice,
  } = slice;
  const animatedStrokeWidth = useDerivedValue(() => {
    if (selectedSlice.value === null) {
      return withSpring(strokeWidth, SPRING_CONFIG);
    }
    return withSpring(
      selectedSlice.value === index ? strokeWidth * 1.5 : strokeWidth * 0.8,
      SPRING_CONFIG
    );
  });

  const path = useDerivedValue(() => {
    const animatedSweep = Math.max(
      0,
      (fullSweepAngle - gap) * animatedValue.value
    );

    return createArcPath({
      startAngle: startAngle,
      endAngle: startAngle + animatedSweep,
      radius,
      center: center,
      strokeWidth: strokeWidth,
    });
  });

  return (
    <Path
      path={path}
      color={item.color}
      style="stroke"
      strokeWidth={animatedStrokeWidth}
      strokeCap="round"
    />
  );
}
