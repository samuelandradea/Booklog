import { StyleSheet, View, ViewProps } from "react-native"

export function Divider({ style, ...rest }: ViewProps) {
    return (
        <View style={[styles.linha, style]} {...rest} />
    )
}

const styles = StyleSheet.create({
    linha: {
        width: "100%",
        height: 1,
        backgroundColor: "#500903",
        marginVertical: 12,
    },
})