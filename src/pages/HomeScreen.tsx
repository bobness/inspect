import React, { useEffect, useCallback, useState } from "react";

import commonStyle from "../styles/CommonStyle";
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ListItem, Avatar } from "react-native-elements";
import BottomToolbar from "../components/BottomToolbar";
import { getUnreadNews, markAsRead } from "../store/news";
const list: any = [];
export default function HomeScreen(props: any) {
  const { navigation } = props;
  const [newsData, setNewsData] = useState<any[] | undefined>();
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

  const handleRefresh = () => {
    setRefreshing(true);
    getUnreadNews()
      .then((data) => {
        setRefreshing(false);
        setNewsData(data);
      })
      .catch((err) => {
        console.log("error getting news: ", err);
      });
  };

  const archive = useCallback(
    (summaryId: number) =>
      Gesture.Pan().onEnd(() => {
        markAsRead(summaryId).then(handleRefresh);
      }),
    [Gesture]
  );

  const renderItem = ({ item }: any) => (
    <GestureDetector gesture={archive(item.id)}>
      <ListItem
        bottomDivider
        hasTVPreferredFocus={undefined}
        tvParallaxProperties={undefined}
        style={{ flex: 1, width: "100%" }}
        onPress={() => {
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
    </GestureDetector>
  );

  return (
    <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
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
  );
}
