import React, { useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "../components/themeContext";
import ThemedText from "../components/themeText";
import ScreenTitle from "../components/header";
import axios from "axios";
import { getData } from "../utils/storage";
import { useFocusEffect } from "@react-navigation/native";

const History = () => {
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isHistoryDetailsVisible, setIsHistoryDetailsVisible] = useState(false);
  const swipeableRefs = useRef(new Map());

  const getHistory = async () => {
    try {
      const bearerToken = await getData("bearerToken");
      const headers = {
        Authorization: `Bearer ${bearerToken}`,
      };

      const res = await axios.get(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/protected/history/`,
        { headers }
      );
      const filteredHistory = res.data.filter((report) => !report.is_deleted); //only display reports that are not marked deleted
      setHistory(filteredHistory);
    } catch (err) {
      console.error(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getHistory();
    }, [])
  );

  const toggleDetailsVisible = (item) => {
    setSelectedItem(item);
    setIsHistoryDetailsVisible(!isHistoryDetailsVisible);
  };

  const deleteRow = async (item) => {
    try {
      const bearerToken = await getData("bearerToken");
      const headers = {
        Authorization: `Bearer ${bearerToken}`,
      };

      const res = await axios.delete(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/protected/history/${item.dateTime}`,
        {
          headers,
        }
      );

      console.log(res.data);
      Alert.alert("Success", "Deleted successfully");
      closeSwipable(item.dateTime);
      getHistory();
    } catch (err) {
      console.error(err);
      Alert.alert("Failure", "Network error! Please try again later");
    }
  };

  const closeSwipable = (key) => {
    const swipeable = swipeableRefs.current.get(key);
    if (swipeable) {
      swipeable.close();
    }
  };

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours() % 12 || 12).padStart(2, "0"); // 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
  };

  const renderHistoryRow = ({ item }) => {
    const status = item.is_fixed ? "green" : "red";
    const rightSwipeActions = () => {
      return (
        <TouchableOpacity onPress={() => deleteRow(item)}>
          <View style={styles.deleteButton}>
            <Icon name="delete" size={width * 0.07} color="white" />
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <GestureHandlerRootView>
        <Swipeable
          renderRightActions={rightSwipeActions}
          ref={(ref) => {
            if (ref && !swipeableRefs.current.has(item.dateTime)) {
              swipeableRefs.current.set(item.dateTime, ref);
            }
          }}
        >
          <TouchableOpacity onPress={() => toggleDetailsVisible(item)}>
            <View style={styles.historyItem}>
              <Icon name="circle" size={width * 0.054} color={status} />
              <View style={styles.historyCol}>
                <ThemedText style={styles.text}>{item.address}</ThemedText>
                <ThemedText style={styles.text}>
                  {formatDate(item.dateTime)}
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  const closeHistoryDetails = () => {
    setIsHistoryDetailsVisible(false);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.backgroundColor },
      ]}
    >
      <ScreenTitle name="history" title="Reports History" />
      <FlatList
        data={history}
        renderItem={renderHistoryRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
      <Modal
        visible={isHistoryDetailsVisible}
        transparent={true}
        onRequestClose={closeHistoryDetails}
      >
        <BlurView intensity={50} style={styles.blurContainer}>
          <View style={styles.modalContainer}>
            <ThemedText style={styles.modalTitle}>Report Details</ThemedText>
            <ThemedText style={styles.modalText}>
              Location: {selectedItem?.address}
            </ThemedText>
            <ThemedText style={styles.modalText}>
              Date Time: {formatDate(selectedItem?.dateTime)}
            </ThemedText>
            <ThemedText style={styles.modalText}>
              Description: {selectedItem?.description}
            </ThemedText>
            <ThemedText style={styles.modalText}>Size: Small</ThemedText>
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
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    paddingTop: height * 0.08,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  text: {
    fontSize: width * 0.04,
  },
  list: {
    paddingBottom: height * 0.1,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
    padding: width * 0.04,
    borderRadius: 10,
    marginBottom: height * 0.015,
  },
  historyCol: {
    flex: 1,
    marginLeft: width * 0.03,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: width * 0.05,
    borderRadius: 10,
    marginHorizontal: width * 0.05,
    alignItems: "flex-start",
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: height * 0.02,
  },
  modalText: {
    fontSize: width * 0.045,
    marginBottom: height * 0.015,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  blurContainer: {
    flex: 1,
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.15,
    borderRadius: 10,
    marginVertical: height * 0.03,
  },
});

export default History;
