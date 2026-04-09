import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useProtectedRoute } from '@/hook/useProtectedRoute';
import { auth } from '@/lib/firebase';
import { createBook } from '@/services/bookService';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegistroLeitura() {
  const { user, loading } = useProtectedRoute()

  if (loading) return null
  const [nota, setNota] = useState(0);
  const [resenha, setResenha] = useState('');
  const [nomeLivro, setNomeLivro] = useState('');
  const [nomeAutor, setNomeAutor] = useState('');

  const handleSalvar = async () => {
    if (!nomeLivro.trim() || !nomeAutor.trim()) {
      Alert.alert('Erro', 'Preencha o nome do livro e do autor');
      return;
    }

    const uid = auth.currentUser?.uid;

    if (!uid) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    const novoLivro = {
      nomeLivro,
      nomeAutor,
      nota,
      resenha,
    };

    try {
      await createBook(uid, novoLivro);

      Alert.alert('Sucesso', 'Livro registrado com sucesso!');

      setNomeLivro('');
      setNomeAutor('');
      setNota(0);
      setResenha('');

      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleDescartar = () => {
    setNomeLivro('');
    setNomeAutor('');
    setNota(0);
    setResenha('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >

        <Text style={styles.header}>booklog</Text>

        <View style={styles.capaContainer}>
          <View style={styles.capa}>
            <Text style={styles.capaTexto}>Livro</Text>
          </View>

          <Input
            style={styles.nomeLivro}
            value={nomeLivro}
            onChangeText={setNomeLivro}
            placeholder="Nome do livro"
            textAlign="center"
          />

          <Input
            style={styles.nomeAutor}
            value={nomeAutor}
            onChangeText={setNomeAutor}
            placeholder="Autor"
            textAlign="center"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Nota do livro:</Text>

          <View style={styles.notaBadge}>
            <Text style={styles.notaTexto}>⭐ {nota.toFixed(1)}</Text>
          </View>

          <Slider
            minimumValue={0}
            maximumValue={5}
            step={0.5}
            value={nota}
            onValueChange={setNota}
            minimumTrackTintColor="#6F1D1B"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#6F1D1B"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Resenha:</Text>
          <Input
            style={styles.resenhaInput}
            multiline
            value={resenha}
            onChangeText={setResenha}
            placeholder="Escreva sua resenha..."
          />
        </View>

        <View style={styles.botoesContainer}>
          <Button
            label="Descartar"
            style={styles.botaoDescartar}
            onPress={handleDescartar}
          />

          <Button
            label="Salvar"
            style={styles.botaoSalvar}
            onPress={handleSalvar}
          />
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
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#500903',
    marginBottom: 20,
  },
  capaContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  capa: {
    width: 180,
    height: 260,
    backgroundColor: '#6F1D1B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  capaTexto: {
    color: '#D4AA94',
    fontSize: 32,
    fontWeight: 'bold',
  },
  nomeLivro: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#500903',
    backgroundColor: 'transparent',
  },
  nomeAutor: {
    fontSize: 14,
    color: '#500903',
    backgroundColor: 'transparent',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#500903',
    marginBottom: 8,
  },
  notaBadge: {
    backgroundColor: '#6F1D1B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  notaTexto: {
    color: '#D4AA94',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resenhaInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  botaoDescartar: {
    flex: 1,
    backgroundColor: '#500903',
  },
  botaoSalvar: {
    flex: 1,
  },
});