import React, { useEffect, useCallback, useState } from "react";

import commonStyle from "../styles/CommonStyle";
import { Text, View, FlatList, ActivityIndicator } from "react-native";
import { ListItem, Avatar, Button } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";

import BottomToolbar from "../components/BottomToolbar";
import {
  markAsRead,
  getSuggestAuthors,
  followAuthor,
  searchSummaries,
} from "../store/news";
import NewsRow from "../components/NewsRow";
import useUnreadArticles from "../hooks/useUnreadArticles";
import SummaryListItem from "../components/SummaryListItem";
import SearchOverlay from "../components/SearchOverlay";

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
  const [searchOverlayVisible, setSearchOverlayVisible] = useState(false);

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

  const renderNewsItem = useCallback(
    ({ item }: any) => (
      <NewsRow
        item={item}
        onPress={() => {
          navigation.navigate("NewsView", { data: item });
        }}
        // onLongPress={() => {
        //   setShowArchiveHint(true);
        //   setTimeout(() => setShowArchiveHint(false), 5000);
        // }}
        onSwipeLeft={(id: number) => {
          "worklet";
          // TODO: is called twice or more
          markAsRead(id).then(() => {
            setShowArchiveHint(false);
            refreshNewsData();
          });
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

  const toggleSearchOverlay = () => {
    setSearchOverlayVisible(!searchOverlayVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "column", padding: 10 }}>
        <Text style={commonStyle.logoText}>INSPECT</Text>
        <Button title="Search" onPress={toggleSearchOverlay} />

        {showArchiveHint && (
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            &lt;-- Swipe left to archive
          </Text>
        )}

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
          <View
            style={{
              flex: 1,
            }}
          >
            <FlatList
              data={newsData}
              renderItem={renderNewsItem}
              refreshing={isRefreshingNewsData}
              onRefresh={refreshNewsData}
            />
          </View>
        )}

        {newsData && newsData.length === 0 && <Text>No news right now!</Text>}

        {!newsData && isRefreshingNewsData && <ActivityIndicator />}

        {error && <Text style={{ color: "red" }}>{error?.message}</Text>}
      </View>
      <SearchOverlay
        toggleOverlay={toggleSearchOverlay}
        visible={searchOverlayVisible}
        searchFunction={(keyword) => searchSummaries(keyword)}
        renderItem={({ item }: any) => (
          <SummaryListItem
            item={item}
            onPress={() => {
              setSearchOverlayVisible(false);
              navigation.navigate("NewsView", { data: item });
            }}
          />
        )}
      />
      <BottomToolbar navigation={props.navigation} />
    </View>
  );
}
