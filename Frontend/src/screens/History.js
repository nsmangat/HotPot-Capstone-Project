import React, { useState, useCallback } from "react";
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
      setHistory(res.data);
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
      getHistory();
    } catch (err) {
      console.error(err);
      Alert.alert("Failure", "Network error! Please try again later");
    }
  };

  const renderHistoryRow = ({ item }) => {
    const status = item.status === "fixed" ? "green" : "red";
    const rightSwipeActions = () => {
      return (
        <TouchableOpacity onPress={() => deleteRow(item)}>
          <Icon name="delete" size={width * 0.07} style={styles.deleteButton} />
        </TouchableOpacity>
      );
    };

    return (
      <GestureHandlerRootView>
        <Swipeable renderRightActions={rightSwipeActions}>
          <TouchableOpacity onPress={() => toggleDetailsVisible(item)}>
            <View style={styles.historyItem}>
              <View>
                <Icon name="circle" size={width * 0.054} color={status} />
              </View>
              <View style={styles.historyCol}>
                <ThemedText style={styles.text}>{item.address}</ThemedText>
                <ThemedText style={styles.text}>{item.dateTime}</ThemedText>
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

      <View style={styles.itemContainer}>
        <ThemedText style={styles.title}>Location</ThemedText>
        <ThemedText style={styles.title}>Time Reported</ThemedText>
      </View>
      <View style={styles.list}>
        <FlatList
          data={history}
          renderItem={renderHistoryRow}
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
            <ThemedText style={styles.title}>Report Details</ThemedText>
            <ThemedText style={styles.text}>
              Location: {selectedItem?.address}
            </ThemedText>
            <ThemedText style={styles.text}>
              Date Time: {selectedItem?.dateTime}
            </ThemedText>
            <ThemedText style={styles.text}>
              Description: This is description
            </ThemedText>
            <ThemedText style={styles.text}>Size: Small</ThemedText>
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
    padding: width * 0.03,
    paddingTop: height * 0.1,
    paddingBottom: height * 0.12,
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
  deleteButton: {
    backgroundColor: "red",
    color: "white",
  },
});

export default History;
