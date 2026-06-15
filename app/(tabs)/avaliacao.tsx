import { useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/Header';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Tela responsável por exibir a avaliação (review) de um amigo sobre um livro
// Recebe os dados via parâmetros de rota (sem necessidade de nova chamada à API)
export default function Avaliacao() {
  const { titulo, autor, capa, nota, resenha, usuario } = useLocalSearchParams<{
    titulo: string;
    autor: string;
    capa: string;
    nota: string;
    resenha: string;
    usuario: string;
  }>();

  // converte a URL da capa para HTTPS para evitar erros de segurança no iOS
  const capaSegura = capa ? capa.replace('http:', 'https:') : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>

        <Header />

        <View style={styles.topoContainer}>
          <View style={styles.capa}>
            {capaSegura ? (
              <Image source={{ uri: capaSegura }} style={styles.capaImagem} />
            ) : (
              <Text style={styles.capaTexto}>Livro</Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Nota de {usuario || "usuário"}:</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{nota}/5</Text>
            </View>
          </View>
        </View>

        <Text style={styles.nomeLivro}>{titulo}</Text>
        <Text style={styles.nomeAutor}>{autor}</Text>

        <Text style={styles.resenhaLabel}>Avaliação:</Text>
        <View style={styles.resenhaContainer}>
          <Text style={styles.resenhaTexto}>
            {resenha || "Nenhum comentário adicionado."}
          </Text>
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
    fontWeight: 'bold',
  },
  resenhaLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#500903',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 8,
  },
  resenhaContainer: {
    backgroundColor: 'transparent',
  },
  resenhaTexto: {
    fontSize: 14,
    color: '#500903',
    fontWeight: 'bold',
    lineHeight: 22,
  },
});
