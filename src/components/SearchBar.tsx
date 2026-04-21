import { Feather } from "@expo/vector-icons";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Propriedades aceitas pela SearchBar.
 * @extends TextInputProps - Isso significa que a nossa SearchBar herda automaticamente
 * TODAS as propriedades de um TextInput padrão do React Native (como value, onChangeText,
 * onSubmitEditing, autoFocus, etc).
 */
type SearchBarProps = TextInputProps & {
  /** * Define se o botão com o ícone de mapa (map-pin) deve aparecer ao lado da barra.
   * @default true
   */
  mostrarBotaoLocalizacao?: boolean;

  /** O texto de dica que aparece quando a barra está vazia (ex: "Pesquise aqui...") */
  placeholderText: string;
};

/**
 * Componente visual reutilizável de Barra de Pesquisa.
 * * Estilizado com um ícone de lupa interno e suporte a um botão lateral de localização.
 * Ele repassa qualquer propriedade nativa de texto diretamente para o `TextInput` interno.
 */
export function SearchBar({
  mostrarBotaoLocalizacao = true,
  placeholderText,
  ...rest // O "rest" pega todas as propriedades nativas passadas e guarda aqui
}: SearchBarProps) {
  return (
    <View style={styles.row}>
      <View style={styles.inputContainer}>
        {/* Ícone de Lupa fixo à esquerda */}
        <Feather name="search" size={18} color="#6F1D1B" style={styles.icon} />

        <TextInput
          style={styles.input}
          placeholder={placeholderText}
          placeholderTextColor="#6F1D1B"
          numberOfLines={1}
          returnKeyType="search" // Muda a tecla "Enter" do teclado móvel para um ícone azul de "Buscar"
          {...rest} // "Despeja" todas as propriedades extras (como value e onChangeText) diretamente no TextInput
        />
      </View>

      {/* Renderização condicional do botão lateral de localização */}
      {mostrarBotaoLocalizacao && (
        <TouchableOpacity style={styles.locationButton} activeOpacity={0.7}>
          <Feather name="map-pin" size={20} color="#500903" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  inputContainer: {
    flex: 1,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, color: "#6F1D1B", fontSize: 11.2, fontWeight: "600" },
  locationButton: {
    width: 40,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
