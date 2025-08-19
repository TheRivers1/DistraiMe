import { StyleSheet, Text, Modal, SafeAreaView } from "react-native";
import ThemedView from "@components/ThemedView";

const Desafios = () => {
  return (
    <ThemedView style={styles.container} safe={false}>
      <Text style={styles.heading}>Desafios</Text>
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
    fontSize: 26,
    textAlign: "center",
  },
});
