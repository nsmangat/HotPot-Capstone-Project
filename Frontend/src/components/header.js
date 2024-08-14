import React from "react";
import styles from "./styles";
import { View, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const ScreenTitle = (props) => {
  return (
    <View style={styles.titleContainer}>
      <MaterialCommunityIcons name={props.name} size={50} color="#1C6758" />
      <Text style={styles.screenTitle}>{props.title}</Text>
    </View>
  );
};

export default ScreenTitle;
