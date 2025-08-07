import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "white" },
        headerTintColor: "black",
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(main)/(dashboard)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(main)/(distraime)/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
