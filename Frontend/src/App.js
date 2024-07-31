import { StatusBar, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Map, Report, History, Settings } from "./screens";
import History from "./screens/History";
import Map from "./screens/Map";
import Settings from "./screens/Settings";
import Report from "./screens/Report";
import Leaderboard from "./screens/Leaderboard";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import DataVisualizations from "./screens/DataVisualizations";
import { ThemeProvider, useTheme } from "./components/themeContext";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import { auth } from "../firebase/firebase";
import { Suspense, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppContent = () => {
  const { theme, themes } = useTheme(); // Use the useTheme hook to get theme data
  const currentTheme = themes[theme];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Map":
              iconName = "map-marker";
              break;
            case "Report":
              iconName = "file-document";
              break;
            case "History":
              iconName = "history";
              break;
            case "Settings":
              iconName = "cog";
              break;
            case "Data Visualizations":
              iconName = "chart-areaspline";
              break;
            default:
              iconName = "circle";
              break;
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
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
      <Tab.Screen name="Data Visualizations" component={DataVisualizations} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authInstance = getAuth();
    const subscriber = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setInitializing(false);
    });

    return subscriber; // Unsubscribe on unmount
  }, []);

  if (initializing) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="Home" component={AppContent} />
              <Stack.Screen name="Leaderboard" component={Leaderboard} />
            </>

          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="SignUp" component={SignUp} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
});

export default App;
