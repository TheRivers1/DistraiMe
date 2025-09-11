import { StyleSheet, View, Alert, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { supabase } from "lib/supabase";
import { router } from "expo-router";
import { useState, useEffect, useContext } from "react";
import { Button, Input } from "@rneui/themed";
import { AuthContext } from "app/_layout";
import Avatar from "@components/Avatar";
import ThemedButton from "@components/ThemedButton";
import { Colors } from "constants/Colors";

async function signOut() {
  const { error } = await supabase.auth.signOut();
  router.push("../(auth)/login");
}

export default function profile() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const { session } = useContext(AuthContext);

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
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setUsername(data.name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
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
      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
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
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? "A carregar ..." : "Atualizar"}
          onPress={() => updateProfile({ username, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>
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
});
