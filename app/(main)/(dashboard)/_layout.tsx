import { StyleSheet, Text } from "react-native";
import { Slot, useRouter, usePathname } from "expo-router";
import { Colors } from "constants/Colors";
import Separator from "@components/Separator";
import ThemedView from "@components/ThemedView";
import ThemedButton from "@components/ThemedButton";

const Dashboard = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (page) => pathname.endsWith(page);

  return (
    <>
      <ThemedView style={[styles.header, { paddingBottom: 0 }]} safe={true}>
        <Text style={styles.heading}>Bem vindo de volta</Text>
        <Text style={styles.text}></Text>
        <ThemedView style={styles.row} safe={false}>
          <ThemedButton
            style={[
              styles.btnStyle,
              isActive("desafios") && styles.activeButton,
            ]}
            onPress={() => router.replace("/(main)/(dashboard)/desafios")}
          >
            <Text style={styles.btnText}>DESAFIOS</Text>
          </ThemedButton>
          <ThemedButton
            style={[styles.btnStyle, isActive("resumo") && styles.activeButton]}
            onPress={() => router.replace("/(main)/(dashboard)/resumo")}
          >
            <Text style={styles.btnText}>RESUMO</Text>
          </ThemedButton>
          <ThemedButton
            style={[styles.btnStyle, isActive("gastos") && styles.activeButton]}
            onPress={() => router.replace("/(main)/(dashboard)/gastos")}
          >
            <Text style={styles.btnText}>GASTOS</Text>
          </ThemedButton>
        </ThemedView>
        <Separator />
      </ThemedView>
      <ThemedView style={styles.container} safe={false}>
        <Slot />
      </ThemedView>
    </>
  );
};

export default Dashboard;

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
