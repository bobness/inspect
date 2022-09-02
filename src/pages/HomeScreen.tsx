import React, { useEffect, useCallback, useState, useRef } from "react";

import commonStyle from "../styles/CommonStyle";
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
  ActivityIndicator,
  // Animated,
  Easing,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ListItem, Avatar, Button } from "react-native-elements";
import BottomToolbar from "../components/BottomToolbar";
import { getUnreadNews, markAsRead, getSuggestAuthors, followAuthor } from "../store/news";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
const list: any = [];
export default function HomeScreen(props: any) {
  const { navigation } = props;
  const [newsData, setNewsData] = useState<any[] | undefined>();
  const [authorsData, setAuthorsData] = useState<any[] | undefined>();
  const [isRefreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    getUnreadNews()
      .then((data) => {
        setNewsData(data);
      })
      .catch((err) => {
        console.log("error getting news: ", err);
      });
  }, []);

  useEffect(() => {
    if (newsData && !newsData.length) {
      getSuggestAuthors()
        .then((data) => {
          setAuthorsData(data);
        })
        .catch((err) => {
          console.log("error getting news: ", err);
        });
    }
  }, [newsData]);

  const handleRefresh = () => {
    setRefreshing(true);
    getUnreadNews()
      .then((data) => {
        console.log(data);
        setRefreshing(false);
        setNewsData(data);
      })
      .catch((err) => {
        console.log("error getting news: ", err);
      });
  };

  const handleAuthorRefresh = () => {
    setRefreshing(true);
    getSuggestAuthors()
        .then((data) => {
          setRefreshing(false);
          setAuthorsData(data);
        })
        .catch((err) => {
          setRefreshing(false);
          console.log("error getting news: ", err);
        });
  };

  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
      ],
    };
  });

  const archive = useCallback(
    (summaryId: number) =>
      Gesture.Pan()
        .runOnJS(true)
        .onStart(() => {})
        .onUpdate((e) => {
          offset.value.x = e.translationX + start.value.x;
          offset.value = {
            x: e.translationX + start.value.x,
            y: e.translationY + start.value.x,
          };
        })
        .onEnd(() => {
          start.value = {
            x: offset.value.x,
            y: offset.value.y,
          };
          start.value = offset.value;
          markAsRead(summaryId).then(handleRefresh);
        }),
    [Gesture]
  );

  const handleFollow = (user_id) => {
    const postData = {
      follower_id: user_id,
    };
    followAuthor(postData).then(() => {
      setAuthorsData([]);
      handleRefresh();
    });
  };

  const renderItem = ({ item }: any) => (
    <GestureDetector gesture={archive(item.id)}>
      <Animated.View style={animatedStyles}>
        <ListItem
          bottomDivider
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
          style={{ flex: 1, width: "100%" }}
          // style={animatedStyles}
          onPress={(e) => {
            navigation.navigate("NewsView", { data: item });
          }}
        >
          <Avatar
            // title={item.title[0]}
            // titleStyle={{ color: "black" }}
            source={item.avatar_uri && { uri: item.avatar_uri }}
            // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
          />
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
          </ListItem.Content>
          <Avatar
            // title={item.title[0]}
            // titleStyle={{ color: "black" }}
            source={item.logo_uri && { uri: item.logo_uri }}
            // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
          />
        </ListItem>
      </Animated.View>
    </GestureDetector>
  );

  const renderAuthorItem = ({ item }: any) => (
    <ListItem
      bottomDivider
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      style={{ flex: 1, width: "100%" }}
      // style={animatedStyles}
      onPress={(e) => {
        navigation.navigate("AuthorView", { data: item });
      }}
    >
      <Avatar
        // title={item.title[0]}
        // titleStyle={{ color: "black" }}
        source={item.avatar_uri && { uri: item.avatar_uri }}
        // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
      />
      <ListItem.Content>
        <ListItem.Title>{item.username}</ListItem.Title>
      </ListItem.Content>
      <Button onPress={() => handleFollow(item.id)} title="Follow" buttonStyle={{ backgroundColor: "#6AA84F" }} />
    </ListItem>
  );

  return (
    <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={commonStyle.pageContainer}>
          <View style={{ flex: 1, padding: 10 }}>
            <Text style={commonStyle.logoText}>INSPECT</Text>
            {newsData && newsData.length > 0 && (
              <FlatList
                data={newsData}
                renderItem={renderItem}
                style={{ flex: 1, width: "100%" }}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            )}
            {authorsData && authorsData.length > 0 && (
              <FlatList
                data={authorsData}
                renderItem={renderAuthorItem}
                style={{ flex: 1, width: "100%" }}
                refreshing={isRefreshing}
                onRefresh={handleAuthorRefresh}
              />
            )}
            {!newsData && (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  padding: 10,
                }}
              >
                <ActivityIndicator />
              </View>
            )}
          </View>
          <BottomToolbar {...props} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
