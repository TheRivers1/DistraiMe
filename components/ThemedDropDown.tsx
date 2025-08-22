import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Colors } from "../constants/Colors";

const ThemedDropDown = ({
  value,
  onChange,
  items,
  placeholder,
  style,
  textStyle,
  optionStyle,
  optionTextStyle,
}) => {
  const [visible, setVisible] = useState(false);
  const boxRef = useRef(null);
  const [boxY, setBoxY] = useState(0);

  return (
    <View style={{ width: "80%" }}>
      <TouchableOpacity
        ref={boxRef}
        style={[styles.box, style]}
        onPress={(e) => {
          setVisible(!visible);
        }}
        onLayout={(event) => {
          setBoxY(event.nativeEvent.layout.y + event.nativeEvent.layout.height);
        }}
        activeOpacity={0.7}
      >
        <Text style={textStyle}>
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
        </Text>
      </TouchableOpacity>
      {visible && (
        <View
          style={[
            styles.dropdown,
            {
              top: boxY,
              left: 0,
              width: "100%",
              maxHeight: "auto",
            },
          ]}
        >
          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, optionStyle]}
                onPress={() => {
                  onChange(item.value);
                  setVisible(false);
                }}
              >
                <Text style={optionTextStyle}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    padding: 20,
  },
  dropdown: {
    position: "absolute",
    backgroundColor: "#ffffff",
    borderRadius: 6,
    elevation: 5,
    zIndex: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default ThemedDropDown;
