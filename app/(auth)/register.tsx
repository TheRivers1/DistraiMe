import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import ThemedLogo from "@components/ThemedLogo";
import Spacer from "@components/Spacer";
import ThemedButton from "@components/ThemedButton";
import ThemedView from "@components/ThemedView";
import ThemedTextInput from "@components/ThemedTextInput";
import { supabase } from "lib/supabase";
import { useState } from "react";

const Register = () => {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    if (error) Alert.alert(error.message)
    if (session) router.push("/resumo");
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedLogo />
        <Spacer />
        <Text style={styles.title}>Register a New Account</Text>

        <ThemedTextInput
          style={{ width: "80%", marginBottom: 20 }}
          placeholder="Nome"
          onChangeText={setNome}
          value={nome}
        />

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

        <ThemedButton onPress={signUpWithEmail} style={undefined}>
          <Text style={{ color: "#f2f2f2" }}>Register</Text>
        </ThemedButton>

        <Spacer />

        <Spacer height={100} />
        <Link href="/(auth)/login">
          <Text style={styles.linkText}>Login instead</Text>
        </Link>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

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
