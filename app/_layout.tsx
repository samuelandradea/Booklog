import { AuthProvider } from '@/context/authContext';
import { Poppins_400Regular, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { RedHatDisplay_400Regular, RedHatDisplay_500Medium, RedHatDisplay_600SemiBold, RedHatDisplay_700Bold } from "@expo-google-fonts/red-hat-display";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
        RedHatDisplay_400Regular,
        RedHatDisplay_500Medium,
        RedHatDisplay_600SemiBold,
        RedHatDisplay_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
    );
}