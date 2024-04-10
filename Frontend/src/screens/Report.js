import React from "react";
import { Text, TextInput, StyleSheet, StatusBar, View } from "react-native";

const Report = () => {
  return (
    <>
      <Text>Report</Text>
      <CustomTextInput
        placeholder="Location"
        title="Location:"
        required={true}
      />
      <CustomTextInput
        placeholder="Example: In the middle of a lane, near the curb, ect."
        title="Additional Pothole Location Details:"
        required={true}
      />
      <CustomTextInput
        placeholder="Example: Large, shallow and round"
        title="Pothole Description:"
        required={true}
      />
    </>
  );
};

const CustomTextInput = (props) => {
  return (
    <View style={styles.textInputContainer}>
      <Text style={styles.label}>
        {props.required ? <Text style={styles.asterisk}>*</Text> : ""}
        {props.title}
      </Text>
      <TextInput
        style={styles.customTextInput}
        placeholder={props.placeholder}
        onChangeText={props.onChangeText}
        value={props.value}
      ></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  customTextInput: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10, // Rounded edges
    paddingLeft: 10, // Padding on the left
    paddingRight: 10, // Padding on the right
    marginBottom: 10,
  },
  textInputContainer: {
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  label: {
    marginBottom: 5,
  },
  asterisk: {
    color: "red",
  },
});

export default Report;
