import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Text, Alert } from "react-native";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import { auth } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { storeData } from "../utils/storage";

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [password, setPassword] = useState("");

  const onRegisterPressed = async () => {
    console.info("Register");
    try {
      const userCredential = createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await storeData("user", user);

      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
      Alert.alert("Invalid input!", error.message, [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  const onSignInGooglePressed = () => {
    console.info("Sign In with Google");
  };

  const onSignInPressed = () => {
    console.info("Sign In");
    navigation.navigate("Login");
  };

  const onTermsOfUsePressed = () => {
    console.info("Terms Of Use");
  };

  const onPrivacyPolicyPressed = () => {
    console.info("Privacy Policy");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>
      <CustomInput
        placeholder="Username"
        value={username}
        setValue={setUsername}
      ></CustomInput>
      <CustomInput
        placeholder="Email"
        value={email}
        setValue={setEmail}
      ></CustomInput>
      <CustomInput
        placeholder="Phone Number"
        value={phoneNum}
        setValue={setPhoneNum}
        keyboardType="numeric"
      ></CustomInput>
      <CustomInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry
      ></CustomInput>

      <CustomButton text="Register" onPress={onRegisterPressed}></CustomButton>

      <Text style={styles.text}>
        By registering, you confirm that you accept our {""}
        <Text style={styles.link} onPress={onTermsOfUsePressed}>
          Terms of Use
        </Text>{" "}
        and {""}
        <Text style={styles.link} onPress={onPrivacyPolicyPressed}>
          Priavcy Policy
        </Text>
      </Text>

      <View style={styles.separator}></View>

      <CustomButton
        text="Sign In with Google"
        onPress={onSignInGooglePressed}
        bgColor="#FAE9EA"
        fgColor="#DD4D44"
      ></CustomButton>
      <CustomButton
        text="Have an account? Sign in"
        onPress={onSignInPressed}
        type="TERTIARY"
      ></CustomButton>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: height * 0.11,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#1C6758",
    paddingBottom: height * 0.02,
  },
  separator: {
    height: 1,
    backgroundColor: "black",
    marginVertical: height * 0.05,
  },
  text: {
    color: "grey",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  link: {
    color: "#FDB075",
  },
});

export default SignUp;
