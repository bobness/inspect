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
import { ListItem, Avatar, Button } from "react-native-elements";
import BottomToolbar from "../components/BottomToolbar";
import {
  getUnreadNews,
  markAsRead,
  getSuggestAuthors,
  followAuthor,
} from "../store/news";
// import ShareModal from "../components/ShareModal";
import { useIsFocused } from "@react-navigation/native";
import NewsRow from "../components/NewsRow";

interface ShareObject {
  text: string | null;
  weblink: string | null;
}

interface Props {
  navigation: any;
  data: ShareObject;
}

export default function HomeScreen(props: Props) {
  const isFocused = useIsFocused();

  const { navigation } = props;
  const [newsData, setNewsData] = useState<any[] | undefined>();
  const [authorsData, setAuthorsData] = useState<any[] | undefined>();
  const [isRefreshing, setRefreshing] = useState<boolean>(false);
  // const [shareModalVisible, setShareModalVisible] = useState(false);

  useEffect(() => {
    if (isFocused) {
      handleRefresh();
      handleAuthorRefresh();
    }
  }, [isFocused]);

  const handleRefresh = () => {
    setRefreshing(true);
    getUnreadNews()
      .then((data) => {
        setRefreshing(false);
        setNewsData(data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          navigation.navigate("Login");
        }
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
        if (err.response && err.response.status === 401) {
          navigation.navigate("Login");
        }
        console.log("error getting news: ", err);
      });
  };

  const handleFollow = (user_id: number) => {
    const postData = {
      follower_id: user_id,
    };
    followAuthor(postData).then(() => {
      setAuthorsData(undefined);
      handleRefresh();
    });
  };

  const renderItem = useCallback(
    ({ item }: any) => (
      <NewsRow
        item={item}
        onPress={(e) => {
          navigation.navigate("NewsView", { data: item });
        }}
        onSwipe={() => {
          markAsRead(item.id).then(handleRefresh);
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
    <>
      {/* FIXME: remove `ShareModal` here for notification deep linking */}
      {/* <ShareModal
        modalVisible={shareModalVisible}
        url={shareUrl}
        hideOverlay={() => {
          setShareModalVisible(false);
          setShareUrl(undefined);
        }}
        refreshFeed={handleRefresh}
      /> */}
      <KeyboardAvoidingView
        style={commonStyle.containerView}
        behavior="padding"
      >
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
              {/* FIXME: is in front of the above news, rather than below it */}
              {authorsData && authorsData.length > 0 && (
                <>
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
                    style={{ flex: 1, width: "100%" }}
                    refreshing={isRefreshing}
                    onRefresh={handleAuthorRefresh}
                  />
                </>
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
