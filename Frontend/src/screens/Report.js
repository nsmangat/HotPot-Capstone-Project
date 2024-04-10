import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const Report = () => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.pageView}>
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
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={{ color: "white" }}>Upload Image</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
    </View>
  );
};

const CustomTextInput = (props) => {
  return (
    <View style={styles.customTextInputComponent.textInputContainer}>
      <Text style={styles.customTextInputComponent.label}>
        {props.required ? (
          <Text style={styles.customTextInputComponent.asterisk}>*</Text>
        ) : (
          ""
        )}
        {props.title}
      </Text>
      <TextInput
        style={styles.customTextInputComponent.customTextInput}
        placeholder={props.placeholder}
        onChangeText={props.onChangeText}
        value={props.value}
      ></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  pageView: {
    backgroundColor: "#D9E9E6",
    flex: 1,
  },
  image: {
    width: "85%",
    height: "40%",
    marginTop: 10,
  },
  imageContainer: {
    alignItems: "center",
  },
  imageButton: {
    backgroundColor: "#0C9479",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  customTextInputComponent: {
    customTextInput: {
      height: 50,
      borderColor: "black",
      backgroundColor: "white",
      borderWidth: 1,
      borderRadius: 10, // Rounded edges
      paddingLeft: 10, // Padding on both sides of the input
      paddingRight: 10,
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
  },
});

export default Report;
