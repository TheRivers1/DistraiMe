// PublicacoesFeed.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';

// ---------- CONFIG (define as env vars em produção) ----------
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
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
};

// ---------- HELPERS ----------
function timeAgo(iso?: string | null) {
  if (!iso) return '';
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
async function fetchFeed({ limit = 20, cursor }: { limit?: number; cursor?: string | null }) {
  // Nota: estamos a fazer uma junção simples à tabela utilizadores que tem FK user_id
  // Ajusta o select se a tua FK for diferente.


  async function downloadImage(path: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage.from('user_profiles/pics').download(path)
      if (error) {
        throw error
      }

      return new Promise((resolve, reject) => {

        const fileReaderInstance = new FileReader();

        fileReaderInstance.onload = () => {
          resolve((fileReaderInstance.result as string));
        };

        fileReaderInstance.onerror = (error) => {
          reject(error);
        };
        fileReaderInstance.readAsDataURL(data)
      }
      )
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
    return null
  }


  let q = supabase
    .from('publicacoes')
    .select(`
      id,
      user_id,
      titulo,
      conteudo,
      imagem_url,
      data_publicacao,
      numero_gostos,
      numero_comentarios,
      utilizadores!publicacoes_user_id_fkey(user_id, name, avatar_url)
    `)
    .order('data_publicacao', { ascending: false })
    .limit(limit);

  if (cursor) q = q.lt('data_publicacao', cursor);

  const { data, error } = await q;
  if (error) throw error;

  const finalArray = []
  for (const row of data) {
    const image = await downloadImage((row as any).utilizadores.avatar_url)
    finalArray.push({ ...(row as Publicacao), utilizador: { ...row.utilizadores, avatar_url: image } })
  }

  return finalArray as Publicacao[];
}

// ---------- COMPONENTE ----------
export default function PublicacoesFeed() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [feed, setFeed] = useState<Publicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const flatRef = useRef<FlatList<Publicacao>>(null);

  const loadInitial = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchFeed({ limit: 20 });
      setFeed(data);
      setCursor(data.length ? data[data.length - 1].data_publicacao ?? null : null);
    } catch (err: any) {
      console.error('Erro a carregar feed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await fetchFeed({ limit: 20 });
      setFeed(data);
      setCursor(data.length ? data[data.length - 1].data_publicacao ?? null : null);
    } catch (err: any) {
      console.error('Erro refresh', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!cursor) return; // sem cursor não há mais
    try {
      const data = await fetchFeed({ limit: 20, cursor });
      if (data.length === 0) {
        setCursor(null);
        return;
      }
      setFeed((p) => [...p, ...data]);
      setCursor(data[data.length - 1].data_publicacao ?? null);
    } catch (err: any) {
      console.error('Erro loadMore', err);
    }
  }, [cursor]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);



  const renderItem = ({ item }: { item: Publicacao }) => {
    const avatar = item.utilizador?.avatar_url;
    const name = item.utilizador?.name || 'Utilizador';
    return (
      <View style={[styles.post, isDark ? styles.postDark : styles.postLight]}>
        <Image key={item.utilizador.user_id} source={{ uri: avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={[styles.name, isDark ? styles.textDark : styles.textLight]}>{name}</Text>
            <Text style={[styles.muted, isDark ? styles.mutedDark : styles.mutedLight]}> · {timeAgo(item.data_publicacao)}</Text>
          </View>
          {!!item.titulo && <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>{item.titulo}</Text>}
          {!!item.conteudo && <Text style={[styles.content, isDark ? styles.textDark : styles.textLight]}>{item.conteudo}</Text>}
          {!!item.imagem_url && <Image source={{ uri: item.imagem_url }} style={styles.postImage} />}
          <View style={styles.metaRow}>
            <Text style={[styles.muted, isDark ? styles.mutedDark : styles.mutedLight]}>💬 {item.numero_comentarios ?? 0}</Text>
            <Text style={[styles.muted, isDark ? styles.mutedDark : styles.mutedLight]}>❤️ {item.numero_gostos ?? 0}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1d9bf0" />}
          onEndReachedThreshold={0.5}
          onEndReached={loadMore}
          ListEmptyComponent={
            <View style={{ padding: 24 }}>
              <Text style={isDark ? styles.mutedDark : styles.mutedLight}>Ainda não há publicações.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </SafeAreaView>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  post: { flexDirection: 'row', padding: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  postLight: { borderBottomColor: '#eee', backgroundColor: '#fff' },
  postDark: { borderBottomColor: '#222', backgroundColor: '#000' },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { fontWeight: '700' },
  title: { fontWeight: '700', marginTop: 4 },
  content: { marginTop: 6, lineHeight: 20 },
  postImage: { width: '100%', height: 180, borderRadius: 12, marginTop: 8, backgroundColor: '#333' },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 8, justifyContent: 'flex-start' } as any,
  muted: { marginLeft: 6 },
  textLight: { color: '#0f1419' },
  textDark: { color: '#e7e9ea' },
  mutedLight: { color: '#536471' },
  mutedDark: { color: '#8b98a5' },
  bgLight: { backgroundColor: '#fff' },
  bgDark: { backgroundColor: '#000' },
});