import { Header } from '@/components/Header';
import { useProtectedRoute } from '@/hook/useProtectedRoute';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CarrosselLivros } from '@/components/CarrosselLivros';
import { livroBuilder } from '@/builders/livroBuilder';
import { ILivro } from '@/models/LivroModel';
import { api } from '@/lib/api';

// Tela que exibe informações de um autor e seus livros
export default function Autor() {
  const { user, loading } = useProtectedRoute();
  const { nomeAutor } = useLocalSearchParams<{ nomeAutor: string }>();
  const [livros, setLivros] = useState<ILivro[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!nomeAutor) return;
    buscarLivrosDoAutor();
  }, [nomeAutor]);

  const buscarLivrosDoAutor = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/authors/${encodeURIComponent(nomeAutor)}/books`
      );
      const data = await response.json();
      const livrosFormatados = data.map((l: any) => livroBuilder(l));
      setLivros(livrosFormatados);
    } catch (error) {
      console.error('Erro ao buscar livros do autor:', error);
    } finally {
      setCarregando(false);
    }
  };

  if (loading) return null;

  // Livros mais bem avaliados
  const maioresNotas = [...livros]
    .sort((a, b) => b.notaMedia - a.notaMedia)
    .slice(0, 8);

  // Livros mais populares (mais avaliações)
  const populares = [...livros]
    .sort((a, b) => Number(b.ratingsCount) - Number(a.ratingsCount))
    .slice(0, 8);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header />

        <Text style={styles.nomeAutor}>{nomeAutor}</Text>

        {carregando ? (
          <ActivityIndicator color="#6F1D1B" size="large" style={{ marginTop: 40 }} />
        ) : livros.length === 0 ? (
          <Text style={styles.semLivros}>Nenhum livro encontrado para este autor.</Text>
        ) : (
          <>
            <CarrosselLivros
              titulo="Maiores notas"
              dados={maioresNotas}
              mostrarBolinhas={false}
            />
            <CarrosselLivros
              titulo="Populares"
              dados={populares}
              mostrarBolinhas={false}
            />
          </>
        )}
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
  nomeAutor: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#500903',
    marginBottom: 16,
    marginTop: 8,
    backgroundColor: 'transparent'
  },
  semLivros: {
    fontFamily: 'RedHatDisplay_500Medium',
    fontSize: 16,
    color: '#500903',
    textAlign: 'center',
    marginTop: 40,
  },
});