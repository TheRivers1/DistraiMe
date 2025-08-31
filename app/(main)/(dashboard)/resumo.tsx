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

  // all categories fetched from DB (nome)
  const [categories, setCategories] = useState<{ id: string; nome: string }[]>(
    []
  );

  // pieData includes all categories (with zero values if needed) — used for legend
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

  const total = pieData.reduce((sum, p) => sum + (p.population || 0), 0);
  const topAmount = topCategory
    ? pieData.find((p) => p.name === topCategory)?.population ?? 0
    : pieData[0]?.population ?? 0;
  const topPct = total > 0 ? ((topAmount / total) * 100).toFixed(1) : "0.0";

  useEffect(() => {
    let mounted = true;
    async function loadMonth() {
      setLoading(true);

      // fetch categories first
      const { data: catData, error: catError } = await supabase
        .from("categoria")
        .select("id, nome")
        .order("nome", { ascending: true });

      if (!mounted) return;
      if (catError) {
        console.warn("categories fetch error", catError);
        setCategories([]);
      } else {
        setCategories((catData ?? []) as { id: string; nome: string }[]);
      }

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

      const year = new Date().getFullYear();
      const startLocal = new Date(year, currentMonth, 1);
      const endLocal = new Date(year, currentMonth + 1, 1);

      const start = startLocal.toLocaleString("sv-SE").replace(" ", "T");
      const end = endLocal.toLocaleString("sv-SE").replace(" ", "T");

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

      const totals: Record<string, number> = {};
      if (catData && Array.isArray(catData)) {
        (catData as any[]).forEach((c) => {
          const nome = c?.nome ?? "Sem categoria";
          totals[nome] = 0;
        });
      }

      (data ?? []).forEach((item: any) => {
        const cat = item?.categoria?.nome ?? "Sem categoria";
        const amt = parseFloat(String(item?.valor)) || 0;
        totals[cat] = (totals[cat] || 0) + amt;
      });

      // build entries in the order of categories (so legend is stable)
      const orderedEntries: [string, number][] = [];
      if (catData && Array.isArray(catData)) {
        (catData as any[]).forEach((c) => {
          const nome = c?.nome ?? "Sem categoria";
          orderedEntries.push([nome, totals[nome] ?? 0]);
        });
      }

      // include any extra categories that appear in totals but not in categoria table
      Object.keys(totals).forEach((k) => {
        if (!orderedEntries.find((e) => e[0] === k)) {
          orderedEntries.push([k, totals[k]]);
        }
      });

      const built = orderedEntries.map(([name, totalValue], i) => ({
        name,
        population: totalValue,
        color: cores[i % cores.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      }));

      setPieData(built);
      const sortedByValue = [...orderedEntries].sort((a, b) => b[1] - a[1]);
      setTopCategory(sortedByValue[0]?.[1] > 0 ? sortedByValue[0][0] : null);
      setLoading(false);
    }

    loadMonth();
    return () => {
      mounted = false;
    };
  }, [currentMonth]);

  // chart should receive only slices with value > 0 (optional)
  const chartData = pieData.filter((p) => (p.population ?? 0) > 0);

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
      ) : total === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.congrats}>Parabéns!</Text>
          <Text style={styles.message}>
            Não há gastos registados para este mês.
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.topLabel}>
            Categoria com maior gasto: {`${topCategory} • ${topPct}%`}
          </Text>
          <Text style={styles.topLabel}>
            Total Gasto {`• ${total.toFixed(2)}€`}
          </Text>

          <PieChart
            data={chartData}
            width={Math.min(screenWidth - 32, 420)}
            height={260}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"0"}
            center={[100, 0]}
            absolute
            hasLegend={false}
          />

          <View style={styles.legendContainer}>
            {pieData.map((item) => {
              return (
                <View key={item.name} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColorBox,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={styles.legendLabel}>{item.name}</Text>
                  <Text style={styles.legendValue}>
                    {`${item.population} €`}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      )}
    </ThemedView>
  );
};

export default Resumo;

const styles = StyleSheet.create({
  legendContainer: {
    marginTop: 12,
    width: "95%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  legendItem: {
    width: "49%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.03)",
    marginBottom: 8,
  },
  legendColorBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 4,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 1,
    flex: 1,
  },
  legendValue: {
    fontSize: 13,
    color: "#6b6b6b",
    textAlign: "right",
  },
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
