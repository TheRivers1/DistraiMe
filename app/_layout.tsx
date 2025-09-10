import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { useState, useEffect, createContext } from "react";
import { supabase } from "lib/supabase";
import { Session } from "@supabase/supabase-js";

export const AuthContext = createContext<{
  session: Session | null;
  setSession: (session: Session | null) => void;
}>({
  session: null,
  setSession: () => {},
});

const RootLayout = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "black",
          headerShown: false,
        }}
      >
        {session && session.user ? (
          <>
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(main)/(dashboard)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(main)/(distraime)/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="index" options={{ headerShown: false }} />{" "}
          </>
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
      </Stack>
    </AuthContext.Provider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
