import { PieChart } from "@/components/pie-chart";
import { useState } from "react";
import { Button, Text, View } from "react-native";

function generateRandomColor(): string {
  // Generating a random number between 0 and 0xFFFFFF
  const randomColor = Math.floor(Math.random() * 0xffffff);
  // Converting the number to a hexadecimal string and padding with zeros
  return `#${randomColor.toString(16).padStart(6, "0")}`;
}

function generatePolarChartData(numberPoints = 5) {
  return Array.from({ length: numberPoints }, (_, index) => ({
    value: Math.floor(Math.random() * 75) + 25, // Values between 25 and 100
    color: generateRandomColor(),
    label: `Label ${index + 1}`,
  }));
}

export default function Index() {
  const [data, setData] = useState(generatePolarChartData(4));
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PieChart
        data={data}
        onSlicePress={(index) => {
          const slice = data[index];
          console.log(
            `Slice with index ${index} and color ${slice.color} was pressed`
          );
        }}
      />

      <View
        style={{
          flex: 1,
        }}
      >
        <Button
          title="Generate new data"
          onPress={() => {
            setData(generatePolarChartData(Math.floor(Math.random() * 5) + 2));
          }}
        />
      </View>
    </View>
  );
}
