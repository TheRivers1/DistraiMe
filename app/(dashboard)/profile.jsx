import { StyleSheet, Text, View } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedView from "../../components/ThemedView";

const Profile = () => {
  return (
    <ThemedView style={styles.container} safe={true}>
      <Text style={styles.heading}>Your Email</Text>
      <Spacer />
      <Text>Time to start saving some money...</Text>
      <Spacer />
    </ThemedView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
