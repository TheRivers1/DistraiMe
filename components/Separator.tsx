import { View, ViewStyle } from "react-native";

type SpacerProps = {
  width?: number | `${number}%`;
  height?: number;
  backgroundColor?: string;
};

const Spacer = ({
  width = "100%",
  height = 2,
  backgroundColor = "#bdbdbd",
}: SpacerProps) => {
  const style: ViewStyle = { width, height, backgroundColor };

  return <View style={style} />;
};

export default Spacer;
