import { SharedValue, runOnJS } from "react-native-reanimated";

import { calculateAngle } from "./calculate-angle";
import { isPointInArc } from "./is-point-in-arc";

export function handlePieTouch<T extends { value: number }>(args: {
  centerX: number;
  centerY: number;
  data: T[];
  totalValue: number;
  radius: number;
  gap: number;
  x: number;
  y: number;

  onSlicePress: (index: number) => void;
  selectedSlice: SharedValue<number | null>;
}) {
  "worklet";

  const {
    centerX,
    centerY,
    data,
    totalValue,
    gap,
    radius,
    x,
    y,
    onSlicePress,
    selectedSlice,
  } = args;
  let currentAngle = -90;

  for (let i = 0; i < data.length; i++) {
    const {
      startAngle,
      endAngle,
      currentAngle: newCurrentAngle,
    } = calculateAngle({
      proportion: data[i].value / totalValue,
      currentAngle,
      gap,
    });

    currentAngle = newCurrentAngle;

    if (
      isPointInArc({
        x,
        y,
        centerX,
        centerY,
        radius,
        startAngle,
        endAngle,
      })
    ) {
      if (selectedSlice.value === i) {
        selectedSlice.value = null;
      } else {
        selectedSlice.value = i;
      }

      runOnJS(onSlicePress)(i);
      break;
    }
  }
}
