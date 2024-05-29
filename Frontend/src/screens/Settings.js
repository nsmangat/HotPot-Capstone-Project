import React, { useState } from "react";
import {
  View,
  Switch,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../components/themeContext";
import ThemedText from "../components/themeText";
import ScreenTitle from "../components/header";
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
  const [isPushNotification, setPushNotification] = useState(true);
  const togglePushNotification = () => {
    setPushNotification(!isPushNotification);
    console.log("push" + !isPushNotification);
  };

  const { theme, themes, toggleTheme } = useTheme();
  const currentTheme = themes[theme];
  const navigation = useNavigation();

  const onAboutUsPressed = () => {
    console.info("About Us");
  };

  const onPrivacyPolicyPressed = () => {
    console.info("Privacy Policy");
  };

  const onTermsAndConditionsPressed = () => {
    console.info("Terms and Conditions");
  };

  const onLogoutPressed = () => {
    console.info("Logout");
    navigation.navigate("Login")
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.backgroundColor },
      ]}
    >
      <ScreenTitle name="cog" title="Settings" />
      <View style={styles.itemContainer}>
        <ThemedText style={styles.text}>Push Notification</ThemedText>
        <Switch
          value={isPushNotification}
          onValueChange={togglePushNotification}
        />
      </View>
      <View style={styles.itemContainer}>
        <ThemedText style={styles.text}>Dark Mode</ThemedText>
        <Switch value={theme === "dark"} onValueChange={toggleTheme} />
      </View>
      <View style={styles.separator}></View>
      <View style={styles.itemContainer}>
        <ThemedText style={styles.moreText}>More</ThemedText>
      </View>
      <TouchableOpacity style={styles.itemContainer} onPress={onAboutUsPressed}>
        <ThemedText style={styles.text}>About Us</ThemedText>
        <Icon name="chevron-right" size={width * 0.05} color="#999" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={onPrivacyPolicyPressed}>
        <ThemedText style={styles.text}>Privacy Policy</ThemedText>
        <Icon name="chevron-right" size={width * 0.05} color="#999" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={onTermsAndConditionsPressed}>
        <ThemedText style={styles.text}>Terms and Conditions</ThemedText>
        <Icon name="chevron-right" size={width * 0.05} color="#999" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={onLogoutPressed}>
        <ThemedText style={styles.text}>Log out</ThemedText>
        <Icon name="logout" size={width * 0.05} color="#999" />
      </TouchableOpacity>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.03,
    paddingTop: height * 0.1,
    paddingBottom: height * 0.12,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.04,
    paddingHorizontal: width * 0.05,
  },
  text: {
    fontSize: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "black",
    marginVertical: height * 0.05,
  },
  moreText: {
    marginRight: width * 0.3,
    fontSize: 20,
    color: "#999",
  },
});

export default Settings;
