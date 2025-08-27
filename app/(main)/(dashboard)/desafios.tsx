import { StyleSheet, Text } from "react-native";
import ThemedView from "@components/ThemedView";
import { useEffect, useState } from "react";
import { supabase } from "lib/supabase";

const Desafios = () => {
  const [desafios, setDesafios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesafios = async () => {
      const { data, error } = await supabase.from("desafios").select("*");
      if (error) {
        console.error(error);
        setDesafios([]);
      } else {
        setDesafios(data || []);
      }
      setLoading(false);
    };
    fetchDesafios();
  }, []);

  return (
    <ThemedView style={styles.container} safe={false}>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        desafios.map((desafio, idx) => (
          <ThemedView safe={false} style={styles.desafio} key={desafio.id || idx}>
            <Text style={styles.heading}>{desafio.titulo || `Desafio #${idx + 1}`}</Text>
            <Text style={styles.description}>{desafio.descricao || "Sem descrição."}</Text>
          </ThemedView>
        ))
      )}
    </ThemedView>
  );
};

export default Desafios;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "left",
    margin: 10,
  },
  description: {
    fontSize: 14,
    textAlign: "left",
    marginLeft: 10,
  },
  desafio: {
    borderWidth: 2,
    borderColor: "#b6b6b6",
    borderStyle: "solid",
    borderRadius: 12,
    width: "90%",
    height: 150,
    margin: 15,
  },
});