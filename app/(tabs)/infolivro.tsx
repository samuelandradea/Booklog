import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

const livro = {
  title: 'Nome do Livro',
  authors: 'Nome do autor',
  average_rating: 0,
  published_year: '13/06/2013',
  categories: ['Terror', 'Ação', 'Comédia'],
  thumbnail: null,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac ante turpis. Vestibulum sodales ante nisl, et dictum ante tincidunt ac.',
};

export default function LivroInfo() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.header}>booklog</Text>

        <View style={styles.topoContainer}>
          {/* Capa */}
          <View style={styles.capa}>
            {livro.thumbnail ? (
              <Image source={{ uri: livro.thumbnail }} style={styles.capaImagem} />
            ) : (
              <Text style={styles.capaTexto}>Livro</Text>
            )}
          </View>

          {/* Infos à direita */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Nota do livro:</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{livro.average_rating}/10</Text>
            </View>

            <Text style={styles.infoLabel}>Lançamento:</Text>
            <View style={styles.badgeLargo}>
              <Text style={styles.badgeTexto}>{livro.published_year}</Text>
            </View>

            <Text style={styles.infoLabel}>Gênero:</Text>
            <View style={styles.badgeLargo}>
              {livro.categories.map((cat, index) => (
                <Text key={index} style={styles.badgeTexto}>{cat}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* Nome e autor */}
        <Text style={styles.nomeLivro}>{livro.title}</Text>
        <Text style={styles.nomeAutor}>{livro.authors}</Text>

        {/* Sinopse */}
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