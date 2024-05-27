import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const CustomInput = ({ value, setValue, placeholder , secureTextEntry}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor="grey"
        secureTextEntry = {secureTextEntry}
      />
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: width * 0.9,
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  input: {
    fontSize: 17,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default CustomInput;
