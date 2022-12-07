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
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  ListItem,
  Avatar,
  Button,
  SearchBar,
  Overlay,
} from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import BottomToolbar from "../components/BottomToolbar";
import {
  searchInformation,
  markAsRead,
  getSuggestAuthors,
  followAuthor,
} from "../store/news";
import NewsRow from "../components/NewsRow";
import useUnreadArticles from "../hooks/useUnreadArticles";
import { Summary } from "../types";

interface ShareObject {
  text: string | null;
  weblink: string | null;
}

interface Props {
  navigation: any;
  clearCurrentSummaryId: () => void;
}

// FIXME: remove these hacks in place of types
let timeout: any = null;

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
  const [keyword, setKeyword] = useState("");
  const [summarySearchResults, setSummarySearchResults] = useState<
    Summary[] | undefined
  >();
  const [visible, setVisible] = useState(false);
  const [viewLayout, setViewLayout] = useState(false);

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
          setTimeout(() => setShowArchiveHint(false), 5000);
        }}
        onSwipeLeft={(id: number) => {
          "worklet";
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

  const updateSearch: any = (word: string) => {
    setKeyword(word);
    timeout && clearTimeout(timeout);
    timeout = setTimeout(function () {
      searchInformation(word).then((data) => {
        setSummarySearchResults(data);
      });
    }, 300);
    return word;
  };

  const toggleOverlay = () => {
    if (!visible) {
      setTimeout(() => {
        setViewLayout(true);
      }, 200);
    } else {
      setViewLayout(false);
    }
    setVisible(!visible);
  };

  const renderSummaryItem = ({ item }: any) => (
    <ListItem
      bottomDivider
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      style={{ flex: 1, width: "100%" }}
      onPress={() => {
        setVisible(false);
        navigation.navigate("NewsView", { data: item });
      }}
    >
      <Icon name="newspaper-variant" size={20} color="#517fa4" />
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
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "column", padding: 10 }}>
        <Text style={commonStyle.logoText}>INSPECT</Text>
        <Button title="Search" onPress={toggleOverlay} />

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
              renderItem={renderItem}
              refreshing={isRefreshingNewsData}
              onRefresh={refreshNewsData}
            />
          </View>
        )}

        {newsData && newsData.length === 0 && <Text>No news right now!</Text>}

        {!newsData && isRefreshingNewsData && <ActivityIndicator />}

        {error && <Text style={{ color: "red" }}>{error?.message}</Text>}
      </View>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        {viewLayout && (
          <SafeAreaView style={{ marginTop: 10, height: "100%" }}>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "700",
                }}
              >
                Search
              </Text>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => toggleOverlay()}
              >
                <Icon name="close" color={"black"} size={24} />
              </TouchableOpacity>
            </View>
            <SearchBar
              placeholder="Type Here..."
              onChangeText={updateSearch}
              value={keyword}
              showCancel={false}
              lightTheme={false}
              round={false}
              onBlur={() => {}}
              onFocus={() => {}}
              platform={"ios"}
              onClear={() => {}}
              loadingProps={{}}
              autoCompleteType={undefined}
              clearIcon={{ name: "close" }}
              searchIcon={{ name: "search" }}
              showLoading={false}
              onCancel={() => {}}
              cancelButtonTitle={""}
              cancelButtonProps={{}}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
            />
            {!!keyword &&
              summarySearchResults &&
              summarySearchResults.length > 0 && (
                <>
                  <Text>Summaries:</Text>
                  <FlatList
                    data={summarySearchResults}
                    renderItem={renderSummaryItem}
                    style={{ flex: 1, marginTop: 5 }}
                  />
                </>
              )}
          </SafeAreaView>
        )}
        {!viewLayout && <ActivityIndicator />}
      </Overlay>
      <BottomToolbar navigation={props.navigation} />
    </View>
  );
}
