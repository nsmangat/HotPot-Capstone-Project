import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import { Map, Report, History, Settings } from "./screens";
import History from "./screens/History";
import Map from "./screens/Map";
import Settings from "./screens/Settings";
import Report from "./screens/Report";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
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
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E9E6", // Set your desired background color here
  },
});

export default App;
