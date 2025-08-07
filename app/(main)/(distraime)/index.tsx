import { StyleSheet, Text } from "react-native";
import { Slot, useRouter, usePathname } from "expo-router";
import { Colors } from "constants/Colors";
import Separator from "@components/Separator";
import ThemedView from "@components/ThemedView";
import ThemedButton from "@components/ThemedButton";

const landing_page = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (page) => pathname.endsWith(page);

  return (
    <>
      <ThemedView style={[styles.header, { paddingBottom: 0 }]} safe={true}>
        <ThemedView style={styles.row} safe={false}>
          <ThemedButton
            style={[
              styles.btnStyle,
              isActive("breathing") && styles.activeButton,
            ]}
            onPress={() => router.replace("/(main)/(distraime)/breathing")}
          >
            <Text style={styles.btnText}>Exercicio de Respiração</Text>
          </ThemedButton>
          <ThemedButton
            style={[styles.btnStyle, isActive("game") && styles.activeButton]}
            onPress={() => router.replace("/(main)/(distraime)/game")}
          >
            <Text style={styles.btnText}>Jogo</Text>
          </ThemedButton>
          <ThemedButton
            style={[
              styles.btnStyle,
              isActive("reading") && styles.activeButton,
            ]}
            onPress={() => router.replace("/(main)/(distraime)/reading")}
          >
            <Text style={styles.btnText}>Leitura</Text>
          </ThemedButton>
        </ThemedView>
        <Separator />
      </ThemedView>
      <ThemedView style={styles.container} safe={false}></ThemedView>
    </>
  );
};

export default landing_page;

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
    margin: 20,
  },
  container: {
    flex: 1,
    alignSelf: "stretch",
  },
  heading: {
    fontSize: 24,
    textAlign: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
  },
  btnText: {
    marginHorizontal: 10,
    color: "#f2f2f2",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  btnStyle: {
    padding: 10,
    marginVertical: 20,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  activeButton: {
    backgroundColor: Colors.tabColor,
  },
});
