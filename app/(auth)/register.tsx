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
import ThemedLoader from "@components/ThemedLoader";

const Register = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    try {
      setLoading(true);
      const {
        data: { user, session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert(error.message);
        return;
      }

      if (user) {
        // Atualizar o nome na tabela "utilizadores" (já criada pelo trigger)
        const { error: updateError } = await supabase
          .from("utilizadores")
          .update({
            name: nome,
          })
          .eq("user_id", user.id);

        if (updateError) {
          Alert.alert("Erro a atualizar perfil: " + updateError.message);
        }
      }

      if (session) {
        router.push("/resumo");
      } else {
        Alert.alert("Verifique a sua caixa de entrada para confirmar o email!");
      }
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {loading ? (
        <ThemedLoader />
      ) : (
        <ThemedView style={styles.container} safe={false}>
          <ThemedLogo />
          <Spacer />
          <Text style={styles.title}>Registar uma conta nova</Text>

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 20 }}
            placeholder="Nome"
            placeholderTextColor="#5c5c5c"
            onChangeText={setNome}
            value={nome}
          />

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 20 }}
            placeholder="Email"
            placeholderTextColor="#5c5c5c"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 20 }}
            placeholder="Palavra-passe"
            placeholderTextColor="#5c5c5c"
            secureTextEntry
            autoCapitalize="none"
            onChangeText={setPassword}
            value={password}
          />

          <ThemedButton onPress={signUpWithEmail} style={undefined}>
            <Text style={{ color: "#f2f2f2" }}>Registar</Text>
          </ThemedButton>

          <Spacer />

          <Spacer height={100} />
          <Link href="/(auth)/login">
            <Text style={styles.linkText}>
              Já tem conta? Faça aqui o login!
            </Text>
          </Link>
        </ThemedView>
      )}
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
    color: Colors.textColor,
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
