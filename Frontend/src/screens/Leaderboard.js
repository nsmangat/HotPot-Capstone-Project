import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from "../components/themeContext";
import ScreenTitle from "../components/header";
import ThemedText from "../components/themeText";
import { getData } from "../utils/storage";
import axios from "axios";

const Leaderboard = () => {
    const { theme, themes } = useTheme();
    const currentTheme = themes[theme];
    console.info("Leaderboard");

    const [leaderboard, setLeaderboard] = useState([]);

    const getLeaderboard = async () => {
        try {
          const bearerToken = await getData("bearerToken");
          const headers = {
            Authorization: `Bearer ${bearerToken}`,
          };
    
          const res = await axios.get(
            `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/protected/leaderboard/`,
            { headers }
          );
          setLeaderboard(res.data);
        } catch (err) {
          console.error(err);
        }
    
      }
    
      useFocusEffect(
        useCallback(() => {
          getLeaderboard();
        }, [])
      );

    const renderLeaderboardRow = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => console.info("row pressed")}>
                <View style={[styles.leaderboardItem, item.is_current_user && styles.highlightedItem]}>
                    <View style={styles.leaderboardCol}>
                        <ThemedText style={styles.text}>{item.first_name}</ThemedText>
                        <ThemedText style={styles.text}>{item.fixed_potholes_count}</ThemedText>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderHeader = () => (
        <View style={styles.headerItem}>
            <ThemedText style={styles.headerText}>Name</ThemedText>
            <ThemedText style={styles.headerText}>Potholes Reported</ThemedText>
        </View>
    );

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: currentTheme.backgroundColor },
            ]}
        >
            <ScreenTitle name="trophy" title="Leaderboard" />
            {renderHeader()}
            <FlatList
                data={leaderboard}
                renderItem={renderLeaderboardRow}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
            />

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
    leaderboardItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f8f8f8",
        padding: width * 0.04,
        borderRadius: 10,
        marginBottom: height * 0.015,
        width: width * 0.7,
        alignSelf: "center",
    },
    leaderboardCol: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
    headerItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f8f8f8",
        padding: width * 0.04, // Adjusted padding for header
        borderRadius: 10,
        width: width * 0.7, // Set a specific width to make it narrower
        alignSelf: 'center', // Center the item in the list
        marginBottom: height * 0.015, // Add margin bottom to separate from list items
    },
    headerText: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
    highlightedItem: {
        backgroundColor: '#6fdc6f', // Highlight color for rows where name is "John"
      },
});

export default Leaderboard;