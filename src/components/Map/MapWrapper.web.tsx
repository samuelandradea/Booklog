import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from "@expo/vector-icons";

// Este arquivo é carregado AUTOMATICAMENTE pelo Expo quando rodamos na Web
export const MapWrapper = ({ locais }: any) => (
  <View style={{ flex: 1, backgroundColor: '#E5E5E5', alignItems: 'center', justifyContent: 'center' }}>
    <Feather name="map" size={40} color="#500903" style={{ opacity: 0.5, marginBottom: 10 }} />
    <Text style={{ color: '#500903', fontWeight: 'bold' }}>O Mapa Interativo não funciona no navegador.</Text>
    <Text style={{ color: '#500903', fontSize: 12 }}>Teste no seu celular usando o aplicativo Expo Go.</Text>
  </View>
);
