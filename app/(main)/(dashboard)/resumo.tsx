import { StyleSheet, Dimensions, View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import Spacer from "@components/Spacer";
import ThemedView from "@components/ThemedView";
import { useState } from "react";

const screenWidth = Dimensions.get("window").width;
const monthData = [
  { month: "January", data: [12, 19, 3, 5, 2, 3] },
  { month: "February", data: [10, 15, 8, 7, 6, 4] },
  { month: "March", data: [14, 11, 6, 9, 5, 7] },
  { month: "April", data: [9, 13, 7, 8, 3, 6] },
  { month: "May", data: [16, 12, 5, 10, 4, 8] },
  { month: "June", data: [11, 17, 4, 6, 7, 5] },
  { month: "July", data: [13, 14, 9, 7, 8, 6] },
  { month: "August", data: [15, 10, 6, 8, 9, 7] },
  { month: "September", data: [12, 18, 7, 5, 6, 8] },
  { month: "October", data: [14, 16, 5, 9, 7, 4] },
  { month: "November", data: [10, 13, 8, 6, 5, 9] },
  { month: "December", data: [17, 12, 6, 8, 7, 5] },
];

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
};

const cores = [
  "#ff9d00ff",
  "#ff00ddff",
  "#22ff00ff",
  "#ffff00ff",
  "#00ffc8ff",
  "#007affff",
];

const categorias = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];

const Resumo = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const pieData = categorias.map((label, i) => ({
    name: label,
    population: monthData[currentMonth].data[i],
    color: cores[i % cores.length],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  return (
    <ThemedView style={styles.container} safe={false}>
      <View style={styles.monthRow}>
        <Text
          style={styles.arrow}
          onPress={() => setCurrentMonth((currentMonth - 1 + 12) % 12)}
        >
          {"<"}
        </Text>
        <Text style={styles.monthLabel}>{monthData[currentMonth].month}</Text>
        <Text
          style={styles.arrow}
          onPress={() => setCurrentMonth((currentMonth + 1) % 12)}
        >
          {">"}
        </Text>
      </View>
      <PieChart
        data={pieData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 10]}
      />
    </ThemedView>
  );
};

export default Resumo;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    fontSize: 24,
    paddingHorizontal: 16,
    color: "#007AFF",
    fontWeight: "bold",
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});
