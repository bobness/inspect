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
import { ListItem, Avatar } from "react-native-elements";
import BottomToolbar from "../components/BottomToolbar";
import { getUnreadNews, markAsRead } from "../store/news";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import ShareModal from "../components/ShareModal";

interface Props {
  navigation: any;
  shareUrl?: string;
  setShareUrl: (value: string | undefined) => void;
}

export default function HomeScreen(props: Props) {
  const { navigation, shareUrl, setShareUrl } = props;
  const [newsData, setNewsData] = useState<any[] | undefined>();
  const [isRefreshing, setRefreshing] = useState<boolean>(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  useEffect(() => {
    getUnreadNews()
      .then((data) => {
        setNewsData(data);
      })
      .catch((err) => {
        console.log("error in initial getting news: ", err);
      });
  }, []);

  useEffect(() => {
    if (shareUrl) {
      setShareModalVisible(true);
    }
  }, [shareUrl]);

  const handleRefresh = () => {
    setRefreshing(true);
    getUnreadNews()
      .then((data) => {
        setRefreshing(false);
        setNewsData(data);
      })
      .catch((err) => {
        console.log("error refreshing news: ", err);
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
          // FIXME: also happens on swipe down in addition to left
          markAsRead(summaryId).then(handleRefresh);
        }),
    [Gesture]
  );

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

  return (
    <>
      <ShareModal
        modalVisible={shareModalVisible}
        url={shareUrl}
        hideOverlay={() => {
          setShareModalVisible(false);
          setShareUrl(undefined);
        }}
        refreshFeed={handleRefresh}
      />
      <KeyboardAvoidingView
        style={commonStyle.containerView}
        behavior="padding"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={commonStyle.pageContainer}>
            <View style={{ flex: 1, padding: 10 }}>
              <Text style={commonStyle.logoText}>INSPECT</Text>
              {newsData && (
                <FlatList
                  data={newsData}
                  renderItem={renderItem}
                  style={{ flex: 1, width: "100%" }}
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
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
    </>
  );
}
