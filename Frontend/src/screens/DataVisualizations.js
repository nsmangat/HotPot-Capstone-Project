import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from '../components/themeContext';
import ThemedText from "../components/themeText";

const DataVisualizations = () => {
  const { theme, themes, toggleTheme } = useTheme(); 
  const currentTheme = themes[theme];

  return (
    <View style={[styles.pageView, ,{ backgroundColor: currentTheme.backgroundColor }]}>
      <ScreenTitle name="chart-areaspline" title="Data Visualizations" />
      <ScrollView horizontal={false} style={styles.scrollView}>
        <StaticImage
          imageSource={require("../../assets/DataVisPlaceholder1.JPG")}
        />
        <StaticImage
          imageSource={require("../../assets/DataVisPlaceholder2.JPG")}
        />
      </ScrollView>
    </View>
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

const StaticImage = ({ imageSource }) => {
  return <Image source={imageSource} style={styles.staticImage} />;
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
  scrollView: {
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  staticImage: {
    width: width * 0.9,
    height: height * 0.3,
    marginRight: width * 0.02,
    marginLeft: width * 0.04,
    resizeMode: "contain",
  },
});

export default DataVisualizations;
