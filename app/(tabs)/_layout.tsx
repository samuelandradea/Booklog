import { AntDesign, Ionicons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 70,
          elevation: 10,
          shadowOpacity: 0,
          paddingBottom: 0,
          paddingTop: 15,
        },
        tabBarActiveTintColor: "#500903",
        tabBarInactiveTintColor: "#500903",
      }}
    >
      <Tabs.Screen
        name="minhas_listas"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" size={27} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed_amigos"
        options={{
          tabBarIcon: ({ color }) => (
            <Octicons name="people" size={27} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="registro"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus-circle" size={27} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gameficacao"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="trophy-outline" size={27} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={27} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="lidos_recente" options={{ href: null }} />
      <Tabs.Screen name="home" options={{ href: null }} />
      <Tabs.Screen name="amizades" options={{ href: null }} />
      <Tabs.Screen name="infolivro" options={{ href: null }} />
      <Tabs.Screen name="pesquisa" options={{ href: null }} />
      <Tabs.Screen name="edicao" options={{ href: null }} />
      <Tabs.Screen name="avaliacao" options={{ href: null }} />
      <Tabs.Screen name="editar_avaliacao" options={{ href: null }} />
      <Tabs.Screen name="dentroLista" options={{ href: null }} />
      <Tabs.Screen name="perfilAmizade" options={{ href: null }} />
      <Tabs.Screen name="autor" options={{ href: null }} />
      <Tabs.Screen name="mapa" options={{ href: null }} />
      <Tabs.Screen name="leituras_amigo" options={{ href: null }} />
      {/* Adicione aqui as demais telas que devem ter a barra sem aparecer nela */}
    </Tabs>
  );
}
