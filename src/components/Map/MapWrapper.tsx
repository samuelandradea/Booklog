import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Feather } from "@expo/vector-icons";
import { ILocation } from '@/models/LocationModel';

// Este arquivo é carregado AUTOMATICAMENTE pelo Expo quando rodamos no Celular (Android/iOS)
export const MapWrapper = ({ locais }: { locais: ILocation[] }) => (
  <MapView
    style={StyleSheet.absoluteFillObject}
    initialRegion={{
      latitude: -8.047562, // Centro de Recife (ajuste para o seu mock)
      longitude: -34.8770,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  >
    {locais.map((local) => (
      <Marker
        key={local.id}
        coordinate={{ latitude: local.latitude, longitude: local.longitude }}
        title={local.nome}
        description={local.tipo}
      >
        <View style={{ alignItems: "center" }}>
          <View style={{ backgroundColor: "#500903", padding: 6, borderRadius: 20, borderWidth: 2, borderColor: "#FFF" }}>
            <Feather name="book-open" size={14} color="#FFF" />
          </View>
          <View style={{ width: 0, height: 0, backgroundColor: "transparent", borderStyle: "solid", borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 10, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "#500903", transform: [{ rotate: "180deg" }], marginTop: -2 }} />
          <View style={{ backgroundColor: "#FFF", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, borderWidth: 1, borderColor: "#500903", marginTop: 2 }}>
            <Text style={{ color: "#500903", fontSize: 10, fontWeight: "bold" }}>{local.nome}</Text>
          </View>
        </View>
      </Marker>
    ))}
  </MapView>
);
