import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { View } from "react";

export default function AuthLayout() {

  return (
    <Stack screenOptions={{ headerShown: false, animation: "none" }} />
  );
}
