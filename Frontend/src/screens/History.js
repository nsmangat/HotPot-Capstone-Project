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
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { BlurView } from "expo-blur";

const History = () => {
  const [history, setHistory] = useState([
    {
      location: "40 King St S, Waterloo, ON N2J 2W8",
      dateTime: "2024-04-08 10:00 AM",
      status: "not_fixed",
    },
    {
      location: "187 King St S #102, Waterloo, ON N2J 1R1",
      dateTime: "2024-04-08 3:00 PM",
      status: "not_fixed",
    },
    {
      location: "622 King St N Unit 3, Waterloo, ON N2V 0C7",
      dateTime: "2024-04-09 11:00 PM",
      status: "not_fixed",
    },
    {
      location: "239 Weber St N, Waterloo, ON N2J 3H5",
      dateTime: "2024-04-09 11:00 PM",
      status: "fixed",
    },
    {
      location: "2 King St N, Waterloo, ON N2J 1N8",
      dateTime: "2024-04-09 11:00 PM",
      status: "fixed",
    },
    {
      location: "103 King St N, Waterloo, ON N2J 2X5",
      dateTime: "2024-04-09 11:00 PM",
      status: "fixed",
    },
    {
      location: "150 University Ave W Unit 5B, Waterloo, ON N2L 3E4",
      dateTime: "2024-04-09 11:00 PM",
      status: "fixed",
    },
    {
      location: "310 The Boardwalk, Waterloo, ON N2T 0A6",
      dateTime: "2024-04-09 11:00 PM",
      status: "not_fixed",
    },
    {
      location: "203 Lester St, Waterloo, ON N2L 0B5",
      dateTime: "2024-04-09 11:00 PM",
      status: "fixed",
    },
    {
      location: "355 Erb St. W, Waterloo, ON N2L 1W4",
      dateTime: "2024-04-09 11:00 PM",
      status: "fixed",
    },
    {
      location: "14 Princess St W, Waterloo, ON N2L 2X8",
      dateTime: "2024-04-09 11:00 PM",
      status: "not_fixed",
    },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isHistoryDetailsVisible, setIsHistoryDetailsVisible] = useState(false);

  const toggleDetailsVisible = (item) => {
    setSelectedItem(item);
    setIsHistoryDetailsVisible(!isHistoryDetailsVisible);
  };

  const renderStatusIcon = ({ item }) => {
    const status = item.status === "fixed" ? "green" : "red";

    return (
      <TouchableOpacity onPress={() => toggleDetailsVisible(item)}>
        <View style={styles.historyItem}>
          <View>
            <Icon name="circle" size={width * 0.054} color={status} />
          </View>
          <View style={styles.historyCol}>
            <Text style={styles.text}>{item.location}</Text>
            <Text style={styles.text}>{item.dateTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const closeHistoryDetails = () => {
    setIsHistoryDetailsVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Icon name="history" size={50} color="#1C6758" />
          <Text style={styles.header}>Reports History</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>Location</Text>
          <Text style={styles.title}>Time Reported</Text>
        </View>
        <View style={styles.list}>
          <FlatList
            data={history}
            renderItem={renderStatusIcon}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <Modal
          visible={isHistoryDetailsVisible}
          transparent={true}
          onRequestClose={closeHistoryDetails}
        >
          <BlurView intensity={20} style={styles.blurContainer}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Report Details</Text>
              <Text style={styles.text}>
                Location: {selectedItem?.location}
              </Text>
              <Text style={styles.text}>
                Date Time: {selectedItem?.dateTime}
              </Text>
              <Text style={styles.text}>Description: This is description</Text>
              <Text style={styles.text}>Size: Small</Text>
              <TouchableOpacity
                onPress={closeHistoryDetails}
                style={styles.closeButton}
              >
                <Icon name="close" size={width * 0.054} />
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E9E6",
    padding: width * 0.03,
    paddingTop: height * 0.05,
    paddingBottom: height * 0.06,
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
    alignItems: "left",
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  text: {
    fontSize: width * 0.04,
  },
  list: {
    marginBottom: height * 0.05,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: width * 0.03,
  },
  historyItem: {
    alignItems: "left",
    marginBottom: height * 0.02,
    flexDirection: "row",
    maxWidth: width * 0.97,
  },
  historyCol: {},
  modalContainer: {
    backgroundColor: "white",
    padding: width * 0.05,
    borderRadius: 10,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.4,
    alignItems: "left",
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  blurContainer: {
    flex: 1,
    overflow: "hidden",
  },
});

export default History;
