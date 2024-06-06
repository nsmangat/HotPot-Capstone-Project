import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import ScreenTitle from "../components/header";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import Checkbox from "expo-checkbox";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { storeData, removeData } from "../utils/storage";

const Login = ({ navigation }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogInPressed = async () => {
    console.info("Log in");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (rememberMe) {
        await storeData("user", user);
      } else {
        await removeData("user");
      }
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Incorrect input!", "Please re-enter your login input", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  const onForgotPasswordPressed = () => {
    console.info("Forgot Password");
  };

  const onSignInGooglePressed = () => {
    console.info("Sign In with Google");
  };

  const onSignUpPressed = () => {
    console.info("Sign up");
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <ScreenTitle title="Hi, Welcome Back!" />
      <CustomInput
        placeholder="Email"
        value={email}
        setValue={setEmail}
      ></CustomInput>
      <CustomInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry
      ></CustomInput>

      <CustomButton text="Log In" onPress={onLogInPressed}></CustomButton>
      <View style={styles.rememberMeContainer}>
        <View style={styles.rememberMe}>
          <Checkbox
            value={rememberMe}
            onValueChange={setRememberMe}
            style={styles.checkbox}
          />
          <Text style={styles.rememberMeText}>Remember Me</Text>
        </View>
        <TouchableOpacity onPress={onForgotPasswordPressed}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator}></View>

      <CustomButton
        text="Sign In with Google"
        onPress={onSignInGooglePressed}
        bgColor="#FAE9EA"
        fgColor="#DD4D44"
      ></CustomButton>
      <CustomButton
        text="Don't have an account? Sign Up"
        onPress={onSignUpPressed}
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
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.04,
    paddingHorizontal: width * 0.05,
  },
  rememberMeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginBottom: height * 0.04,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberMeText: {
    marginLeft: 8,
  },
  checkbox: {
    alignSelf: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "black",
    marginVertical: height * 0.05,
  },
});

export default Login;
