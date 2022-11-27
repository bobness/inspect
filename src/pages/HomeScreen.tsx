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
  ScrollView,
  RefreshControl,
} from "react-native";
import { ListItem, Avatar, Button } from "react-native-elements";
import BottomToolbar from "../components/BottomToolbar";
import {
  getUnreadNews,
  markAsRead,
  getSuggestAuthors,
  followAuthor,
} from "../store/news";
import { useIsFocused } from "@react-navigation/native";
import NewsRow from "../components/NewsRow";
import useUnreadArticles from "../hooks/useUnreadArticles";

interface ShareObject {
  text: string | null;
  weblink: string | null;
}

interface Props {
  navigation: any;
  clearCurrentSummaryId: () => void;
}

export default function HomeScreen(props: Props) {
  const isFocused = useIsFocused();

  const { clearCurrentSummaryId, navigation } = props;
  const {
    articles: newsData,
    error,
    loading: isRefreshingNewsData,
    refresh: refreshNewsData,
  } = useUnreadArticles();
  const [authorsData, setAuthorsData] = useState<any[] | undefined>();
  const [isRefreshingAuthors, setRefreshingAuthors] = useState<boolean>(false);
  const [showArchiveHint, setShowArchiveHint] = useState(false);

  useEffect(() => {
    if (isFocused) {
      clearCurrentSummaryId();
      refreshNewsData();
      handleAuthorRefresh();
    }
  }, [isFocused]);

  const handleAuthorRefresh = () => {
    setRefreshingAuthors(true);
    getSuggestAuthors().then((data) => {
      setRefreshingAuthors(false);
      setAuthorsData(data);
    });
  };

  const handleFollow = (user_id: number) => {
    const postData = {
      follower_id: user_id,
    };
    followAuthor(postData).then(() => {
      setAuthorsData(undefined);
      refreshNewsData();
    });
  };

  const renderItem = useCallback(
    ({ item }: any) => (
      <NewsRow
        item={item}
        onPress={() => {
          navigation.navigate("NewsView", { data: item });
        }}
        onLongPress={() => {
          setShowArchiveHint(true);
        }}
        onSwipeLeft={(id: number) => {
          "worklet";
          markAsRead(id).then(refreshNewsData);
        }}
      />
    ),
    []
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
      <Button
        onPress={() => handleFollow(item.id)}
        title="Follow"
        buttonStyle={{ backgroundColor: "#6AA84F" }}
      />
    </ListItem>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={commonStyle.logoText}>INSPECT</Text>

        {authorsData && authorsData.length > 0 && (
          <View style={{ flex: 1 }}>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Follow others to stay up-to-date on the news!
            </Text>
            <FlatList
              data={authorsData}
              renderItem={renderAuthorItem}
              style={{
                width: "100%",
              }}
              refreshing={isRefreshingAuthors}
              onRefresh={handleAuthorRefresh}
            />
          </View>
        )}

        {newsData && newsData.length > 0 && (
          // <View
          //   style={{
          //     flex: 1,
          //   }}
          // >
          <FlatList
            data={newsData}
            renderItem={renderItem}
            style={{
              // width: "100%",
              borderColor: "red",
              borderWidth: 1,
            }}
            refreshing={isRefreshingNewsData}
            onRefresh={refreshNewsData}
          />
          // </View>
        )}

        {newsData && newsData.length === 0 && <Text>No news right now!</Text>}

        {!newsData && isRefreshingNewsData && <ActivityIndicator />}

        {error && <Text style={{ color: "red" }}>{error?.message}</Text>}
      </View>
      <BottomToolbar navigation={props.navigation} />
    </View>
  );
}
