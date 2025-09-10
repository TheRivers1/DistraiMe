import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import ThemedView from "@components/ThemedView";
import { supabase } from "lib/supabase";
import { Link } from "expo-router";
import { Colors } from "constants/Colors";

export default function Reading() {
  const [leitura, setLeitura] = useState<{
    titulo: string;
    conteudo: string;
    uri: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDicas = async () => {
      const { data, error } = await supabase
        .from("leituras")
        .select("titulo, conteudo, uri");
      if (error) {
        console.error(error);
        setLeitura(null);
      } else if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setLeitura(data[randomIndex]);
      } else {
        setLeitura(null);
      }
      setLoading(false);
    };
    fetchDicas();
  }, []);

  return (
    <ThemedView style={styles.container} safe={true}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : leitura ? (
        <FlatList
          data={[leitura]}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.title}>{item.titulo}</Text>
              <Text style={styles.content}>{item.conteudo}</Text>
              <View>
                <Link href={item.uri} style={styles.uri}>
                  <Text>Clica aqui para leres mais sobre este artigo!</Text>
                </Link>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.header}>Nenhuma leitura encontrada.</Text>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "20%",
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: "5%",
    textAlign: "center",
  },
  item: {
    padding: "5%",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: "5%",
  },
  content: {
    fontSize: 18,
    lineHeight: 20,
    color: "#333",
  },
  uri: {
    margin: "5%",
    color: Colors.tabColor,
    fontWeight: "bold",
  },
});
