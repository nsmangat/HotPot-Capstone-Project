import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    axios
      .get("http://" + process.env.EXPO_PUBLIC_IP_ADDRESS + ":3000/")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log("logging: " + data);

  return (
    <View style={styles.container}>
      <Text>{process.env.EXPO_PUBLIC_IP_ADDRESS}</Text>
      <Text>Data is: {data}</Text>
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
