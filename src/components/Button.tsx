import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native"

type ButtonProps = TouchableOpacityProps & {
    label: string
}
export function Button({ label, ...rest }: ButtonProps){
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7} {...rest}>
            <Text style={styles.label} > {label} </Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        paddingHorizontal: 32,
        height: 40,
        backgroundColor: "#6F1D1B",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 10,
    },
    label: {
        color: "#FFFFFF",
        fontSize: 26,
        fontFamily: "RedHatDisplay_500Medium",
    },
})