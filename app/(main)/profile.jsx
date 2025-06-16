import { StyleSheet, Text} from "react-native";
import { useUser } from "../../hooks/useUser";
import Spacer from "@components/Spacer";
import ThemedView from "@components/ThemedView";
import ThemedButton from "@components/ThemedButton";

const Profile = () => {
  const { logout, user } = useUser();

  return (
    <ThemedView style={styles.container} safe={true}>
      <Text style={styles.heading}>{user.email}</Text>
      <Spacer />
      <Text>Time to start saving some money...</Text>
      <Spacer />

      <ThemedButton onPress={logout}>
        <Text style={{color:"#f2f2f2"}}>
          Logout
        </Text>
      </ThemedButton>
    </ThemedView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
