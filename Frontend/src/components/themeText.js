import React from "react";
import { Text } from "react-native";
import { useTheme } from "./themeContext";

const ThemedText = ({ children, style, ...props }) => {
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];

  return (
    <Text style={[{ color: currentTheme.textColor }, style]} {...props}>
      {children}
    </Text>
  );
};

export default ThemedText;
