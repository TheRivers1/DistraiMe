import { StyleSheet, View, Alert, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { supabase } from "lib/supabase";
import { router } from "expo-router";
import { useState, useEffect, useContext } from "react";
import { Button, Input } from "@rneui/themed";
import { AuthContext } from "app/_layout";
import Avatar from "@components/Avatar";
import { Colors } from "constants/Colors";

async function signOut() {
  await supabase.auth.signOut();
  router.push("../(auth)/login");
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const { session } = useContext(AuthContext);

  // --- estados para alteração de password ---
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");
      const { data, error, status } = await supabase
        .from("utilizadores")
        .select("name, avatar_url")
        .eq("user_id", session?.user.id)
        .single();
      if (error && status !== 406) throw error;
      if (data) {
        setUsername(data.name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");
      const updates = {
        user_id: session?.user.id,
        name: username,
        avatar_url,
      };
      const { error } = await supabase.from("utilizadores").upsert(updates);
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword() {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Erro", "Preenche ambos os campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As palavras-passe não coincidem.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      Alert.alert("Sucesso", "A palavra-passe foi atualizada.");
      setPasswordModalVisible(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error instanceof Error) Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoutButton}>
        <Text style={styles.logoutIcon} onPress={() => signOut()}>
          <Feather name="log-out" size={30} color={Colors.primary} />
        </Text>
      </View>
      <View>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({ username, avatar_url: url });
          }}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Nome"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View>

      {/* --- Botão para alterar password --- */}
      <View style={styles.verticallySpaced}>
        <Button
          title="Alterar Palavra-passe"
          onPress={() => setPasswordModalVisible(true)}
          buttonStyle={styles.passwordButton}
          titleStyle={styles.passwordButtonText}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? "A carregar ..." : "Atualizar"}
          onPress={() => updateProfile({ username, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      {/* --- Modal da alteração de password --- */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Palavra-passe</Text>

            {/* Campo Nova Password */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Nova palavra-passe"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => setShowNewPassword((prev) => !prev)}
              >
                <Feather
                  name={showNewPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>

            {/* Campo Confirmar Password */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirmar palavra-passe"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => setShowConfirmPassword((prev) => !prev)}
              >
                <Feather
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <Button
                title="Cancelar"
                type="outline"
                containerStyle={{ flex: 1, marginRight: 8 }}
                onPress={() => setPasswordModalVisible(false)}
              />
              <Button
                title="Guardar"
                containerStyle={{ flex: 1, marginLeft: 8 }}
                onPress={handleChangePassword}
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  logoutButton: {
    position: "absolute",
    top: "10%",
    right: 10,
  },
  logoutIcon: {
    width: 70,
    height: 70,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  iconWrapper: {
    marginLeft: 8,
  },
  passwordButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 10,
    alignSelf: "stretch",   // ocupa a largura toda como o botão Atualizar
  },
  passwordButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
