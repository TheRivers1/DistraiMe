import { View } from "react-native";

const Spacer = ({ width = "100%", height = 2, backgroundColor = "#bdbdbd" }) => {
  return <View style={{ width, height, backgroundColor }} />;
};

export default Spacer;
