import { Stack, useRouter, usePathname } from "expo-router";
import { Pressable, Text } from "react-native";

export default function DistraimeLayout() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Stack
      screenOptions={{
        headerLeft: () =>
          pathname !== "/main/distraime" ? (
            <Pressable onPress={() => router.replace("/(main)/(distraime)")}>
              <Text
                style={{ marginLeft: 16, color: "#007AFF", fontWeight: "bold" }}
              >
                Voltar
              </Text>
            </Pressable>
          ) : null,
      }}
    />
  );
}
