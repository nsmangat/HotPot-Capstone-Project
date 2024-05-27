import React, { useState } from "react";
import {
  View,
  Switch,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ScreenTitle from "../components/header";
import { TextInput } from "react-native-gesture-handler";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";
import Checkbox from 'expo-checkbox';

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogInPressed = () => {
    console.info("Log in");
  };

  const onForgotPasswordPressed = () => {
    console.info("Forgot Password");
  };

  const onSignInGooglePressed = () => {
    console.info("Sign In with Google");
  };

  const onSignUpPressed = () => {
    console.info("Sign up");
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
    paddingTop: 70,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.04,
    paddingHorizontal: width * 0.05,
  },
  formInput: {
    fontSize: 20,
  },
  buttonLabel: {
    fontSize: 20,
  },
  rememberMeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: '80%',  // Adjust the width to match your design
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
