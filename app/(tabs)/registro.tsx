import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useProtectedRoute } from '@/hook/useProtectedRoute';
import { auth } from '@/lib/firebase';
import { Livro } from '@/models/LivroLocal';
import { ModalBuscaLivro } from '@/components/ModalBuscaLivros';
import { RegistroController } from '@/controllers/registroController';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useRef } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


// Tela responsável pelo registro de leituras do usuário
// Permite selecionar um livro via busca, atribuir nota e escrever resenha
export default function RegistroLeitura() {
  const { user, loading } = useProtectedRoute()
  const [nota, setNota] = useState(0);
  const [resenha, setResenha] = useState('');
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  if (loading) return null
  
  // Valida os dados e salva a avaliação via RegistroController
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
    const sucesso = await RegistroController.salvarAvaliacao(uid, {
      bookIsbn: livroSelecionado.isbn || '',
      nomeLivro: livroSelecionado.title,
      nomeAutor: livroSelecionado.author || '',
      nota,
      resenha,
    });
    if (sucesso) {
      Alert.alert('Sucesso', 'Livro registrado com sucesso!');
      setLivroSelecionado(null);
      setNota(0);
      setResenha('');
      router.replace('/home')
    }
  };

  // Limpa todos os campos do formulário
  const handleDescartar = () => {
    setLivroSelecionado(null);
    setNota(0);
    setResenha('');
  };

  // converte a URL da capa para HTTPS para evitar erros de segurança no iOS
  const thumbnail = livroSelecionado?.img
    ? livroSelecionado.img.replace('http:', 'https:')
    : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >    
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView ref={scrollViewRef} style={styles.container} keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: 10 }]}
      >
        <Header />
        {/* BOTÃO VOLTAR */}

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
            {livroSelecionado?.author || 'Autor'}
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
            onChangeText={(texto) => {
              setResenha(texto);
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
            placeholder="Escreva sua resenha..."
            placeholderTextColor="#FFFFFF"
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }}
          />
        </View>

        <View style={styles.botoesContainer}>
          <Button label="Descartar" style={styles.botaoDescartar} onPress={handleDescartar} />
          <Button label="Salvar" style={styles.botaoSalvar} onPress={handleSalvar} />
        </View>
      </ScrollView>

      {/* Modal de seleção de livro */}
      <ModalBuscaLivro
        visivel={modalVisivel}
        onFechar={() => setModalVisivel(false)}
        onSelecionar={(livro) => {
          setLivroSelecionado(livro);
          setModalVisivel(false);
        }}
      />
    </SafeAreaView>
    </KeyboardAvoidingView>
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
    backgroundColor: '#C4906A',
    padding: 8,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
  },
  botaoSalvar: { 
    flex: 1,
    backgroundColor: '#500903',
    padding: 8,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
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