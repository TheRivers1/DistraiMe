import { StyleSheet, Text } from "react-native";
import ThemedView from "@components/ThemedView";

const Desafios = () => {
  return (
    <ThemedView style={styles.container} safe={false}>
      <ThemedView safe={false} style={styles.desafio}>
        <Text style={styles.heading}>Desafio #1</Text>
        <Text style={styles.description}>
          Lorem ipsum, ipsum lorem, is a random regenratede text that does a bla
          bla bla
        </Text>
      </ThemedView>
      <ThemedView safe={false} style={styles.desafio}>
        <Text style={styles.heading}>Desafio #2</Text>
        <Text style={styles.description}>
          Lorem ipsum, ipsum lorem, is a random regenratede text that does a bla
          bla bla
        </Text>
      </ThemedView>
      <ThemedView safe={false} style={styles.desafio}>
        <Text style={styles.heading}>Desafio #3</Text>
        <Text style={styles.description}>
          Lorem ipsum, ipsum lorem, is a random regenratede text that does a bla
          bla bla
        </Text>
      </ThemedView>
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
