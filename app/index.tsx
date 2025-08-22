import { StyleSheet, Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import { Colors } from "../constants/Colors";
import ThemedLogo from "@components/ThemedLogo";
import Spacer from "@components/Spacer";

const Home = () => {
  return (
    <View style={styles.container}>
      <ThemedLogo />
      <View style={styles.content}>
        <Spacer height={200} />
        <Text style={styles.middleTittle}>Bem-Vindo</Text>
        <Text style={styles.middleText}>
          Regista-te para começares a tua jornada no controlo dos impulsos e na
          conquista dos teus objetivos.
        </Text>
      </View>
      <View style={styles.bottomButtons}>
        <Link
          href="/(auth)/login"
          style={{ backgroundColor: "#404040" }}
          asChild
        >
          <Pressable style={styles.bottomBtn}>
            <Text style={styles.bottomBtnText}>LOG IN</Text>
          </Pressable>
        </Link>
        <Link
          href="/(auth)/register"
          style={{ backgroundColor: Colors.primary }}
          asChild
        >
          <Pressable style={styles.bottomBtn}>
            <Text style={styles.bottomBtnText}>REGISTO</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginLeft: 10,
    color: "black",
  },
  bottomBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0,
    height: "100%",
  },
  bottomBtnText: {
    color: "#fff",
    fontWeight: "semibold",
    fontSize: 24,
    textAlign: "center",
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginTop: 70,
  },
  bottomButtons: {
    position: "absolute",
    flexDirection: "row",
    width: "100%",
    bottom: 0,
    left: 0,
    height: 90,
    borderWidth: 1,
  },
  middleTittle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
    padding: 5,
  },
  middleText: {
    color: "#fff",
    fontWeight: "normal",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
    padding: 3,
    width: 390,
  },
});
