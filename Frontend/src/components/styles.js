// Styling for every page such as background colour

import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E9E6",
  },
  screenTitle: {
    color: "#1C6758",
    fontSize: width * 0.09,
    fontWeight: "bold",
    // marginLeft: width * 0.01,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.03,
  },
});

export default styles;
