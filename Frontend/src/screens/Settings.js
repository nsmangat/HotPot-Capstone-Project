import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPushNotification, setPushNotification] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    console.log(!isDarkMode);
  };

  const togglePushNotification = () => {
    setPushNotification(!isPushNotification);
    console.log("push" + !isPushNotification);
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Icon name="cog" size={50} color="#1C6758" />
          <Text style={styles.header}>Settings</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.text}>Push Notification</Text>
          <Switch
            value={isPushNotification}
            onValueChange={togglePushNotification}
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.text}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
        <View style={styles.separator}></View>
        <View style={styles.itemContainer}>
          <Text style={styles.moreText}>More</Text>
        </View>
        <TouchableOpacity style={styles.itemContainer}>
          <Text style={styles.text}>About Us</Text>
          <Icon name="chevron-right" size={width * 0.05} color="#4B4B4B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}>
          <Text style={styles.text}>Privacy Policy</Text>
          <Icon name="chevron-right" size={width * 0.05} color="#4B4B4B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}>
          <Text style={styles.text}>Terms and conditions</Text>
          <Icon name="chevron-right" size={width * 0.05} color="#4B4B4B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E9E6",
    padding: width * 0.03,
    paddingTop: height * 0.05,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  header: {
    color: "#1C6758",
    fontSize: width * 0.1,
    fontWeight: "bold",
    marginLeft: width * 0.05,
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
