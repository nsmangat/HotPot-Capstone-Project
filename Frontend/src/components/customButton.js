import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";

const CustomButton = ({
  onPress,
  text,
  type = "PRIMARY",
  bgColor,
  fgColor,
}) => {
  return (
    <Pressable 
    onPress={onPress}
    style={[
        styles.container,
        styles[`container_${type}`],
        bgColor ? {backgroundColor: bgColor} :{},
        ]}>
      <Text 
      style={[
        styles.text,
        styles[`text_${type}`],
        fgColor ? {color:fgColor}:{},
        ]}>
        {text}
        </Text>
    </Pressable>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    width:width*0.9,
    padding:15,
    marginVertical:10,

    alignItems:'center',
    borderRadius:5,
  },
  container_PRIMARY:{
    backgroundColor: '#1C6758',
  },
  container_TERTIARY:{

  },
  text: {
    fontWeight: "bold",
    color: "white",
  },
  text_TERTIARY:{
    color:'grey'
  },
});

export default CustomButton;
