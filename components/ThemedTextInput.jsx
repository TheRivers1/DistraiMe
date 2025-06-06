import { TextInput } from "react-native";
import { Colors } from "../constants/Colors";

const ThemedTextInput = ({ style, ...props }) => {
  return (
    <TextInput
      style={[
        {
          backgroundColor: Colors.background,
          color: Colors.textColor,
          padding: 20,
          borderRadius: 6,
        },
        style
      ]}
      {...props}
    />
  );
};

export default ThemedTextInput;
