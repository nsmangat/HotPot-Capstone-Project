import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://" + process.env.EXPO_PUBLIC_IP_ADDRESS + ":3000/")
      .then((response) => {
        console.log(response)
        const extractedLocations = response.data.map(entry => entry.location);
        console.log('Location values:', extractedLocations);
        setData(extractedLocations);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log("logging: " + data);

  return (
    <View style={styles.container}>
      <Text>{process.env.EXPO_PUBLIC_IP_ADDRESS}</Text>
      <Text>Pothole Location: {data}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
