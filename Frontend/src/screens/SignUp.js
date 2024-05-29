import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import CustomInput from "../components/customInput";
import CustomButton from "../components/customButton";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [password, setPassword] = useState("");

  const onRegisterPressed = () => {
    console.info("Register");
  };

  const onSignInGooglePressed = () => {
    console.info("Sign in with Google");
  };

  const onSignInPressed = () => {
    console.info("Sign in");
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
        text="Have an account? Sign In"
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C6758",
    margin: 10,
  },
  separator: {
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
