import { Stack } from "expo-router";
import { StyleSheet, ImageBackground, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "../contexts/UserContext";

const RootLayout = () => {
  return (
    <UserProvider>
      <StatusBar value="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "black",
        }}
      >
        <Stack.Screen name="(auth)" options={{headerShown: false}}/>
        <Stack.Screen name="(dashboard)" options={{headerShown: false}}/>
        <Stack.Screen name="index" options={{headerShown: false}} />
        
      </Stack>
    </UserProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    resizeMode: "cover",
  },
});
