import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Report = () => {
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [requiredFieldsFilled, setRequiredFieldsFilled] = useState(false);

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

  const handleSuccess = () => {
    setLocation("");
    setDetails("");
    setDescription("");
    setImage(null);
    setRequiredFieldsFilled(false); // Reset requiredFieldsFilled state
  };

  // Clear all fields after successful submission

  const handleSubmit = () => {
    //API call later

    if (!requiredFieldsFilled) {
      Alert.alert(
        "Error",
        "Please fill out all required fields before submitting."
      );
      return;
    }

    Alert.alert("Success", "Pothole successfully reported!", [
      { text: "OK", onPress: () => handleSuccess() },
    ]);
  };

  const checkRequiredFields = () => {
    // Check if all required fields are filled out
    if (location !== "" && details !== "" && description !== "") {
      setRequiredFieldsFilled(true);
    } else {
      setRequiredFieldsFilled(false);
    }
  };

  return (
    <View style={styles.pageView}>
      <ScreenTitle name="file-document" title="Report a Pothole" />
      <View style={styles.customTextInputComponent.textInputContainer}>
        <Text>
          <Text style={styles.customTextInputComponent.asterisk}>*</Text>{" "}
          indicates required fields.
        </Text>
        <Text>Uploading an image is optional.</Text>
      </View>
      <CustomTextInput
        placeholder="Location"
        title="Location:"
        required={true}
        onChangeText={setLocation}
        checkRequiredFields={checkRequiredFields}
        value={location}
      />
      <CustomTextInput
        placeholder="Example: In the middle of a lane, near the curb, ect."
        title="Additional Pothole Location Details:"
        required={true}
        onChangeText={setDetails}
        checkRequiredFields={checkRequiredFields}
        value={details}
      />
      <CustomTextInput
        placeholder="Example: Large, shallow and round"
        title="Pothole Description:"
        required={true}
        onChangeText={setDescription}
        checkRequiredFields={checkRequiredFields}
        value={description}
      />
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={{ color: "white" }}>Upload Image</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        {requiredFieldsFilled && (
          <CustomButton
            title="Submit"
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        )}
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
        onChangeText={(text) => {
          props.onChangeText(text);
          props.checkRequiredFields();
        }}
        value={props.value}
      ></TextInput>
    </View>
  );
};

const CustomButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const ScreenTitle = (props) => {
  return (
    <View style={styles.titleContainer}>
      <MaterialCommunityIcons name={props.name} size={50} color="#1C6758" />
      <Text style={styles.screenTitle}>{props.title}</Text>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  screenTitle: {
    color: "#1C6758",
    fontSize: width * 0.1,
    fontWeight: "bold",
    marginLeft: width * 0.05,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  pageView: {
    backgroundColor: "#D9E9E6",
    flex: 1,
    paddingTop: height * 0.05,
    // paddingHorizontal: width * 0.02,
  },
  image: {
    width: "85%",
    height: "40%",
    marginTop: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: "#0C9479",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    // marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#1C6758",
    paddingHorizontal: width * 0.4,
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: height * 0.02,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
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
