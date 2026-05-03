import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native"

type MenuOpcaoProps = TouchableOpacityProps & {
  label: string
}

export function MenuOpcao({ label, ...rest }: MenuOpcaoProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} {...rest}>
      <Text style={styles.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={22} color="#6F1D1B" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
  },
  label: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#500903",
  },
})