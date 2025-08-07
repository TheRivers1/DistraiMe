import { ActivityIndicator } from "react-native";
import { Colors } from "../constants/Colors";
import ThemedView from "./ThemedView";

const ThemedLoader = () => {
  return (
    <ThemedView
      safe={false}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <ActivityIndicator size="large" color={Colors.textColor} />
    </ThemedView>
  );
};
export default ThemedLoader;
