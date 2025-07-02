import { StyleSheet, Text} from "react-native";
import Spacer from "@components/Spacer";
import ThemedView from "@components/ThemedView";
import ThemedButton from "@components/ThemedButton";
import { supabase } from "lib/supabase";
import { router } from "expo-router";

async function signOut() {
  const { error } = await supabase.auth.signOut()
  router.push("../(auth)/login")
}

const Profile = () => {
  return (
    <ThemedView style={styles.container} safe={true}>
      <Text style={styles.heading}></Text>
      <Spacer />
      <Text>Time to start saving some money...</Text>
      <Spacer />

      <ThemedButton style={undefined} onPress={signOut}>
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
