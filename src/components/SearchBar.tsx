import { Feather } from "@expo/vector-icons";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

// Adicionamos TextInputProps para poder usar onSubmitEditing, value, onChangeText, etc.
type SearchBarProps = TextInputProps & {
  mostrarBotaoLocalizacao?: boolean;
  placeholderText: string;
};

export function SearchBar({
  mostrarBotaoLocalizacao = true,
  placeholderText,
  ...rest // Pega todas as outras propriedades e repassa pro TextInput
}: SearchBarProps) {
  return (
    <View style={styles.row}>
      <View style={styles.inputContainer}>
        <Feather name="search" size={18} color="#6F1D1B" style={styles.icon} />

        <TextInput
          style={styles.input}
          placeholder={placeholderText}
          placeholderTextColor="#6F1D1B"
          numberOfLines={1}
          returnKeyType="search" // Muda o botão de "Enter" do teclado para o ícone de "Buscar"
          {...rest} // Aplica as propriedades extras aqui
        />
      </View>

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
