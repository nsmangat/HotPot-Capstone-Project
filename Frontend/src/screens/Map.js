import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { useTheme } from '../components/themeContext';
import ThemedText from "../components/themeText";
import MapView, { Callout, Marker } from "react-native-maps";
import { reverseGeocode } from "../utils/mapbox/geocodeService.js";
import { useFocusEffect } from "@react-navigation/native";
import { getData } from "../utils/storage";
import axios from "axios";

const Map = ({ navigation }) => {
  const { theme, themes, toggleTheme } = useTheme();
  const currentTheme = themes[theme];

  const [markers, setMarkers] = useState([]);

  const [draggableMarkerCoord, setDraggableMarkerCoord] = useState({
    latitude: 43.48010068075527,
    longitude: -80.51533622811151
  });

  const getPotholes = async () => {
    try {
      const bearerToken = await getData("bearerToken");
      const headers = {
        Authorization: `Bearer ${bearerToken}`,
      };

      const res = await axios.get(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/protected/map/`,
        { headers }
      );
      setMarkers(res.data);
    } catch (err) {
      console.error(err);
    }

  }

  useFocusEffect(
    useCallback(() => {
      getPotholes();
    }, [])
  );

  const addMarker = () => {
    const newMarker = {
      index: markers.length + 1,
      latitude: draggableMarkerCoord.latitude,
      longitude: draggableMarkerCoord.longitude,
      title: "Pothole added with pin drop!",
      description: "Pothole added with pin drop!",
    };

    setMarkers([...markers, newMarker]);
    //resetDraggableMarker();
  };


  const resetDraggableMarker = () => {
    setDraggableMarkerCoord({
      latitude: 43.48010068075527,
      longitude: -80.51533622811151
    });
  };

  const draggablePinOnPress = async () => {
    console.log("Button pressed!");

    //addMarker();

    try {
      const response = await reverseGeocode(draggableMarkerCoord.longitude, draggableMarkerCoord.latitude)
      const fullAddressGeo = response["features"][0]["properties"]["full_address"];
      //console.log("MAP -- Full address: ", fullAddressGeo);

      navigation.navigate("Report", {
        latitudeFromMap: draggableMarkerCoord.latitude,
        longitudeFromMap: draggableMarkerCoord.longitude,
        Address: fullAddressGeo,
      });

      resetDraggableMarker();

    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      Alert.alert("Error", "Unable to fetch address. Please try again.");
    }
  };


  return (
    <View style={styles.TitleContainer}>
      <View name='buttonForDraggablePin' style={styles.titleContainer}>
        <ThemedText style={styles.screenTitle}>Map</ThemedText>
      </View>
      <View style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 43.4794,
            longitude: -80.5180,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* List of all markers */}
          {markers.map((marker) => (
            <Marker
              key={marker.Pothole_ID}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              // title={`Location: ${marker.Address}`}
              // description={`Size: ${marker.Size}\nReports: ${marker.NumberOfReports}\nReported on:${marker.FirstReported}`}
            >
              <Callout>
                <View style={{ flexDirection: 'column', alignItems: 'center', flexWrap: 'wrap'  }}>
                  <Text style={{ fontWeight: 'bold' }}>Location: {marker.Address.split(',')[0] + ',' + marker.Address.split(',')[1]}</Text>
                  <Text>Size: {marker.Size}</Text>
                  <Text>First Reported Date: {new Date(marker.FirstReported).toLocaleString('en-US', { date: 'short', time: 'short' })}</Text>
                  <Text>Number of Reports: {marker.NumberOfReports}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
          {/* Dummy draggable marker */}
          <Marker
            draggable
            pinColor="blue"
            coordinate={draggableMarkerCoord}
            onDragEnd={(e) => setDraggableMarkerCoord(e.nativeEvent.coordinate)}>

            <Callout onPress={draggablePinOnPress}>
              <ThemedText>Click here to add pothole.</ThemedText>
            </Callout>

          </Marker>

        </MapView>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: width * 0.03,
    paddingTop: height * 0.1,
    //paddingBottom: height * 0.12,
  },
  TitleContainer: {
    flex: 1,
    //padding: width * 0.03,
    paddingTop: height * 0.05,
    //paddingBottom: height * 0.12,
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

export default Map;
