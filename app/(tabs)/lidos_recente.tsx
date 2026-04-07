import { Divider } from "@/components/Divider";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";

export default function Gostos() {
    const { width } = useWindowDimensions()


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: "height"})}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <Text style={styles.title}>Leituras recentes</Text>
                <Divider/>

            </View>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "Poppins_700Bold",
        fontSize: 28,
        color: "#500903",
        textAlign: "center",
        marginBottom: 20,
    },
    subtitle: {
        fontFamily: "Poppins_700Bold",
        fontSize: 19,
        color: "#500903",
        textAlign: "center",
        marginBottom: 20,
    },
    container: {
        flex: 1,
        backgroundColor: "#D4AA94",
        padding: 28,
        paddingTop: 60,
    },
})

