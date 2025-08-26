import { StyleSheet, Text, Modal, SafeAreaView, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import ThemedView from "@components/ThemedView";
import ThemedTextInput from "@components/ThemedTextInput";
import ThemedButton from "@components/ThemedButton";
import ThemedDropDown from "@components/ThemedDropDown";
import { supabase } from "lib/supabase";

type Category = { id: string; nome: string };

const Gastos = () => {
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dateInput, setDateInput] = useState(""); // optional "YYYY-MM-DD" or leave empty -> now

  const show = () => setVisible(true);
  const hide = () => {
    setVisible(false);
    clearForm();
  };

  useEffect(() => {
    let mounted = true;
    async function loadCategories() {
      setLoadingCategories(true);
      const { data, error } = await supabase
        .from("categoria")
        .select("id, nome")
        .order("nome", { ascending: true });
      if (!mounted) return;
      if (error) {
        console.warn("categories fetch error", error);
        setCategories([]);
      } else {
        setCategories((data ?? []) as Category[]);
      }
      setLoadingCategories(false);
    }
    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  function clearForm() {
    setSelectedCategory(null);
    setName("");
    setAmount("");
    setDescription("");
    setDateInput("");
  }

  async function handleAddExpense() {
    // validation
    const value = parseFloat(amount.replace(",", "."));
    if (!selectedCategory) {
      console.warn("selecionar categoria");
      return;
    }
    if (isNaN(value) || value <= 0) {
      console.warn("valor inválido");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.warn("user not signed in");
      return;
    }

    const data_gasto = dateInput
      ? new Date(dateInput).toISOString()
      : new Date().toISOString();

    const payload = {
      user_id: user.id,
      categoria_id: selectedCategory,
      data_gasto,
      descricao: description || name || null,
      valor: value,
    };

    const { error } = await supabase.from("gastos").insert([payload]);

    if (error) {
      console.warn("insert error", error);
      return;
    }

    // sucesso
    clearForm();
    setVisible(false);
    // opcional: emitir evento / refetch resumo (não implementado aqui)
  }

  // transform categories for dropdown
  const ddItems = categories.map((c) => ({ label: c.nome, value: c.id }));

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

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={hide}
        transparent={false}
      >
        <SafeAreaView style={styles.modal}>
          <Text style={[styles.heading, { margin: 20 }]}>Nova Despesa</Text>

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 12 }}
            placeholder="Nome (opcional)"
            value={name}
            onChangeText={setName}
            keyboardType="default"
            autoCapitalize="sentences"
          />

          <ThemedDropDown
            value={selectedCategory}
            onChange={setSelectedCategory}
            items={ddItems}
            placeholder={
              loadingCategories
                ? "A carregar categorias..."
                : "Selecione uma categoria"
            }
            style={{ width: "100%", marginBottom: 12 }}
            textStyle={{}}
            optionStyle={{}}
            optionTextStyle={{}}
          />

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 12 }}
            placeholder="Quantia (ex: 12.50)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 12, height: 100 }}
            placeholder="Descrição (opcional)"
            value={description}
            onChangeText={setDescription}
            multiline
            autoCapitalize="sentences"
          />

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 20 }}
            placeholder="Data (YYYY-MM-DD) - opcional"
            value={dateInput}
            onChangeText={setDateInput}
            keyboardType="default"
          />

          <ThemedButton
            style={[styles.btnAdd, { width: "50%" }]}
            onPress={handleAddExpense}
          >
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

      <View style={{ marginTop: 24 }}>
        <Text>Ainda sem gastos, parabéns!</Text>
      </View>
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
