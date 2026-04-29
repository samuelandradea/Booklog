import { useProtectedRoute } from '@/hook/useProtectedRoute';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api } from "@/lib/api";
import { SafeAreaView } from 'react-native-safe-area-context';

// Tela responsável por exibir as informações detalhadas de um livro
// Recebe o isbn via parâmetro de rota e busca os dados na API
export default function LivroInfo() {
  const { user, loading } = useProtectedRoute()
  const { isbn } = useLocalSearchParams();
  const [livro, setLivro] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  // busca os dados do livro na API pelo isbn recebido via parâmetro de rota
  useEffect(() => {
    if (isbn) {
      api(`/books/${isbn}`)
        .then(data => setLivro(data))
        .catch(err => console.error(err))
        .finally(() => setCarregando(false));
    }
  }, [isbn]);

  if (loading) return null

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#500903" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!livro) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.header}>Livro não encontrado</Text>
      </SafeAreaView>
    );
  }

  // converte a URL da capa para HTTPS para evitar erros de segurança no iOS
  const thumbnail = livro.thumbnail
    ? livro.thumbnail.replace('http:', 'https:')
    : null;

    // separa as categorias que vêm como string separada por vírgula
  const categorias = livro.categories
    ? livro.categories.split(',').map((c: string) => c.trim())
    : [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>

        <Header />

        <View style={styles.topoContainer}>
          <View style={styles.capa}>
            {thumbnail ? (
              <Image source={{ uri: thumbnail }} style={styles.capaImagem} />
            ) : (
              <Text style={styles.capaTexto}>Livro</Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Nota do livro:</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{livro.average_rating}/5</Text>
            </View>

            <Text style={styles.infoLabel}>Lançamento:</Text>
            <View style={styles.badgeLargo}>
              <Text style={styles.badgeTexto}>{livro.published_year}</Text>
            </View>

            <Text style={styles.infoLabel}>Gênero:</Text>
            <View style={styles.badgeLargo}>
              {categorias.map((cat: string, index: number) => (
                <Text key={index} style={styles.badgeTexto}>{cat}</Text>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.nomeLivro}>{livro.title}</Text>
        <Text style={styles.nomeAutor}>{livro.authors}</Text>

        <Text style={styles.sinopseLabel}>Sinopse:</Text>
        <View style={styles.sinopseContainer}>
          <Text style={styles.sinopseTexto}>{livro.description}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D4AA94',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#500903',
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
  },
  topoContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  capa: {
    width: 140,
    height: 200,
    backgroundColor: '#6F1D1B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capaImagem: {
    width: 140,
    height: 200,
    borderRadius: 12,
  },
  capaTexto: {
    color: '#D4AA94',
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    gap: 6,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#500903',
    fontFamily: 'Poppins_700Bold',
  },
  badge: {
    backgroundColor: '#6F1D1B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeLargo: {
    backgroundColor: '#6F1D1B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
  },
  badgeTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  nomeLivro: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#500903',
    fontFamily: 'Poppins_700Bold',
    marginTop: 8,
  },
  nomeAutor: {
    fontSize: 14,
    color: '#500903',
    marginBottom: 16,
  },
  sinopseLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#500903',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 8,
  },
  sinopseContainer: {
    backgroundColor: 'transparent',
  },
  sinopseTexto: {
    fontSize: 14,
    color: '#500903',
    fontWeight: 'bold',
    lineHeight: 22,
  },
});