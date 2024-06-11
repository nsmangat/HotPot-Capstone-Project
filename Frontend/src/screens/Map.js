import React, { useState } from "react";
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
// import styles from "../components/styles";
import { useTheme } from '../components/themeContext';
import ThemedText from "../components/themeText";
import MapView, { Callout, Marker } from "react-native-maps";

const Map = ({navigation}) => {
  const { theme, themes, toggleTheme } = useTheme();
  const currentTheme = themes[theme];

  const [markers, setMarkers] = useState([{
    index: 1,
    latitude: 43.4794,
    longitude: -80.5180,
    title: "Conestoga College - Waterloo Campus",
    description: "HotPot Headquarters\nSomething else",
  },
  {
    index: 2,
    latitude: 43.478207111368164,
    longitude: -80.51875002038042,
    title: "Popeyes Waterloo Campus",
    description: "Popeyes across Waterloo Campus",
  },
  {
    index: 3,
    latitude: 43.480203796852585,
    longitude: -80.52000531986504,
    title: "Goodlife - Waterloo Campus",
    description: "GoodLife Fitness",
  },
  {
    index: 4,
    latitude: 43.48092949071893,
    longitude: -80.52097301999295,
    title: "Toyota - Waterloo Campus",
    description: "Toyota Dealership",
  },
  ]);

  const [draggableMarkerCoord, setDraggableMarkerCoord] = useState({
    latitude: 43.48010068075527,
    longitude: -80.51533622811151
  });

  const addMarker = () => {
    const newMarker = {
      index: markers.length + 1,
      latitude: draggableMarkerCoord.latitude,
      longitude: draggableMarkerCoord.longitude,
      title: "Pothole added with pin drop!",
      description: "Pothole added with pin drop!",
    };

    setMarkers([...markers, newMarker]);
    resetDraggableMarker();
  };

  const resetDraggableMarker = () => {
    setDraggableMarkerCoord({
      latitude: 43.48010068075527,
      longitude: -80.51533622811151
    });
  }

  const draggablePinOnPress = () => {
    console.log("Button pressed!");
    addMarker();
    navigation.navigate("Report", { 
      latitudeFromMap: draggableMarkerCoord.latitude, 
      longitudeFromMap: draggableMarkerCoord.longitude});
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
          {/* Dummy list of multiple markers */}
          {markers.map((marker) => (
            <Marker
              key={marker.index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
              description={marker.description}
            />
          ))}
          {/* Dummy draggable marker */}
          <Marker
            draggable
            pinColor="blue"
            coordinate={{
              latitude: 43.48010068075527,
              longitude: -80.51533622811151
            }}
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
