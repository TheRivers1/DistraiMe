import { StyleProp, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ThemedViewProps = {
  style: StyleProp<ViewStyle>;
  safe: boolean;
  children?: React.ReactNode;
  [key: string]: any; // Allow other props like 'children'
};

const ThemedView = ({ style, safe = false, ...props }: ThemedViewProps) => {
  if (!safe) return <View style={style} {...props} />;

  const insets = useSafeAreaInsets();

  return (
    <View
      style={[{ paddingTop: insets.top, paddingBottom: insets.bottom }, style]}
      {...props}
    />
  );
};
export default ThemedView;
