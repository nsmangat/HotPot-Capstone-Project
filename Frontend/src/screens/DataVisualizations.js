import React, { useState, useCallback } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "../components/themeContext";
import ScreenTitle from "../components/header";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { getData } from "../utils/storage";

const DataVisualizations = () => {
  const { theme, themes, toggleTheme } = useTheme();
  const currentTheme = themes[theme];
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({
    global_line: null,
    global_pie: null,
    user_line: null,
    user_pie: null,
  });

  //Function to get the data visualization images from the Data Visualizer Flask project

  //On page load, get the data visualization images
  // useEffect(() => {
  //   try {
  //     const response = axios.get("http://127.0.0.1:5000/visualize", {
  //       responseType: "blob",
  //     });

  //     //Object urls are used to reference BLOBs (binary large objects) as files
  //     const imageUrl = URL.createObjectURL(response.data);
  //     setImageUrl(imageUrl);
  //   } catch (error) {
  //     console.error("Error getting image:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // const getDataVisualizationImage = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/visualize`,
  //       {
  //         responseType: "blob",
  //       }
  //     );

  //     console.log(response.data);

  //     // Create a blob from the response data
  //     const blobData = new Blob([response.data], { type: "image/png" });

  //     // Object URLs are used to reference BLOBs (binary large objects) as files
  //     const imageUrl = URL.createObjectURL(blobData);
  //     setImageUrl(imageUrl);
  //   } catch (error) {
  //     console.error("Error getting image:", error);
  //   } finally {
  //     setLoading(false); // Stop loading
  //   }
  // };

  const getDataVisualizationImage = async () => {
    const bearerToken = await getData("bearerToken");

    // setLoading(true);
    // try {
    //   const response = await axios.get(
    //     `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/visualize`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${bearerToken}`,
    //       },
    //       responseType: "json",
    //     }
    //   );
    //   // console.log(response.data);
    //   // setImageUrl(response.data);

    //   const base64Data = response.data.split(",")[1];
    //   setImageUrl(base64Data);
    // } catch (error) {
    //   console.error("Error getting image:", error);
    // } finally {
    //   setLoading(false);
    // }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/visualize`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          responseType: "json",
        }
      );
      setImages(response.data);
    } catch (error) {
      console.error("Error getting images:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getDataVisualizationImage();
    }, [])
  );

  //   return (
  //     <View
  //       style={[
  //         styles.pageView,
  //         { backgroundColor: currentTheme.backgroundColor },
  //       ]}
  //     >
  //       <ScreenTitle name="chart-areaspline" title="Data Visualizations" />
  //       <ScrollView horizontal={false} style={styles.scrollView}>
  //         {loading ? (
  //           <ActivityIndicator size="large" color={currentTheme.primaryColor} />
  //         ) : (
  //           <Image source={{ uri: imageUrl }} style={styles.retrievedImage} />
  //         )}
  //       </ScrollView>
  //     </View>
  //   );
  // };

  //   return (
  //     <View
  //       style={[
  //         styles.pageView,
  //         { backgroundColor: currentTheme.backgroundColor },
  //       ]}
  //     >
  //       <ScreenTitle name="chart-areaspline" title="Data Visualizations" />
  //       <ScrollView horizontal={false} style={styles.scrollView}>
  //         {loading ? (
  //           <ActivityIndicator size="large" color={currentTheme.primaryColor} />
  //         ) : (
  //           <Image
  //             source={{ uri: `data:image/png;base64,${imageUrl}` }}
  //             style={styles.retrievedImage}
  //           />
  //         )}
  //       </ScrollView>
  //     </View>
  //   );
  // };

  return (
    <View
      style={[
        styles.pageView,
        { backgroundColor: currentTheme.backgroundColor },
      ]}
    >
      <ScreenTitle name="chart-areaspline" title="Data Visualizations" />
      <ScrollView horizontal={false} style={styles.scrollView}>
        {loading ? (
          <ActivityIndicator size="large" color={currentTheme.primaryColor} />
        ) : (
          <>
            {images.global_line && (
              <Image
                source={{ uri: `data:image/png;base64,${images.global_line}` }}
                style={styles.retrievedImage}
              />
            )}
            {images.global_pie && (
              <Image
                source={{ uri: `data:image/png;base64,${images.global_pie}` }}
                style={styles.retrievedImage}
              />
            )}
            {images.user_line && (
              <Image
                source={{ uri: `data:image/png;base64,${images.user_line}` }}
                style={styles.retrievedImage}
              />
            )}
            {images.user_pie && (
              <Image
                source={{ uri: `data:image/png;base64,${images.user_pie}` }}
                style={styles.retrievedImage}
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

// const StaticImage = ({ imageSource }) => {
//   return <Image source={imageSource} style={styles.staticImage} />;
// };

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  pageView: {
    flex: 1,
    padding: width * 0.03,
    paddingTop: height * 0.1,
    //    paddingBottom: height * 0.12,
  },
  scrollView: {
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  retrievedImage: {
    width: width * 0.9,
    height: height * 0.38,
    marginRight: width * 0.02,
    marginLeft: width * 0.02,
    resizeMode: "contain",
  },
});

export default DataVisualizations;
