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
import { useTheme } from "../components/themeContext";
import ScreenTitle from "../components/header";

const DataVisualizations = () => {
  const { theme, themes, toggleTheme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <View
      style={[
        styles.pageView,
        ,
        { backgroundColor: currentTheme.backgroundColor },
      ]}
    >
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

const StaticImage = ({ imageSource }) => {
  return <Image source={imageSource} style={styles.staticImage} />;
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  pageView: {
    flex: 1,
    padding: width * 0.03,
    paddingTop: height * 0.1,
    paddingBottom: height * 0.12,
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
