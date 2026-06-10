import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Feather } from "@expo/vector-icons";
import { ILocation } from '@/models/LocationModel';

// Este arquivo é carregado AUTOMATICAMENTE pelo Expo quando rodamos no Celular (Android/iOS)
function getIcone(tipo: string): React.ComponentProps<typeof Feather>['name'] {
  if (tipo === 'library') return 'bar-chart-2';
  if (tipo === 'cafe') return 'coffee';
  if (tipo === 'books') return 'book';
  if (tipo === 'park') return 'wind'; 
  return 'map-pin';
}
export const MapWrapper = ({ locais, userLocation }: { locais: ILocation[], userLocation: { latitude: number; longitude: number} | null }) => {
  const region = userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    latitude: -8.047562,
    longitude: -34.8770,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      region={region}
      showsUserLocation={true}
      followsUserLocation={true}
    >

      {locais.map((local) => (
        <Marker
          key={local.id}
          coordinate={{ latitude: local.latitude, longitude: local.longitude }}
          title={local.nome}
          description={local.tipo}
          tracksViewChanges={false}
        >
          <View style={{ alignItems: "center" }}>
            <View style={{ backgroundColor: "#500903", padding: 6, borderRadius: 20, borderWidth: 2, borderColor: "#FFF" }}>
              <Feather name={getIcone(local.tipo)} size={14} color="#FFF" />
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
};
