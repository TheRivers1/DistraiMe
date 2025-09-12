// PublicacoesFeed.tsx
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
  ActivityIndicator,
  SafeAreaView,
  useColorScheme,
  Modal,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@rneui/themed";
import ThemedTextInput from "@components/ThemedTextInput";
import ThemedButton from "@components/ThemedButton";
import { Link } from "expo-router";
import { Colors } from "constants/Colors";
import { AuthContext } from "app/_layout";
import ThemedView from "@components/ThemedView";

// ---------- CONFIG (define as env vars em produção) ----------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- TIPOS ----------
type Utilizador = {
  user_id: string;
  name?: string | null;
  avatar_url?: string | null;
};

type Publicacao = {
  id: number;
  user_id: string;
  titulo?: string | null;
  conteudo?: string | null;
  imagem_url?: string | null;
  data_publicacao?: string | null;
  numero_gostos?: number | null;
  numero_comentarios?: number | null;
  utilizador?: Utilizador | null;
  liked?: boolean;
};

type Comentario = {
  id: number;
  conteudo: string;
  data_comentario: string;
  utilizadores?: {
    name?: string;
    avatar_url?: string;
  };
};

// ---------- HELPERS ----------
function timeAgo(iso?: string | null) {
  if (!iso) return "";
  const now = Date.now();
  const then = new Date(iso).getTime();
  const s = Math.max(1, Math.floor((now - then) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString();
}

// ---------- FETCH (paginado, pull-to-refresh) ----------
// Substitui a função fetchFeed inteira por isto
async function fetchFeed({
  limit = 20,
  cursor,
  userId,
}: {
  limit?: number;
  cursor?: string | null;
  userId: string;
}) {
  async function downloadImage(path: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from("user_profiles/pics")
        .download(path);
      if (error) {
        throw error;
      }

      return new Promise((resolve, reject) => {
        const fileReaderInstance = new FileReader();

        fileReaderInstance.onload = () => {
          resolve(fileReaderInstance.result as string);
        };

        fileReaderInstance.onerror = (error) => {
          reject(error);
        };
        fileReaderInstance.readAsDataURL(data);
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
    return null;
  }

  // query que inclui a relação dos gostos (para sabermos se o user gostou)
  let q = supabase
    .from("publicacoes")
    .select(
      `
      id,
      user_id,
      titulo,
      conteudo,
      imagem_url,
      data_publicacao,
      numero_gostos,
      numero_comentarios,
      utilizadores!publicacoes_user_id_fkey(user_id, name, avatar_url),
      gostos_publicacao(user_id)
    `
    )
    .order("data_publicacao", { ascending: false })
    .limit(limit);

  if (cursor) q = q.lt("data_publicacao", cursor);

  const { data, error } = await q;
  if (error) throw error;

  const finalArray: Publicacao[] = [];
  for (const row of data) {
    // obtem imagem do profile (mantive a tua função downloadImage)
    const image = await downloadImage((row as any).utilizadores?.avatar_url);

    // determinamos se o utilizador atual já gostou desta publicação
    let liked = false;
    if (Array.isArray((row as any).gostos_publicacao) && userId) {
      liked = (row as any).gostos_publicacao.some(
        (g: any) => g.user_id === userId
      );
    }

    finalArray.push({
      ...(row as Publicacao),
      utilizador: { ...(row as any).utilizadores, avatar_url: image },
      liked,
    });
  }

  return finalArray;
}

// ---------- COMPONENTE ----------
export default function PublicacoesFeed() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const { session } = useContext(AuthContext);
  const [feed, setFeed] = useState<Publicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const flatRef = useRef<FlatList<Publicacao>>(null);
  const [visible, setVisible] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Publicacao | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());

  const show = () => setVisible(true);
  const hide = () => {
    setVisible(false);
    clearForm();
  };

  function clearForm() {
    setTitulo("");
    setConteudo("");
  }

  const loadInitial = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchFeed({ limit: 20, userId: session.user.id });
      setFeed(data);
      setCursor(
        data.length ? data[data.length - 1].data_publicacao ?? null : null
      );
    } catch (err: any) {
      console.error("Erro a carregar feed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await fetchFeed({ limit: 20, userId: session.user.id });
      setFeed(data);
      setCursor(
        data.length ? data[data.length - 1].data_publicacao ?? null : null
      );
    } catch (err: any) {
      console.error("Erro refresh", err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!cursor) return; // sem cursor não há mais
    try {
      const data = await fetchFeed({
        limit: 20,
        cursor,
        userId: session.user.id,
      });
      if (data.length === 0) {
        setCursor(null);
        return;
      }
      setFeed((p) => [...p, ...data]);
      setCursor(data[data.length - 1].data_publicacao ?? null);
    } catch (err: any) {
      console.error("Erro loadMore", err);
    }
  }, [cursor]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  async function handleAddExpense() {
    if (!titulo) {
      console.warn("Tem de escrever um titulo");
      return;
    }
    if (!conteudo) {
      console.warn("Tem de inserir conteúdo");
      return;
    }

    const payload = {
      user_id: session.user.id,
      titulo: titulo,
      conteudo: conteudo,
      data_publicacao: new Date().toISOString(),
      numero_gostos: 0,
      numero_comentarios: 0,
    };

    const { error } = await supabase.from("publicacoes").insert([payload]);

    if (error) {
      console.warn("insert error", error);
      return;
    }

    // sucesso
    clearForm();
    setVisible(false);
    onRefresh();
  }

  async function toggleLike(post: Publicacao) {
    try {
      if (post.liked) {
        // remover like
        await supabase
          .from("gostos_publicacao")
          .delete()
          .match({ publicacao_id: post.id, user_id: session.user.id });
        await supabase
          .from("publicacoes")
          .update({ numero_gostos: (post.numero_gostos || 1) - 1 })
          .eq("id", post.id);
        setFeed((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? {
                  ...p,
                  liked: false,
                  numero_gostos: (p.numero_gostos || 1) - 1,
                }
              : p
          )
        );
      } else {
        // adicionar like
        await supabase
          .from("gostos_publicacao")
          .insert({ publicacao_id: post.id, user_id: session.user.id });
        await supabase
          .from("publicacoes")
          .update({ numero_gostos: (post.numero_gostos || 0) + 1 })
          .eq("id", post.id);
        setFeed((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? { ...p, liked: true, numero_gostos: (p.numero_gostos || 0) + 1 }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Erro toggleLike", err);
    }
  }

  async function openComments(post: Publicacao) {
    setSelectedPost(post);
    setCommentsVisible(true);
    await loadComments(post.id);
  }

  async function loadComments(publicacaoId: number) {
    try {
      const { data, error } = await supabase
        .from("comentarios_publicacao")
        .select(
          `
        id,
        conteudo,
        data_comentario,
        utilizadores:user_id(name, avatar_url)
      `
        )
        .eq("publicacao_id", publicacaoId)
        .order("data_comentario", { ascending: false });

      if (error) throw error;

      // Função para baixar imagem da storage
      async function downloadImage(
        path?: string | null
      ): Promise<string | null> {
        if (!path) return null;
        try {
          const { data, error } = await supabase.storage
            .from("user_profiles/pics")
            .download(path);
          if (error) throw error;

          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(data);
          });
        } catch (err) {
          console.error("Erro a baixar avatar:", err);
          return null;
        }
      }

      // Processa cada comentário e substitui avatar_url pelo data URL
      const finalComments = await Promise.all(
        (data || []).map(async (c: any) => {
          const image = await downloadImage(c.utilizadores?.avatar_url);
          return {
            ...c,
            utilizadores: { ...c.utilizadores, avatar_url: image },
          };
        })
      );

      setComments(finalComments);
    } catch (err) {
      console.error("Erro a carregar comentários", err);
    }
  }

  async function handleAddComment() {
    if (!newComment.trim() || !selectedPost) return;

    try {
      const { error } = await supabase.from("comentarios_publicacao").insert({
        publicacao_id: selectedPost.id,
        user_id: session.user.id,
        conteudo: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
      await loadComments(selectedPost.id); // refresh lista
    } catch (err) {
      console.error("Erro ao adicionar comentário", err);
    }
  }

  function toggleExpanded(postId: number) {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }

  const renderComment = ({ item }: { item: Comentario }) => {
    console.log("Item recebido no render:", item);

    const avatar =
      item.utilizadores?.avatar_url || "https://via.placeholder.com/48";
    const name = item.utilizadores?.name || "Utilizador";

    return (
      <View style={styles.comment}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.muted}>
              {" · "}
              {timeAgo(item.data_comentario)}
            </Text>
          </View>
          <Text style={styles.content}>{item.conteudo}</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Publicacao }) => {
    const avatar = item.utilizador?.avatar_url;
    const name = item.utilizador?.name || "Utilizador";
    const isExpanded = expandedPosts.has(item.id);
    const content = item.conteudo || "";
    const shouldTruncate = content.length > 150;
    const displayContent =
      shouldTruncate && !isExpanded
        ? content.substring(0, 150) + "..."
        : content;

    return (
      <View style={styles.post}>
        <Image
          key={item.utilizador.user_id}
          source={{ uri: avatar }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.muted}> · {timeAgo(item.data_publicacao)}</Text>
          </View>
          {!!item.titulo && <Text style={styles.title}>{item.titulo}</Text>}
          {!!item.conteudo && (
            <View>
              <Text style={styles.content}>{displayContent}</Text>
              {shouldTruncate && (
                <Text
                  style={styles.readMoreButton}
                  onPress={() => toggleExpanded(item.id)}
                >
                  {isExpanded ? "ler menos" : "ler mais"}
                </Text>
              )}
            </View>
          )}
          {!!item.imagem_url && (
            <Image source={{ uri: item.imagem_url }} style={styles.postImage} />
          )}
          <View style={styles.metaRow}>
            <Text onPress={() => openComments(item)} style={styles.muted}>
              💬 {item.numero_comentarios ?? 0}
            </Text>
            <Text onPress={() => toggleLike(item)} style={styles.muted}>
              {item.liked ? "❤️" : "♡"} {item.numero_gostos ?? 0}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          ref={flatRef}
          data={feed}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1d9bf0"
            />
          }
          onEndReachedThreshold={0.5}
          onEndReached={loadMore}
          ListEmptyComponent={
            <View style={{ padding: 24 }}>
              <Text>Ainda não há publicações.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
      <ThemedButton style={styles.floatingButton} onPress={show}>
        <Feather name="edit-3" size={30} color="#fff" />
      </ThemedButton>

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={hide}
        transparent={false}
      >
        <SafeAreaView style={styles.modal}>
          <Text style={[styles.heading, { margin: 20 }]}>Nova Publicação</Text>

          <ThemedTextInput
            style={{ width: "80%", marginBottom: 12 }}
            placeholder="Titulo"
            placeholderTextColor="#5c5c5c"
            value={titulo}
            onChangeText={setTitulo}
            keyboardType="default"
            autoCapitalize="sentences"
          />
          <ThemedTextInput
            style={{ width: "80%", height: "20%", marginBottom: 12 }}
            placeholder="Conteúdo"
            placeholderTextColor="#5c5c5c"
            value={conteudo}
            onChangeText={setConteudo}
            keyboardType="default"
            multiline={true}
            numberOfLines={10}
            textAlignVertical="top"
          />

          <ThemedButton
            style={[styles.btnAdd, { width: "50%" }]}
            onPress={handleAddExpense}
          >
            <Text style={styles.btnText}>Publicar</Text>
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
      <Modal
        visible={commentsVisible}
        animationType="slide"
        onRequestClose={() => setCommentsVisible(false)}
        transparent={false}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#f2f2f2",
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          <View style={styles.commentsHeader}>
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Text
                onPress={() => setCommentsVisible(false)}
                style={{
                  color: Colors.warning,
                  fontSize: 14,
                  paddingLeft: 20,
                }}
              >
                FECHAR
              </Text>
            </View>
            <Text style={[styles.heading, { marginBottom: 10, color: "#000" }]}>
              Comentários
            </Text>
            <View style={{ flex: 1 }}></View>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const avatar =
                item.utilizadores?.avatar_url ||
                "https://via.placeholder.com/48";
              const name = item.utilizadores?.name || "Utilizador";
              const content = item.conteudo || "";
              const date = item.data_comentario || new Date().toISOString();

              return (
                <View style={styles.commentItem}>
                  <Image
                    source={{ uri: avatar }}
                    style={styles.avatarComment}
                  />
                  <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                      <Text style={styles.name}>{name}</Text>
                      <Text style={styles.muted}>
                        {" · "}
                        {timeAgo(date)}
                      </Text>
                    </View>
                    <Text style={styles.content}>{content}</Text>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              <View style={{ padding: 20, alignItems: "center" }}>
                <Text>Ainda não há comentários.</Text>
              </View>
            }
            contentContainerStyle={{
              paddingBottom: 20,
              backgroundColor: isDark ? "#000" : "#f2f2f2",
            }}
            style={{ flex: 1, backgroundColor: isDark ? "#000" : "#f2f2f2" }}
          />

          {/* Input de comentário e botão enviar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              paddingHorizontal: 16,
              paddingBottom: 10,
            }}
          >
            <TextInput
              style={[
                styles.commentInput,
                {
                  flex: 1,
                  backgroundColor: "#fff",
                  color: "#000",
                },
              ]}
              placeholder="Escreve um comentário..."
              placeholderTextColor={"#666"}
              value={newComment}
              onChangeText={setNewComment}
            />
            <Button
              onPress={handleAddComment}
              buttonStyle={{ backgroundColor: "#1d9bf0", borderRadius: 20 }}
              title="Enviar"
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  post: {
    flexDirection: "row",
    padding: "5%",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: "5%",
  },
  avatarComment: {
    width: 46,
    height: 46,
    borderRadius: 50,
    marginRight: "5%",
  },
  commentItem: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontWeight: "300",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
  },
  content: {
    marginTop: 6,
    lineHeight: 20,
    fontSize: 16,
  },
  postImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: "#333",
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    justifyContent: "flex-start",
  } as any,
  muted: {
    marginLeft: 6,
  },
  readMoreButton: {
    color: Colors.iconColorFocused,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  floatingButton: {
    position: "absolute",
    bottom: "4%",
    right: "8%",
    width: 70,
    height: 70,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  modal: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  modalComments: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  btnText: {
    color: "#f2f2f2",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  btnAdd: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 20,
    marginBottom: 20,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 26,
    textAlign: "center",
  },
  comment: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 12,
    marginRight: 10,
    backgroundColor: "#fff",
  },
});
