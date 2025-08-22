import { StyleSheet, Text } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Colors } from "constants/Colors";
import ThemedView from "@components/ThemedView";
import ThemedButton from "@components/ThemedButton";
import Spacer from "@components/Spacer";

const landing_page = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (page) => pathname.endsWith(page);

  return (
    <>
      <ThemedView style={styles.container} safe={false}>
        <Text style={styles.heading}>DISTRAI-ME!</Text>
        <Spacer />
        <ThemedButton
          style={styles.btnStyle}
          onPress={() => router.push("/(main)/(distraime)/game")}
        >
          <Text style={styles.btnText}>Jogo</Text>
        </ThemedButton>
        <ThemedButton
          style={styles.btnStyle}
          onPress={() => router.push("/(main)/(distraime)/reading")}
        >
          <Text style={styles.btnText}>Leitura</Text>
        </ThemedButton>
        <ThemedButton
          style={styles.btnStyle}
          onPress={() => router.push("/(main)/(distraime)/breathing")}
        >
          <Text style={styles.btnText}>Respiração</Text>
        </ThemedButton>
      </ThemedView>
    </>
  );
};

export default landing_page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 50,
    textAlign: "center",
    fontWeight: "bold",
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
    fontSize: 20,
    fontWeight: "bold",
  },
  btnStyle: {
    padding: 14,
    marginVertical: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    borderRadius: 16,
  },
});
