import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const History = () => {
  const [history, setHistory] = useState([
    {
      location: "Forest Drive,Waterloo, ON, Canada",
      dateTime: "2024-04-08 10:00 AM",
    },
    {
      location: "53 Street,Waterloo, AB, Canada",
      dateTime: "2024-04-08 3:00 PM",
    },
    {
      location: "Domaine Alexandre,Waterloo, QC, Canada",
      dateTime: "2024-04-09 11:00 PM",
    },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.list}>
        <Text style={styles.text}>{item.location}</Text>
        <Text style={styles.text}>{item.dateTime}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Icon name="history" size={50} color="#1C6758" />
          <Text style={styles.header}>Reports History</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>Location</Text>
          <Text style={styles.title}>Time Reported</Text>
        </View>
        <View style={styles.itemContainer}>
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E9E6",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  header: {
    color: "#1C6758",
    fontSize: width * 0.09,
    fontWeight: "bold",
    marginLeft: width * 0.05,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.04,
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  text: {
    fontSize: width * 0.04,
  },
  list:{
    justifyContent: "space-between",
    alignItems: "left",
    marginBottom: height * 0.04,
  }

});

export default History;
