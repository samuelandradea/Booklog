// uma variação de estilo do componente Input.tsx
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native"

type InputPerfilProps = TextInputProps & {
  label: string
}

export function InputPerfil({ label, style, ...rest }: InputPerfilProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#99999"
        {...rest}
      />
      <View style={styles.linha} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2EBE5",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    width: "100%",
  },
  label: {
    fontFamily: "RedHatDisplay_500Medium",
    fontSize: 15,
    color: "#500903",
    marginBottom: 2,
  },
  input: {
    fontFamily: "RedHatDisplay_500Medium",
    fontSize: 16,
    color: "#500903",
    height: 36,
    padding: 0,   // remove o padding nativo do TextInput para ficar alinhado
  },
  linha: {
    height: 1,
    backgroundColor: "#500903",
    opacity: 0.3,
    marginTop: 2,
  },
})