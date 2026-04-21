import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useProtectedRoute } from '@/hook/useProtectedRoute';
import { auth } from '@/lib/firebase';
import { api } from '@/lib/api';
import { createBook } from '@/services/bookService';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Livro = {
  id: string;
  title: string;
  authors: string;
  thumbnail?: string;
  average_rating?: number;
  isbn13?: string;
}

export default function RegistroLeitura() {
  const { user, loading } = useProtectedRoute()
  const [nota, setNota] = useState(0);
  const [resenha, setResenha] = useState('');
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [textoBusca, setTextoBusca] = useState('');
  const [resultados, setResultados] = useState<Livro[]>([]);
  const [buscando, setBuscando] = useState(false);

  if (loading) return null

  const buscarLivros = async (termo: string) => {
    if (!termo.trim()) {
      setResultados([]);
      return;
    }
    setBuscando(true);
    try {
      const data = await api(`/search?q=${termo}`);
      setResultados(data.livros || []);
    } catch (error) {
      console.error(error);
    } finally {
      setBuscando(false);
    }
  };

  const selecionarLivro = (livro: Livro) => {
    setLivroSelecionado(livro);
    setModalVisivel(false);
    setTextoBusca('');
    setResultados([]);
  };

  const handleSalvar = async () => {
    if (!livroSelecionado) {
      Alert.alert('Erro', 'Selecione um livro');
      return;
    }
    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }
    const novoLivro = {
      bookIsbn: livroSelecionado.isbn13 || '',
      nomeLivro: livroSelecionado.title,
      nomeAutor: livroSelecionado.authors,
      nota,
      resenha,
    };
    try {
      await createBook(uid, novoLivro);
      Alert.alert('Sucesso', 'Livro registrado com sucesso!');
      setLivroSelecionado(null);
      setNota(0);
      setResenha('');
      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleDescartar = () => {
    setLivroSelecionado(null);
    setNota(0);
    setResenha('');
  };

  const thumbnail = livroSelecionado?.thumbnail
    ? livroSelecionado.thumbnail.replace('http:', 'https:')
    : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Header />

        <View style={styles.capaContainer}>
          <TouchableOpacity style={styles.capa} onPress={() => setModalVisivel(true)}>
            {thumbnail ? (
              <Image source={{ uri: thumbnail }} style={styles.capaImagem} />
            ) : (
              <View style={styles.capaPlaceholder}>
                <Ionicons name="add-circle-outline" size={48} color="#D4AA94" />
                <Text style={styles.capaTexto}>Selecionar{'\n'}Livro</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.nomeLivro}>
            {livroSelecionado?.title || 'Nome do livro'}
          </Text>
          <Text style={styles.nomeAutor}>
            {livroSelecionado?.authors || 'Autor'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Nota do livro:</Text>
          <View style={styles.notaBadge}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {[1, 2, 3, 4, 5].map((estrela) => (
                <Ionicons key={estrela} name={nota >= estrela ? "star" : "star-outline"} size={16} color="#FFD700" />
              ))}
              <Text style={styles.notaTexto}> {nota.toFixed(1)}</Text>
            </View>
          </View>
          <Slider minimumValue={0} maximumValue={5} step={0.5} value={nota} onValueChange={setNota} minimumTrackTintColor="#6F1D1B" maximumTrackTintColor="#ccc" thumbTintColor="#6F1D1B" />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Resenha:</Text>
          <TextInput
            style={styles.resenhaInput}
            multiline
            value={resenha}
            onChangeText={setResenha}
            placeholder="Escreva sua resenha..."
            placeholderTextColor="#FFFFFF"
          />
        </View>

        <View style={styles.botoesContainer}>
          <Button label="Descartar" style={styles.botaoDescartar} onPress={handleDescartar} />
          <Button label="Salvar" style={styles.botaoSalvar} onPress={handleSalvar} />
        </View>
      </ScrollView>

      {/* Modal de seleção de livro */}
      <Modal visible={modalVisivel} animationType="slide" onRequestClose={() => setModalVisivel(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Selecionar Livro</Text>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Ionicons name="close" size={28} color="#500903" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.modalBusca}
            placeholder="Pesquisar livro..."
            placeholderTextColor="#999"
            value={textoBusca}
            onChangeText={(texto) => {
              setTextoBusca(texto);
              buscarLivros(texto);
            }}
            autoFocus
          />

          {buscando ? (
            <Text style={styles.buscandoTexto}>Buscando...</Text>
          ) : (
            <FlatList
              data={resultados}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const thumb = item.thumbnail
                  ? item.thumbnail.replace('http:', 'https:')
                  : null;
                return (
                  <TouchableOpacity style={styles.resultadoItem} onPress={() => selecionarLivro(item)}>
                    {thumb ? (
                      <Image source={{ uri: thumb }} style={styles.resultadoImagem} />
                    ) : (
                      <View style={styles.resultadoImagemPlaceholder} />
                    )}
                    <View style={styles.resultadoInfo}>
                      <Text style={styles.resultadoTitulo} numberOfLines={2}>{item.title}</Text>
                      <Text style={styles.resultadoAutor} numberOfLines={1}>{item.authors}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                textoBusca.length > 0 ? (
                  <Text style={styles.buscandoTexto}>Nenhum livro encontrado</Text>
                ) : null
              }
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#D4AA94', 
  },
  container: { 
    flex: 1 
  },
  content: { 
    padding: 20, 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#500903', 
    marginBottom: 20 
  },
  capaContainer: { 
    alignItems: 'center', 
    marginBottom: 24 
  },
  capa: { 
    width: 180, 
    height: 260, 
    backgroundColor: '#6F1D1B', 
    borderRadius: 12, justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  capaPlaceholder: { 
    width: 180, 
    height: 260, 
    backgroundColor: '#6F1D1B', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  capaImagem: { width: 180, 
    height: 260, 
    borderRadius: 12 
  },
  capaTexto: { 
    color: '#D4AA94', 
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 8 
  },
  nomeLivro: { 
    fontSize: 20, 
    fontWeight: 'bold' as const, 
    color: '#500903', 
    backgroundColor: 'transparent' 
  },
  nomeAutor: { 
    fontSize: 14, 
    color: '#500903', 
    backgroundColor: 'transparent' 
  },
  section: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#500903', 
    marginBottom: 8 
  },
  notaBadge: { 
    backgroundColor: '#6F1D1B', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 8, 
    alignSelf: 'flex-start', 
    marginBottom: 8 
  },
  notaTexto: { 
    color: '#D4AA94', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  resenhaInput: { 
    height: 150, 
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    color: '#500903',
  },
  botoesContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 12 
  },
  botaoDescartar: { 
    flex: 1, 
    backgroundColor: '#D4AA94',
    borderRadius: 24,
  },
  botaoSalvar: { 
    flex: 1,
    backgroundColor: '#500903',
    borderRadius: 24,
  },
  modalContainer: { 
    flex: 1, 
    backgroundColor: '#D4AA94' 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20 
  },
  modalTitulo: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#500903' 
  },
  modalBusca: { 
    margin: 20, 
    marginTop: 0, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 12, 
    fontSize: 16, 
    color: '#333' },
  buscandoTexto: { 
    textAlign: 'center', 
    color: '#500903', 
    marginTop: 20 
  },
  resultadoItem: { 
    flexDirection: 'row', 
    padding: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#C4906A', 
    gap: 12 },
  resultadoImagem: { 
    width: 50, 
    height: 70, 
    borderRadius: 6 
  },
  resultadoImagemPlaceholder: { 
    width: 50, 
    height: 70, 
    backgroundColor: '#6F1D1B', 
    borderRadius: 6 
  },
  resultadoInfo: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  resultadoTitulo: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#500903' 
  },
  resultadoAutor: { 
    fontSize: 12, 
    color: '#6F1D1B', 
    marginTop: 4 
  },
});