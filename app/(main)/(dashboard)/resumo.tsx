import { StyleSheet, Dimensions, View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import ThemedView from "@components/ThemedView";
import { useEffect, useState } from "react";
import { supabase } from "lib/supabase";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

const cores = [
  "#a50000ff",
  "#ff5e00ff",
  "#ffc400ff",
  "#55e700ff",
  "#009414ff",
  "#00eeffff",
  "#00a2d3ff",
  "#0066ffff",
  "#0300a3ff",
];

const Resumo = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0..11
  const [loading, setLoading] = useState(false);
  const [pieData, setPieData] = useState<
    {
      name: string;
      population: number;
      color: string;
      legendFontColor: string;
      legendFontSize: number;
    }[]
  >([]);
  const [topCategory, setTopCategory] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadMonth() {
      setLoading(true);
      // get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (mounted) {
          setPieData([]);
          setTopCategory(null);
          setLoading(false);
        }
        return;
      }

      // compute month range (ISO)
      const year = new Date().getFullYear();
      const start = new Date(year, currentMonth, 1).toISOString();
      const end = new Date(year, currentMonth + 1, 1).toISOString();

      // fetch transactions for user in month
      const { data, error } = await supabase
        .from("gastos")
        .select("valor, categoria!inner( nome )")
        .eq("user_id", user.id)
        .gte("data_gasto", start)
        .lt("data_gasto", end);

      if (!mounted) return;
      if (error) {
        console.warn("supabase fetch error", error);
        setPieData([]);
        setTopCategory(null);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setPieData([]);
        setTopCategory(null);
        setLoading(false);
        return;
      }

      // aggregate totals by category
      const totals: Record<string, number> = {};
      data.forEach((item: any) => {
        const cat = item.categoria.nome;
        const amt = item.valor;
        totals[cat] = (totals[cat] || 0) + amt;
      });

      // build pie data
      const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
      const built = entries.map(([name, total], i) => ({
        name,
        population: total,
        color: cores[i % cores.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      }));

      setPieData(built);
      setTopCategory(entries[0]?.[0] ?? null);
      setLoading(false);
    }

    loadMonth();
    return () => {
      mounted = false;
    };
  }, [currentMonth]);

  return (
    <ThemedView style={styles.container} safe={false}>
      <View style={styles.monthRow}>
        <Text
          style={styles.arrow}
          onPress={() => setCurrentMonth((currentMonth - 1 + 12) % 12)}
        >
          {"<"}
        </Text>
        <Text style={styles.monthLabel}>
          {new Date(new Date().getFullYear(), currentMonth, 1).toLocaleString(
            "pt-PT",
            {
              month: "long",
            }
          )}
        </Text>
        <Text
          style={styles.arrow}
          onPress={() => setCurrentMonth((currentMonth + 1) % 12)}
        >
          {">"}
        </Text>
      </View>

      {loading ? (
        <Text style={styles.message}>A carregar...</Text>
      ) : pieData.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.congrats}>Parabéns!</Text>
          <Text style={styles.message}>
            Não há gastos registados para este mês.
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.topLabel}>
            Categoria com maior gasto: {topCategory}
          </Text>
          <PieChart
            data={pieData}
            width={Math.min(screenWidth - 32, 420)}
            height={260}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 0]}
            absolute
          />
        </>
      )}
    </ThemedView>
  );
};

export default Resumo;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    paddingTop: 16,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
    textTransform: "capitalize",
  },
  topLabel: {
    marginBottom: 8,
    fontWeight: "600",
  },
  congrats: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  message: {
    color: "#6b6b6b",
  },
  emptyBox: {
    alignItems: "center",
    padding: 24,
  },
});
