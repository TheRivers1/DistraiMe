import { StyleSheet, Text, Modal, SafeAreaView } from "react-native";
import { useState } from "react";
import { Colors } from "constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import ThemedView from "@components/ThemedView";
import ThemedTextInput from "@components/ThemedTextInput";
import ThemedButton from "@components/ThemedButton";
import ThemedDropDown from "@components/ThemedDropDown";

const Gastos = () => {
  const [visible, setVisible] = useState(false);
  const [selectedFruit, setSelectedFruit] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <ThemedView style={styles.container} safe={false}>
      <ThemedButton style={styles.btnAdd} onPress={show}>
        <Ionicons
          size={26}
          name={"add-circle-sharp"}
          color={Colors.iconColor}
        />
        <Text style={styles.btnText}>Adicionar novo gasto</Text>
      </ThemedButton>

      <Modal visible={visible} animationType="slide" onRequestClose={hide}>
        <SafeAreaView style={styles.modal}>
          <Text style={[styles.heading, { margin: 20 }]}>Nova Despesa</Text>
          <ThemedTextInput
            style={{ width: "80%", marginBottom: 20 }}
            placeholder="Nome"
            keyboardType="default"
            autoCapitalize="none"
          />

          <ThemedDropDown
            value={selectedFruit}
            onChange={setSelectedFruit}
            items={[
              { label: "Apple", value: "apple" },
              { label: "Banana", value: "banana" },
            ]}
            placeholder="Selecione uma categoria"
            style={{ width: "100%", marginBottom: 20 }}
            textStyle={{}}
            optionStyle={{}}
            optionTextStyle={{}}
          />

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 20 }}
            placeholder="Quantia"
            keyboardType="decimal-pad"
          />

          <ThemedTextInput
            style={{
              width: "80%",
              marginBottom: 20,
              height: 100,
            }}
            placeholder="Descrição"
            multiline
            autoCapitalize="none"
          />
          <ThemedButton style={[styles.btnAdd, { width: "50%" }]}>
            <Text style={styles.btnText}>Adicionar</Text>
          </ThemedButton>
          <Link href="" onPress={hide}>
            <Text
              style={[
                styles.btnText,
                { color: Colors.warning, fontWeight: "normal" },
              ]}
            >
              Cancelar
            </Text>
          </Link>
        </SafeAreaView>
      </Modal>

      <ThemedView style={false} safe={false}>
        <Text>Ainda sem gastos, parabéns!</Text>
      </ThemedView>
    </ThemedView>
  );
};

export default Gastos;

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
    marginBottom: 20,
  },
  btnText: {
    color: "#f2f2f2",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  modal: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
});
