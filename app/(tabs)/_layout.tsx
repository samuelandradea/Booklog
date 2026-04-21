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
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: 10,
          paddingTop: 15,
        },
        tabBarActiveTintColor: "#500903",
        tabBarInactiveTintColor: "#500903",
      }}
    >
      {/* ========== TELAS DA BARRA DE NAVEGAÇÃO ========== */}
      <Tabs.Screen
        name="minhas_listas"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" size={36} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed_amigos"
        options={{
          tabBarIcon: ({ color }) => (
            <Octicons name="people" size={36} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="registro"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus-circle" size={36} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="trophy-outline" size={36} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={36} color={color} />
          ),
        }}
      />

      {/* ========== TELAS QUE TÊM A BARRA MAS NÃO APARECEM NELA ========== */}
      <Tabs.Screen name="lidos_recente" options={{ href: null }} />
      <Tabs.Screen name="home" options={{ href: null }} />
      <Tabs.Screen name="amizades" options={{ href: null }} />
      <Tabs.Screen name="infolivro" options={{ href: null }} />
      <Tabs.Screen name="pesquisa" options={{ href: null }} />
      <Tabs.Screen name="avaliacao" options={{ href: null }} />
      <Tabs.Screen name="editar_avaliacao" options={{ href: null }} />
      {/* Adicione aqui as demais telas que devem ter a barra sem aparecer nela */}
    </Tabs>
  );
}
