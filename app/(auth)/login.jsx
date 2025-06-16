import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { Colors } from "../../constants/Colors";
import ThemedLogo from "@components/ThemedLogo";
import Spacer from "@components/Spacer";
import ThemedButton from "@components/ThemedButton";
import ThemedView from "@components/ThemedView";
import ThemedTextInput from "@components/ThemedTextInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null)

  const { login } = useUser();

  const handleSubmit = async () => {
    setError(null)

    try {
      await login(email, password);
    } catch (error) {
      setError(error.message)
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedLogo />
        <Spacer />
        <Text style={styles.title}>Login to Your Account</Text>

        <ThemedTextInput
          style={{ width: "80%", marginBottom: 20 }}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize='none'
          onChangeText={setEmail}
          value={email}
        />

        <ThemedTextInput
          style={{ width: "80%", marginBottom: 20 }}
          placeholder="Password"
          secureTextEntry
          autoCapitalize='none'
          onChangeText={setPassword}
          value={password}
        />

        <ThemedButton onPress={handleSubmit}>
          <Text style={{ color: "#f2f2f2" }}>Login</Text>
        </ThemedButton>

        <Spacer/>
        {error && <Text style={styles.error}>{error}</Text>}

        <Spacer height={100} />
        <Link href="/(auth)/register">
          <Text style={styles.linkText}>Register instead</Text>
        </Link>

      </ThemedView>
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
  }
});
