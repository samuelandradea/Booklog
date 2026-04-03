import { StyleSheet, TextInput, TextInputProps } from "react-native"

export function Input({ style, ...rest }: TextInputProps) {
    return (
        <TextInput 
            style={[styles.inputBase, style]} 
            placeholderTextColor="#FFFFFF"
            { ...rest } 
        />
    )
}

const styles = StyleSheet.create({
    inputBase: {
        height: 48,
        width: "100%",
        paddingHorizontal: 20,
        backgroundColor: "#6F1D1B",
        color: "#FFFFFF",
        fontSize: 18,
        fontFamily: "RedHatDisplay_600SemiBold",
        borderRadius: 10,
        marginTop: 10,
    },
})