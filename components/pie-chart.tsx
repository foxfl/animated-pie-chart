import { useEffect, useMemo } from "react";

import { Canvas, Group } from "@shopify/react-native-skia";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue, withTiming } from "react-native-reanimated";

import { PieSliceProvider } from "@/contexts/pie-slice-context";
import { checkIfDistanceIsInsideArc } from "@/lib/charts/is-point-in-arc";
import { handlePieTouch } from "@/lib/charts/touch-handler";
import { PieChartDataEntry, PieSlice } from "./pie-slice";

const GAP = 8;
const SIZE = 260; // Base SIZE
const BASE_STROKE_WIDTH = 12;
const MAX_STROKE_WIDTH = BASE_STROKE_WIDTH * 1.5; // Maximum stroke width during animation

// Calculate required PADDING to prevent cutoff
const PADDING = MAX_STROKE_WIDTH + 4; // Add a little extra space
const ADJUSTED_SIZE = SIZE + PADDING * 2; // Increase canvas SIZE
const CENTER = ADJUSTED_SIZE / 2; // New CENTER point

// Adjust radius to maintain same visible SIZE
const RADIUS = SIZE / 2;

interface PieChartProps {
  data: PieChartDataEntry[];
  onSlicePress: (index: number) => void;
}

export function PieChart({ data, onSlicePress }: PieChartProps) {
  // Memoize the data to prevent regeneration on every render

  const totalValue = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  // Animation shared values
  const pieAnimation = useSharedValue(0);

  // Add state for selected slice
  const selectedSlice = useSharedValue<number | null>(null);

  // Reusable animation function

  // Trigger animations only on mount and when progress changes
  useEffect(() => {
    pieAnimation.value = 0;

    // Animate progress over 600ms
    pieAnimation.value = withTiming(1, { duration: 800 });
  }, [data]);

  const pieChartSlices = useMemo(() => {
    let currentAngle = -90; // Start from top

    return data.map((item, index) => {
      const proportion = item.value / totalValue;
      const fullSweepAngle = proportion * 360;

      const segmentStart = currentAngle;
      currentAngle += fullSweepAngle;

      return {
        startAngle: segmentStart,
        fullSweepAngle,
        item: item,
        index: index,
        radius: RADIUS,
        center: CENTER,
        gap: GAP,
        strokeWidth: BASE_STROKE_WIDTH,
      };
    });
  }, [data]);

  // Modify tap handler to log angles for debugging
  const tap = Gesture.Tap().onStart((e) => {
    if (!onSlicePress) return;

    const isWithinPie = checkIfDistanceIsInsideArc({
      x: e.x,
      y: e.y,
      centerX: CENTER,
      centerY: CENTER,
      radius: RADIUS,
      strokeWidth: BASE_STROKE_WIDTH,
    });
    if (isWithinPie) {
      handlePieTouch({
        centerX: CENTER,
        centerY: CENTER,
        data,
        totalValue,
        gap: GAP,
        radius: RADIUS,
        x: e.x,
        y: e.y,
        onSlicePress,
        selectedSlice,
      });
    }
  });

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
      }}
    >
      <GestureDetector gesture={tap}>
        <Canvas
          style={{
            width: ADJUSTED_SIZE,
            height: ADJUSTED_SIZE,
          }}
        >
          <Group>
            {pieChartSlices.map((slice, index) => (
              <PieSliceProvider
                key={index}
                slice={{
                  ...slice,
                  index,
                  animatedValue: pieAnimation,
                  selectedSlice,
                }}
              >
                <PieSlice />
              </PieSliceProvider>
            ))}
          </Group>
        </Canvas>
      </GestureDetector>
    </View>
  );
}
