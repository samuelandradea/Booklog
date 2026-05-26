import { Ionicons } from "@expo/vector-icons"
import { Image, StyleSheet, View } from "react-native"

type Props = {
    fotoURL?: string | null
    size?: number
}

/**
 * Exibe a foto de perfil do usuario ou um icone de fallback
 * caso a foto ainda nao tenha sido configurada.
 */
export function Avatar({ fotoURL, size = 80 }: Props) {
    const borderRadius = size / 2
    const iconSize = Math.round(size * 0.5)

    return (
        <View style={[styles.container, { width: size, height: size, borderRadius }]}>
            {fotoURL ? (
                <Image
                    source={{ uri: fotoURL }}
                    style={{ width: size, height: size, borderRadius }}
                    resizeMode="cover"
                />
            ) : (
                <Ionicons name="person" size={iconSize} color="#D4AA94" />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#6F1D1B",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
})