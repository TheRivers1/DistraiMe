import { StyleSheet, Text, Modal, SafeAreaView } from "react-native";
import { useState } from "react";
import { Colors } from "constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import ThemedView from "@components/ThemedView";
import ThemedTextInput from "@components/ThemedTextInput";
import ThemedButton from "@components/ThemedButton";

const Metas = () => {
  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <ThemedView style={styles.container}>
      <ThemedButton style={styles.btnAdd} onPress={show}>
        <Ionicons
          size={26}
          name={"add-circle-sharp"}
          color={Colors.iconColor}
        />
        <Text style={styles.btnText}>Adicionar nova meta</Text>
      </ThemedButton>

      <Modal visible={visible} animationType="slide" onRequestClose={hide}>
        <SafeAreaView style={[styles.modal, {justifyContent:"center"}]}>
          <Text style={[styles.heading, {margin: 20}]}>Nova meta de poupança..</Text>
          <ThemedTextInput
            style={{ width: "80%", marginBottom: 20 }}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 20 }}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
          />

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 20 }}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 20 }}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
          />
          <ThemedButton style={styles.btnAdd}>
            <Text style={styles.btnText}>Adicionar</Text>
          </ThemedButton>
          <Link href="" onPress={hide}>
            <Text style={[styles.btnText, {color: Colors.warning, fontWeight: "normal"}]}>
              Cancelar
            </Text>
          </Link>
        </SafeAreaView>
      </Modal>

      <ThemedView>
        <Text>Ainda sem metas definidas</Text>
      </ThemedView>
    </ThemedView>
  );
};

export default Metas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 26,
    textAlign: "center",
  },
  btnAdd: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 20,
    marginBottom: 30,
  },
  btnText: {
    color: "#f2f2f2",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  modal: {
    flex: 1,
    backgroundColor: "#DDD",
    alignItems: "center",
  },
});
