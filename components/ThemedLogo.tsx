import { Image, Text, View, StyleSheet} from "react-native";
import Logo from "../assets/distraime_logo.png";

const ThemedLogo = () => {
  return (
    <View style={styles.topContent}>
      <Image source={Logo} style={styles.image} />
      <Text style={styles.title}>DISTRAI-ME!</Text>
      <Text style={{ color: "black", marginBottom: 15 }}>®</Text>
    </View>
  );
};

export default ThemedLogo;

const styles = StyleSheet.create({
  topContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "black",
  },
  image: {
    marginVertical: 20,
    height: 80,
    width: 80,
  },
});
