import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [data, setData] = useState(null);

  const getHelloWorld = async () => {
    axios
      .get("http://" + process.env.EXPO_PUBLIC_IP_ADDRESS + ":3000/")
      .then((response) => {
        console.log(response);
        const extractedLocations = response.data.map((entry) => entry.location);
        console.log("Location values:", extractedLocations);
        setData(extractedLocations);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      {!data && <Button title="Click me" onPress={getHelloWorld} />}
      {data && (
        <View style={styles.container}>
          <Text>{data}</Text>
        </View>
      )}
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
