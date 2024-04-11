import React, { createContext, useState, useContext } from "react";

const themes = {
  light: {
    backgroundColor: "#D9E9E6",
    textColor: "black",
  },
  dark: {
    backgroundColor: "#333",
    textColor: "white",
  },
};

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
