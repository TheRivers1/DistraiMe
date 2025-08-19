import { Colors } from "constants/Colors";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

const ThemedDropDown = ({ style, ...props }) => {
  const [open, setOpen] = useState(false);

  const [internalValue, setInternalValue] = useState<string | null>(value);

  return (
    <DropDownPicker
      open={open}
      value={internalValue}
      items={items}
      setOpen={setOpen}
      setValue={setInternalValue}
      setItems={() => {}}
      onChangeValue={onChangeValue}
      placeholder="Select one..."
      style={[
        {
          backgroundColor: Colors.background,
          color: Colors.textColor,
          padding: 20,
          borderRadius: 6,
        },
        style,
      ]}
    />
  );
};

export default ThemedDropDown;
