import React from "react";
import { Button, Text, View } from "react-native";
import styles from "../components/styles";
import MapView, { Callout, MapCallout, Marker } from "react-native-maps";
import { useState } from "react";


//Dummy data for markers
const markers = [
  {
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


];


const Map = () => {

  const [draggableMarkerCoord, setDraggableMarkerCoord] = useState({
    latitude: 43.48010068075527,
    longitude: -80.51533622811151
  });

  const onPressHandler = () => {
    console.log("Button pressed!");
  };


  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 43.4794,
          longitude: -80.5180,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider="google"
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
          onDragEnd={(e) => console.log(e.nativeEvent.coordinate)}>

          <Callout>
            <Text>Press Button to add pothole.</Text>
            <Button title="Add Pothole" onPress={onPressHandler} />
          </Callout>


        </Marker>

      </MapView>
    </View>
  );
};

export default Map;
