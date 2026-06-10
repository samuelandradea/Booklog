import { Header } from "@/components/Header";
import { MapWrapper } from "@/components/Map/MapWrapper";
import { MapaController } from "@/controllers/mapaController";
import { ILocation } from "@/models/LocationModel";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  Linking,
  PanResponder,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from 'expo-location';

export default function Mapa() {
  const router = useRouter();
  const [locais, setLocais] = useState<ILocation[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [localizacao, setLocalizacao] = useState<{ latitude: number; longitude: number } | null>(null);

  // ==========================================
  // LÓGICA DO BOTTOM SHEET ANIMADO
  // ==========================================
  const windowHeight = Dimensions.get("window").height;
  const COLLAPSED_HEIGHT = 48; // Altura quando guardado (mostra só o drag handle e o título)
  const EXPANDED_HEIGHT = windowHeight * 0.55; // 55% da tela quando aberto
  const initialTranslateY = EXPANDED_HEIGHT - COLLAPSED_HEIGHT;

  const translateY = useRef(new Animated.Value(initialTranslateY)).current;
  const isExpanded = useRef(false);

  const toggleSheet = (toExpand: boolean) => {
    Animated.spring(translateY, {
      toValue: toExpand ? 0 : initialTranslateY,
      useNativeDriver: true,
      bounciness: 4, // Dá um pequeno salto suave
    }).start();
    isExpanded.current = toExpand;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        // Se o usuário arrastou pra cima (y negativo) e estava fechado
        if (gestureState.dy < -30 && !isExpanded.current) {
          toggleSheet(true);
        }
        // Se o usuário arrastou pra baixo (y positivo) e estava aberto
        else if (gestureState.dy > 30 && isExpanded.current) {
          toggleSheet(false);
        }
        // Se apenas deu um clique rápido (sem arrastar)
        else if (Math.abs(gestureState.dy) < 10) {
          toggleSheet(!isExpanded.current);
        } else {
          // Se arrastou um pouco mas soltou, volta pra onde estava
          toggleSheet(isExpanded.current);
        }
      },
    }),
  ).current;

  // ==========================================

  useEffect(() => {
    const fetchLocais = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCarregando(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = pos.coords;
      setLocalizacao({ latitude, longitude });

      const data = await MapaController.buscarLocaisProximos(latitude, longitude);
      setLocais(data);
      setCarregando(false);
    };
    fetchLocais();
  }, []);

    const abrirNoGPS = (local: ILocation) => {
      Alert.alert(
        'Abrir no mapa',
        local.nome,
        [
          {
            text: 'Google Maps',
            onPress: () => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${local.latitude},${local.longitude}`),
          },
          {
            text: 'Waze',
            onPress: () => Linking.openURL(`https://waze.com/ul?ll=${local.latitude},${local.longitude}&navigate=yes`),
          },
          {
            text: 'Apple Maps',
            onPress: () => Linking.openURL(`maps://?q=${local.nome}&ll=${local.latitude},${local.longitude}`),
          },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={{
          zIndex: 1,
          backgroundColor: "#D4AA94",
          paddingBottom: 10,
          paddingHorizontal: 22,
          paddingTop: 10,
        }}
      >
        <Header />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mapa</Text>
          <View style={styles.divider} />
        </View>
      </View>

      {/* O MAPA COMPLETO NA METADE SUPERIOR */}
      <View style={styles.mapContainer}>
        <MapWrapper locais={locais} userLocation={localizacao} />
      </View>

      {/* BOTTOM SHEET ANIMADO (PAINEL INFERIOR) */}
      <Animated.View
        style={[
          styles.bottomSheet,
          { transform: [{ translateY: translateY }] },
        ]}
      >
        {/* ÁREA DE TOQUE DO HEADER DO SHEET */}
        <View {...panResponder.panHandlers} style={styles.sheetHeaderArea}>
          <View style={styles.dragHandle} />
          <Text style={styles.sheetTitle}>Locais próximos</Text>
          <View style={styles.sheetDivider} />
        </View>

        {carregando ? (
          <ActivityIndicator
            size="large"
            color="#FFF"
            style={{ marginTop: 20 }}
          />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {locais.map((local) => (
              <TouchableOpacity key={local.id} style={styles.locationCard} onPress={() => abrirNoGPS(local)}>
                <View style={styles.iconWrapper}>
                  <Feather name={
                    local.tipo === 'cafe' ? 'coffee' :
                    local.tipo === 'books' ? 'book' :
                    local.tipo === 'library' ? 'bar-chart-2' :
                    local.tipo === 'park' ? 'wind' :
                    'map-pin' 
                  } size={20} color="#500903" />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{local.nome}</Text>
                  <Text style={styles.locationAddress}>{local.endereco}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* CARD PARA ADICIONAR NOVO LOCAL */}
            <TouchableOpacity
              style={styles.suggestCard}
              activeOpacity={0.8}
              onPress={() => router.push("/sugerir-local")}
            >
              <View style={styles.iconWrapper}>
                <Feather name="plus" size={24} color="#500903" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.suggestTitle}>
                  Não encontrou seu lugar favorito?
                </Text>
                <Text style={styles.suggestSubtitle}>
                  Sugira um novo local literário
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#D4AA94",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#500903",
  },
  divider: {
    height: 1,
    width: "80%",
    backgroundColor: "rgba(80, 9, 3, 0.3)",
    marginTop: 5,
  },
  mapContainer: {
    flex: 1,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Dimensions.get("window").height * 0.55, // Sempre tem 55% de altura, mas afunda pra baixo
    backgroundColor: "#500903",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sheetHeaderArea: {
    backgroundColor: "transparent",
    paddingBottom: 5,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 15,
  },
  sheetTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  sheetDivider: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
    marginTop: 5,
    marginBottom: 15,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  locationAddress: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    marginTop: 2,
  },
  suggestCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)", // Destaque sutil
    borderRadius: 12,
  },
  suggestTitle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  suggestSubtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    marginTop: 2,
  },
});
