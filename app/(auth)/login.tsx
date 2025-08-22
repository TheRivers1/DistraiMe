import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Colors } from "../../constants/Colors";
import ThemedLogo from "@components/ThemedLogo";
import Spacer from "@components/Spacer";
import ThemedButton from "@components/ThemedButton";
import ThemedView from "@components/ThemedView";
import ThemedTextInput from "@components/ThemedTextInput";
import { supabase } from "lib/supabase";
import ThemedLoader from "@components/ThemedLoader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signInWithEmail(email: string, password: string) {
    setLoading(true);
    const {
      error,
      data: { session },
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(error);
    if (session) {
      router.push("/(distraime)");
    }
  }

  const handleSubmit = async () => {
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {loading ? (
        <ThemedLoader />
      ) : (
        <ThemedView style={styles.container} safe={false}>
          <ThemedLogo />
          <Spacer />
          <Text style={styles.title}>Login to Your Account</Text>

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 20 }}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 20 }}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            onChangeText={setPassword}
            value={password}
          />

          <ThemedButton onPress={handleSubmit} style={undefined}>
            <Text style={{ color: "#f2f2f2" }}>Login</Text>
          </ThemedButton>

          <Spacer />

          <Spacer height={100} />
          <Link href="/(auth)/register">
            <Text style={styles.linkText}>Register instead</Text>
          </Link>
        </ThemedView>
      )}
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "center",
    backgroundColor: "#fff",
  },
  linkText: {
    textAlign: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30,
  },
  btn: {
    padding: 15,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.8,
  },
  error: {
    color: Colors.warning,
    padding: 10,
    backgroundColor: "#f5c1c8",
    borderColor: Colors.warning,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 10,
  },
});
