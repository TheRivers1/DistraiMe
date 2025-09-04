import ThemedView from "@components/ThemedView";
import { Text, StyleSheet, View } from "react-native";
import ThemedButton from "@components/ThemedButton";
import { Colors } from "constants/Colors";
import { useEffect, useState } from "react";
import { supabase } from "lib/supabase";

export default function Help() {
  const [dicas, setDicas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDicaIdx, setCurrentDicaIdx] = useState<number | null>(null);

  useEffect(() => {
    const fetchDicas = async () => {
      const { data, error } = await supabase.from("dicas").select("*");
      if (error) {
        console.error(error);
        setDicas([]);
        setCurrentDicaIdx(null);
      } else {
        setDicas(data || []);
        if (data && data.length > 0) {
          setCurrentDicaIdx(Math.floor(Math.random() * data.length));
        }
      }
      setLoading(false);
    };
    fetchDicas();
  }, []);

  const handleNextDica = () => {
    if (dicas.length > 1) {
      let newIdx;
      do {
        newIdx = Math.floor(Math.random() * dicas.length);
      } while (newIdx === currentDicaIdx);
      setCurrentDicaIdx(newIdx);
    } else if (dicas.length === 1) {
      setCurrentDicaIdx(0);
    }
  };

  return (
    <ThemedView style={styles.container} safe={true}>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        currentDicaIdx !== null &&
        dicas[currentDicaIdx] && (
          <View style={styles.content}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.headingNumber}>
                #{dicas[currentDicaIdx].id}
              </Text>
              <Text style={styles.heading}>{dicas[currentDicaIdx].titulo}</Text>
            </View>
            <Text style={styles.category}>{dicas[currentDicaIdx].tipo}</Text>
            <Text style={styles.text}>{dicas[currentDicaIdx].descricao}</Text>
          </View>
        )
      )}
      <View>
        <ThemedButton style={styles.btnStyle} onPress={handleNextDica}>
          <Text style={{ color: "#fff", fontSize: 18 }}>PRÓXIMA DICA</Text>
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    margin: "5%",
  },
  content: {
    width: "100%",
    height: "90%",
    justifyContent: "center",
  },
  headingNumber: {
    fontSize: 50,
    color: Colors.primary,
    marginLeft: "3%",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 24,
    marginLeft: "5%",
    flex: 1,
    flexShrink: 1,
  },
  category: {
    fontSize: 18,
    marginLeft: "5%",
    marginTop: "5%",
    color: "#909090",
  },
  text: {
    fontSize: 20,
    margin: 20,
  },
  btnStyle: {
    padding: 10,
    marginVertical: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
  },
});
