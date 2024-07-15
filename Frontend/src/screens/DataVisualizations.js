import React, { useState, useCallback } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "../components/themeContext";
import ScreenTitle from "../components/header";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { getData } from "../utils/storage";
import ImageViewer from "react-native-image-zoom-viewer";

const DataVisualizations = () => {
  const { theme, themes, toggleTheme } = useTheme();
  const currentTheme = themes[theme];
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({
    global_pothole_count_line_graph: null,
    global_fixed_vs_unfixed_pie_chart: null,
    user_pothole_count_line_graph: null,
    user_fixed_vs_unfixed_pie_chart: null,
  });

  const getDataVisualizationImages = async () => {
    //Need to send the bearer token to authenticate for user specific images
    const bearerToken = await getData("bearerToken");
    console.log("Bearer token:", bearerToken);

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
      getDataVisualizationImages();
    }, [])
  );

  //view without zooming in and out

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
  //           <>
  //             {images.global_pothole_count_line_graph && (
  //               <ImageViewer
  //                 key="global_pothole_count_line_graph"
  //                 imageUrls={[
  //                   {
  //                     url: `data:image/png;base64,${images.global_pothole_count_line_graph}`,
  //                   },
  //                 ]}
  //                 style={styles.retrievedImage}
  //                 enableSwipeDown={false}
  //                 enablePreload={true}
  //                 enableScale={true}
  //                 doubleClickInterval={300}
  //                 maxOverflow={0}
  //                 enablePanning={false}
  //                 backgroundColor="transparent"
  //                 renderIndicator={() => null}
  //               />
  //             )}
  //             {images.global_fixed_vs_unfixed_pie_chart && (
  //               <ImageViewer
  //                 key="global_fixed_vs_unfixed_pie_chart"
  //                 imageUrls={[
  //                   {
  //                     url: `data:image/png;base64,${images.global_fixed_vs_unfixed_pie_chart}`,
  //                   },
  //                 ]}
  //                 style={styles.retrievedImage}
  //                 enableSwipeDown={false}
  //                 enablePreload={true}
  //                 enableScale={true}
  //                 doubleClickInterval={300}
  //                 maxOverflow={0}
  //                 enablePanning={false}
  //                 backgroundColor="transparent"
  //                 renderIndicator={() => null}
  //               />
  //             )}
  //             {images.user_pothole_count_line_graph && (
  //               <ImageViewer
  //                 key="user_pothole_count_line_graph"
  //                 imageUrls={[
  //                   {
  //                     url: `data:image/png;base64,${images.user_pothole_count_line_graph}`,
  //                   },
  //                 ]}
  //                 style={styles.retrievedImage}
  //                 enableSwipeDown={false}
  //                 enablePreload={true}
  //                 enableScale={true}
  //                 doubleClickInterval={300}
  //                 maxOverflow={0}
  //                 enablePanning={false}
  //                 backgroundColor="transparent"
  //                 renderIndicator={() => null}
  //               />
  //             )}
  //             {images.user_fixed_vs_unfixed_pie_chart && (
  //               <ImageViewer
  //                 key="user_fixed_vs_unfixed_pie_chart"
  //                 imageUrls={[
  //                   {
  //                     url: `data:image/png;base64,${images.user_fixed_vs_unfixed_pie_chart}`,
  //                   },
  //                 ]}
  //                 style={styles.retrievedImage}
  //                 enableSwipeDown={false}
  //                 enablePreload={true}
  //                 enableScale={true}
  //                 doubleClickInterval={300}
  //                 maxOverflow={0}
  //                 enablePanning={false}
  //                 backgroundColor="transparent"
  //                 renderIndicator={() => null}
  //               />
  //             )}
  //           </>
  //         )}
  //       </ScrollView>
  //     </View>
  //   );
  // };

  //View with zooming in and out
  return (
    <TouchableWithoutFeedback onPress={() => null}>
      <ScrollView
        style={[
          styles.pageView,
          { backgroundColor: currentTheme.backgroundColor },
        ]}
        contentContainerStyle={styles.scrollViewContent}
      >
        <ScreenTitle name="chart-areaspline" title="Data Visualizations" />
        <View style={styles.imageContainer}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={currentTheme.primaryColor}
              style={styles.loadingIndicator}
            />
          ) : (
            <>
              {images.global_pothole_count_line_graph && (
                <ImageViewer
                  key="global_pothole_count_line_graph"
                  imageUrls={[
                    {
                      url: `data:image/png;base64,${images.global_pothole_count_line_graph}`,
                    },
                  ]}
                  style={styles.retrievedImage}
                  enableSwipeDown={false} //Added these props to disable bunch of the default stuff for ImageViewer
                  enablePreload={true}
                  enableScale={true}
                  doubleClickInterval={300}
                  maxOverflow={0}
                  enablePanning={false}
                  backgroundColor="transparent"
                  renderIndicator={() => null}
                  menu={null}
                  saveToLocalByLongPress={false}
                />
              )}
              {images.global_fixed_vs_unfixed_pie_chart && (
                <ImageViewer
                  key="global_fixed_vs_unfixed_pie_chart"
                  imageUrls={[
                    {
                      url: `data:image/png;base64,${images.global_fixed_vs_unfixed_pie_chart}`,
                    },
                  ]}
                  style={styles.retrievedImage}
                  enableSwipeDown={false}
                  enablePreload={true}
                  enableScale={true}
                  doubleClickInterval={300}
                  maxOverflow={0}
                  enablePanning={false}
                  backgroundColor="transparent"
                  renderIndicator={() => null}
                  menu={null}
                  saveToLocalByLongPress={false}
                />
              )}
              {images.user_pothole_count_line_graph && (
                <ImageViewer
                  key="user_pothole_count_line_graph"
                  imageUrls={[
                    {
                      url: `data:image/png;base64,${images.user_pothole_count_line_graph}`,
                    },
                  ]}
                  style={styles.retrievedImage}
                  enableSwipeDown={false}
                  enablePreload={true}
                  enableScale={true}
                  doubleClickInterval={300}
                  maxOverflow={0}
                  enablePanning={false}
                  backgroundColor="transparent"
                  renderIndicator={() => null}
                  menu={null}
                  saveToLocalByLongPress={false}
                />
              )}
              {images.user_fixed_vs_unfixed_pie_chart && (
                <ImageViewer
                  key="user_fixed_vs_unfixed_pie_chart"
                  imageUrls={[
                    {
                      url: `data:image/png;base64,${images.user_fixed_vs_unfixed_pie_chart}`,
                    },
                  ]}
                  style={styles.retrievedImage}
                  enableSwipeDown={false}
                  enablePreload={true}
                  enableScale={true}
                  doubleClickInterval={300}
                  maxOverflow={0}
                  enablePanning={false}
                  backgroundColor="transparent"
                  renderIndicator={() => null}
                  menu={null} // Disable the menu completely
                  saveToLocalByLongPress={false}
                />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

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
