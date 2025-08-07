import { Tabs } from "expo-router";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tabColor,
          paddingTop: 20,
          height: 100,
        },
        tabBarActiveTintColor: Colors.iconColorFocused,
        tabBarInactiveTintColor: Colors.iconColor,
      }}
    >
      <Tabs.Screen
        name="(dashboard)"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              style={{ paddingBottom: 20 }}
              name={focused ? "apps-sharp" : "apps-outline"}
              color={focused ? Colors.iconColorFocused : Colors.iconColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="comunity"
        options={{
          title: "Comunidade",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              style={{ paddingBottom: 20 }}
              name={focused ? "people-sharp" : "people-outline"}
              color={focused ? Colors.iconColorFocused : Colors.iconColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(distraime)"
        options={{
          title: "DISTRAI-ME!",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={30}
              style={{ paddingBottom: 40 }}
              name={focused ? "add-circle-sharp" : "add-circle-outline"}
              color={focused ? Colors.iconColorFocused : Colors.iconColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: "Dicas",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              style={{ paddingBottom: 20 }}
              name={focused ? "bulb-sharp" : "bulb-outline"}
              color={focused ? Colors.iconColorFocused : Colors.iconColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              style={{ paddingBottom: 20 }}
              name={focused ? "person-sharp" : "person-outline"}
              color={focused ? Colors.iconColorFocused : Colors.iconColor}
            />
          ),
        }}
      />
    </Tabs>
  );
}
