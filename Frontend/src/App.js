import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Map, Report, History, Settings } from "./screens";
import History from "./screens/History";
import Map from "./screens/Map";
import Settings from "./screens/Settings";
import Report from "./screens/Report";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import DataVisualizations from "./screens/DataVisualizations";
import { ThemeProvider,useTheme } from "./components/themeContext";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const AppContent = () => {
  const { theme, themes } = useTheme(); // Use the useTheme hook to get theme data
  const currentTheme = themes[theme];
  return (
    <SafeAreaView style={[styles.safeContainer,{ backgroundColor: currentTheme.backgroundColor }]}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === "Map") {
                iconName = "map-marker";
              } else if (route.name === "Report") {
                iconName = "file-document";
              } else if (route.name === "History") {
                iconName = "history";
              } else if (route.name === "Settings") {
                iconName = "cog";
              } else if (route.name === "Data Visualizations") {
                iconName = "chart-areaspline";
              }

              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            },
            tabBarActiveTintColor: "green",
            tabBarInactiveTintColor: "black",
            headerShown: false,
          })}
        >
          <Tab.Screen name="Map" component={Map} />
          <Tab.Screen name="Report" component={Report} />
          <Tab.Screen name="History" component={History} />
          <Tab.Screen name="Settings" component={Settings} />
          <Tab.Screen
            name="Data Visualizations"
            component={DataVisualizations}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    // backgroundColor: "#D9E9E6",}, // it's only changing the status bar for some reason
    // container: {
    //   flex: 1,
    //   backgroundColor: "#D9E9E6",
    // },
  },
});

export default App;
