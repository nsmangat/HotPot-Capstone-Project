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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "../components/themeContext";
import ThemedText from "../components/themeText";
import ScreenTitle from "../components/header";
import axios from "axios";
import { getData } from "../utils/storage";
import { useEffect } from "react";
import { geocode } from "../utils/mapbox/geocodeService.js";

const Report = ({ route }) => {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [details, setDetails] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [requiredFieldsFilled, setRequiredFieldsFilled] = useState(false);
  const { theme, themes, toggleTheme } = useTheme();
  const currentTheme = themes[theme];

  //Location stuff from map
  useEffect(() => {
    const { latitudeFromMap, longitudeFromMap, Address } = route.params || {};

    if (latitudeFromMap && longitudeFromMap && Address) {
      setCoordinates(`${latitudeFromMap}, ${longitudeFromMap}`);
      setLocation(Address);
    }
  }, [route.params]); // Run only when route.params changes

  //console.log("REPORT -- Full Address: ", location, "Coordinates: ", coordinates);

  // For uploading image, not using this anymore
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

  // Clear all fields after successful submission
  const handleSuccess = () => {
    setLocation("");
    setCoordinates("");
    setDetails("");
    setDescription("");
    setImage(null);
    setRequiredFieldsFilled(false); // Reset requiredFieldsFilled state
  };

  const handleSubmit = async () => {
    //API call later

    let coords = coordinates;

    if (coords === "") {
      try {
        const response = await geocode(location);

        if (!response || !response.features || response.features.length === 0) {
          throw new Error("No features found in geocode response");
        }

        const feature = response.features[0];
        if (!feature.properties || !feature.properties.coordinates) {
          throw new Error("Invalid feature structure in geocode response");
        }

        coords = `${feature.properties.coordinates.latitude}, ${feature.properties.coordinates.longitude}`;
        console.log(
          "REPORT SUBMIT-- Full Address: ",
          location,
          "Coordinates: ",
          coords
        );
      } catch (error) {
        console.error("Error during geocoding:", error);
        Alert.alert("Error", "Unable to fetch coordinates. Please try again.");
        return;
      }
    }

    if (!requiredFieldsFilled) {
      Alert.alert(
        "Error",
        "Please fill out all required fields before submitting."
      );
      return;
    }

    //Getting this from login, if there's an issue getting this might be
    //because a login is required but seems to work when user is remembered
    const bearerToken = await getData("bearerToken");

    axios
      .post(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/protected/report`,
        {
          description: description,
          details: details,
          coordinates: coords,
          address: location,
        },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    Alert.alert("Success", "Pothole successfully reported!", [
      { text: "OK", onPress: () => handleSuccess() },
    ]);
  };

  // Check if the required fields are filled out
  const checkRequiredFields = () => {
    if (location !== "" && details !== "" && description !== "") {
      setRequiredFieldsFilled(true);
    } else {
      setRequiredFieldsFilled(false);
    }
  };

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        { backgroundColor: currentTheme.backgroundColor },
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollView,
          { backgroundColor: currentTheme.backgroundColor },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.pageView,
            { backgroundColor: currentTheme.backgroundColor },
          ]}
        >
          <ScreenTitle name="file-document" title="Report a Pothole" />
          <View style={styles.customTextInputComponent.textInputContainer}>
            <ThemedText>
              <Text style={styles.customTextInputComponent.asterisk}>*</Text>{" "}
              indicates required fields.
            </ThemedText>
            <ThemedText>Uploading an image is optional.</ThemedText>
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
            placeholder="Example: In the middle of a lane, near the curb, etc."
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
            <CustomButton
              title="Submit"
              onPress={handleSubmit}
              disabled={!requiredFieldsFilled}
              style={
                requiredFieldsFilled
                  ? styles.submitButton
                  : styles.disabledButton
              }
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Component for text inputs
const CustomTextInput = (props) => {
  return (
    <View style={styles.customTextInputComponent.textInputContainer}>
      <ThemedText style={styles.customTextInputComponent.label}>
        {props.required ? (
          <Text style={styles.customTextInputComponent.asterisk}>*</Text>
        ) : (
          ""
        )}
        {props.title}
      </ThemedText>
      <TextInput
        style={styles.customTextInputComponent.customTextInput}
        placeholder={props.placeholder}
        onChangeText={(text) => {
          props.onChangeText(text);
          // props.checkRequiredFields();
        }}
        onEndEditing={(e) => props.checkRequiredFields()}
        value={props.value}
      ></TextInput>
    </View>
  );
};

// Component for buttons
const CustomButton = ({ title, onPress, style, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  pageView: {
    flex: 1,
    padding: width * 0.03,
    paddingTop: height * 0.1,
    paddingBottom: height * 0.25,
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
  },
  submitButton: {
    backgroundColor: "#1C6758",
    paddingHorizontal: width * 0.3,
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
  disabledButton: {
    backgroundColor: "#808080",
    paddingHorizontal: width * 0.3,
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: height * 0.02,
  },
});

export default Report;
