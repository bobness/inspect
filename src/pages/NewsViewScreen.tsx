import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import commonStyle from "../styles/CommonStyle";
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { Avatar, Overlay, Icon, Button } from "react-native-elements";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import BottomToolbar from "../components/BottomToolbar";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import BottomAction from "../components/BottomAction";
import {
  deleteSummary,
  getNewsById,
  markAsRead,
  postComment,
  postReaction,
  sendNotification,
  updateSummary,
} from "../store/news";
import moment from "moment";
import AutoHeightWebView from "react-native-autoheight-webview";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { Dimensions } from "react-native";
import { getAuthUser } from "../store/auth";
import { Reaction, Summary, User } from "../types";

interface Props {
  route: {
    params: { data: any };
  };
  navigation: any;
  setCurrentSummaryId: (id: number | undefined) => void;
}

export default function NewsViewScreen(props: Props) {
  const {
    route: {
      params: { data },
    },
    navigation,
    setCurrentSummaryId,
  } = props;
  let richText: any = useRef(null);
  const [newsData, setNewsData] = useState<Summary | undefined>();
  const [selectedCommentId, selectCommentId]: any = useState(null);
  const [selectedComments, setSelectedComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleCommentModal, setVisibleCommentModal] = useState(false);
  const [visibleViewCommentModal, setVisibleViewCommentModal] = useState(false);
  const [emoji, setEmoji] = useState("🤔");
  const [loading, setLoading] = useState(false);
  const [authUser, setAuthUser] = useState<User | undefined>();

  const convertDate = (date_str: string) => {
    return moment(date_str).fromNow();
  };

  const getNewsDataById = (id: number) => {
    setLoading(true);
    setCurrentSummaryId(id);
    getNewsById(id).then((result) => {
      setNewsData(result);
      setLoading(false);
    });
  };

  useEffect(() => {
    getNewsDataById(data.id);
    getAuthUser().then((user) => {
      setAuthUser(user);
    });
  }, [data]);

  const toggleOverlay = () => {
    if (visible) {
      setCommentText("");
      selectCommentId(null);
    }
    setVisible(!visible);
  };

  const toggleCommentOverlay = () => {
    if (visibleCommentModal) {
      setCommentText("");
      selectCommentId(null);
    }
    setVisibleCommentModal(!visibleCommentModal);
  };

  const toggleViewCommentOverlay = () => {
    if (visibleViewCommentModal) {
      setSelectedComments([]);
      selectCommentId(null);
    }
    setVisibleViewCommentModal(!visibleViewCommentModal);
  };

  const getContent = () => {
    let content = "";
    if (newsData && newsData?.snippets) {
      content = newsData?.snippets.map((item: any) => item.value).join(" ");
    }
    return content;
  };

  const handleSaveFeedback = () => {
    const commentData = {
      snippet_id: selectedCommentId,
      comment: commentText,
      summary_id: data.id,
    };
    postComment(commentData).then(() => {
      toggleCommentOverlay();
      getNewsDataById(data.id);
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    setEmoji(emoji);
    setVisible(false);
    const reactionData = {
      snippet_id: selectedCommentId,
      reaction: emoji,
      summary_id: data.id,
    };
    postReaction(reactionData).then(() => {
      getNewsDataById(data.id);
    });
  };

  const getComments = useCallback(
    (snippet_id: number) => {
      return newsData.comments.filter(
        (reaction: any) => reaction.snippet_id == snippet_id
      );
    },
    [newsData]
  );

  const getReactions = useCallback(
    (snippet_id: number) => {
      if (newsData?.reactions) {
        return newsData.reactions.filter(
          (reaction: any) => reaction.snippet_id == snippet_id
        );
      }
    },
    [newsData]
  );

  // const sortByDate = (a: Reaction, b: Reaction) => {
  //   const dateA = new Date(a.created_at).valueOf();
  //   const dateB = new Date(b.created_at).valueOf();
  //   return dateA - dateB;
  // };

  interface ReactionMap {
    [reaction: string]: number;
  }

  const reduceByAmount = (result: ReactionMap, item: Reaction) => {
    if (Object.hasOwn(result, item.reaction)) {
      result[item.reaction] += 1;
    } else {
      result[item.reaction] = 1;
    }
    return result;
  };

  const showTopEmoji = (reactions: any[]) => {
    if (reactions.length > 0) {
      // TODO: figure out a better way to combine sorting by amount and date
      const map = reactions /*.sort(sortByDate)*/
        .reduce(reduceByAmount, {});
      const topEmoji = Object.keys(map).sort((a: string, b: string) => {
        return map[b] - map[a];
      })[0];
      return topEmoji;
    }
    return "";
  };

  const renderSnippet = ({ item }: any) => {
    const emojis = getReactions(item.id);
    const commments = getComments(item.id);
    if (newsData) {
      return (
        <View style={{ marginTop: 10 }}>
          <FontAwesome
            name="quote-left"
            size={30}
            style={{ alignSelf: "flex-start" }}
          />
          <TouchableOpacity
            onPress={() => {
              selectCommentId(item.id);
              setVisible(!visible);
            }}
          >
            <View style={{ flexDirection: "row", paddingVertical: 5 }}>
              <Text style={{ paddingRight: 10, fontSize: 20, minWidth: 35 }}>
                {showTopEmoji(emojis)}
              </Text>
              <Text style={{ flex: 1, flexWrap: "wrap" }}>{item.value}</Text>
            </View>
          </TouchableOpacity>
          <FontAwesome
            name="quote-right"
            size={30}
            style={{ alignSelf: "flex-end" }}
          />
          <View
            style={{
              paddingLeft: 36,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {/* TODO: enable adding comment emojis */}
              {/* <Text style={{ fontSize: 16, color: "grey" }}>
                {emojis.length > 0 ? emojis[0].reaction : ""}{" "}
                {emojis.length > 0 ? emojis.length : ""}
              </Text> */}
              <TouchableOpacity
                onPress={() => {
                  if (commments.length > 0) {
                    selectCommentId(item.id);
                    setSelectedComments(
                      newsData.comments.filter(
                        (c: any) => c.snippet_id == item.id
                      )
                    );
                    toggleViewCommentOverlay();
                  } else {
                    Alert.alert("No comments");
                  }
                }}
              >
                <Icon
                  name="comment-dots"
                  type="font-awesome-5"
                  color="#ccc"
                  style={{ paddingHorizontal: 10 }}
                  tvParallaxProperties={undefined}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: 16, color: "grey" }}>
                {commments.length > 0 ? commments.length : ""}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  selectCommentId(item.id);
                  toggleCommentOverlay();
                }}
              >
                <Text style={{ color: "grey" }}>Add comment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      return (
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
      );
    }
  };

  const renderCommentItem = ({ item }: any) => {
    return (
      <View style={{ flex: 1, width: "100%" }}>
        <View style={{ marginTop: 10 }}>
          <AutoHeightWebView
            style={{ width: Dimensions.get("window").width - 15, height: 50 }}
            onSizeUpdated={(size) => console.log(size.height)}
            files={[
              {
                href: "cssfileaddress",
                type: "text/css",
                rel: "stylesheet",
              },
            ]}
            source={{ html: item.comment }}
            scalesPageToFit={true}
            viewportContent={"width=device-width, user-scalable=no"}
          />
        </View>
        <View style={{ alignItems: "flex-end", marginTop: 5 }}>
          <Text style={{ fontSize: 11, color: "grey" }}>
            {convertDate(item.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  const handleRefresh = () => {
    getNewsDataById(data.id);
  };

  const deleteItem = useCallback(async () => {
    if (data) {
      await deleteSummary(data.id);
      navigation.navigate("Home");
    }
  }, [navigation, data]);

  const archiveItem = useCallback(async () => {
    await markAsRead(data.id);
    navigation.navigate("Home");
  }, [navigation, data]);

  const publishDraft = useCallback(async () => {
    await updateSummary(data.id, { is_draft: false });
    await sendNotification({
      title: "A summary was published!",
      text: data.title,
      summary_id: data.id,
    });
    navigation.navigate("Home");
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon
            type="material"
            name="chevron-left"
            tvParallaxProperties={undefined}
          />
        </TouchableOpacity>
      ),
      title: "INSPECT",
    });
  }, [navigation]);

  const getViewStyle = useCallback((item: Summary) => {
    const baseStyle = {
      flex: 1,
      padding: 10,
      backgroundColor: "white",
      borderWidth: 1,
      borderRadius: 5,
    };
    if (item.is_draft) {
      return {
        ...baseStyle,
        backgroundColor: "#ccc",
        borderStyle: "dashed" as const,
      };
    }
    return baseStyle;
  }, []);

  return (
    <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={commonStyle.pageContainer}>
          {newsData && (
            <View style={getViewStyle(newsData)}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  paddingBottom: 10,
                  alignItems: "center",
                }}
              >
                <Avatar
                  // title={newsData?.title[0]}
                  // titleStyle={{ color: "black" }}
                  source={newsData?.avatar_uri && { uri: newsData?.avatar_uri }}
                  // containerStyle={{
                  //   borderColor: "green",
                  //   borderWidth: 1,
                  //   padding: 3,
                  // }}
                  onPress={() => {
                    navigation.navigate("AuthorView", {
                      data: { id: newsData.user_id },
                    });
                  }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    flex: 1,
                    paddingHorizontal: 10,
                    textAlign: "center",
                    color: "blue",
                  }}
                  onPress={() => {
                    // TODO: measure/reduce the number of stack items that iOS creates from going back and forth from Safari
                    Linking.openURL(newsData.url);
                  }}
                >
                  {newsData.title}
                </Text>
                <Avatar
                  // title={newsData?.title[0]}
                  // titleStyle={{ color: "black" }}
                  source={newsData.logo_uri && { uri: newsData.logo_uri }}
                  // containerStyle={{
                  //   borderColor: "green",
                  //   borderWidth: 1,
                  //   padding: 3,
                  // }}
                />
              </View>
              {newsData.snippets.length > 0 && (
                <FlatList
                  data={newsData.snippets}
                  renderItem={renderSnippet}
                  style={{
                    width: "100%",
                    flexGrow: 0,
                  }}
                  refreshing={loading}
                  onRefresh={handleRefresh}
                />
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{ flex: 1, height: 1, backgroundColor: "black" }}
                />
                <View>
                  <Text style={{ width: 50, textAlign: "center" }}>
                    Actions
                  </Text>
                </View>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: "black" }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ width: "30%" }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontStyle: "italic",
                      borderWidth: 1,
                      borderColor: "black",
                      padding: 10,
                    }}
                  >
                    Tap the link above to add{" "}
                    {newsData.snippets.length === 0 ? "some " : "more "}
                    snippets as evidence for this summary
                  </Text>
                </View>
                {newsData.is_draft && (
                  <Button
                    onPress={publishDraft}
                    title="✔️ Publish"
                    buttonStyle={{ backgroundColor: "green" }}
                    style={{
                      width: 100,
                      padding: 10,
                    }}
                  />
                )}
                {!newsData.is_draft && !newsData.is_archived && (
                  <Button
                    onPress={archiveItem}
                    title="🗂 Archive"
                    buttonStyle={{ backgroundColor: "orange" }}
                    style={{ width: 100, padding: 10 }}
                  />
                )}
                {authUser?.id == newsData.user_id && (
                  <Button
                    onPress={deleteItem}
                    title="🗑 Delete"
                    buttonStyle={{ backgroundColor: "red" }}
                    style={{
                      width: 100,
                      padding: 10,
                    }}
                  />
                )}
              </View>
              {!newsData.is_draft && (
                <BottomAction
                  title={newsData.title}
                  content={getContent()}
                  url={newsData.logo_uri && { uri: newsData.logo_uri }}
                />
              )}
            </View>
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
          <BottomToolbar {...props} />
          <Overlay
            isVisible={visible}
            onBackdropPress={toggleOverlay}
            fullScreen={true}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => toggleOverlay()}
              >
                <MaterialIcon
                  name="close"
                  color={"black"}
                  size={30}
                  style={{ marginBottom: 10 }}
                />
              </TouchableOpacity>
              <EmojiSelector
                onEmojiSelected={(emoji) => handleEmojiSelect(emoji)}
                showSearchBar={false}
                showTabs={true}
                showHistory={true}
                showSectionTitles={true}
                category={Categories.all}
              />
            </SafeAreaView>
          </Overlay>

          <Overlay
            isVisible={visibleCommentModal}
            onBackdropPress={toggleCommentOverlay}
            overlayStyle={{ height: 200 }}
          >
            <SafeAreaView>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text>New Comment</Text>
                <TouchableOpacity
                  onPress={handleSaveFeedback}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    padding: 2,
                    borderRadius: 3,
                    paddingRight: 10,
                    borderColor: "grey",
                  }}
                >
                  <Icon
                    name="save"
                    type="font-awesome-5"
                    color={commentText?.length > 0 ? "black" : "#ccc"}
                    style={{ paddingHorizontal: 10 }}
                    tvParallaxProperties={undefined}
                  />
                  <Text
                    style={{
                      color: commentText?.length > 0 ? "black" : "grey",
                      fontWeight: "bold",
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
              >
                <RichEditor
                  ref={richText}
                  onChange={(descriptionText) => {
                    setCommentText(descriptionText);
                  }}
                />
              </KeyboardAvoidingView>
              <RichToolbar
                editor={richText}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.insertLink,
                  actions.heading1,
                ]}
                iconMap={{
                  [actions.heading1]: ({ tintColor }) => (
                    <Text style={[{ color: tintColor }]}>H1</Text>
                  ),
                }}
              />
            </SafeAreaView>
          </Overlay>

          <Overlay
            isVisible={visibleViewCommentModal}
            onBackdropPress={toggleViewCommentOverlay}
            fullScreen={true}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => toggleViewCommentOverlay()}
              >
                <MaterialIcon name="close" color={"black"} size={24} />
              </TouchableOpacity>
              <View
                style={{
                  marginTop: 10,
                  height: "100%",
                  flex: 1,
                  width: "100%",
                }}
              >
                {selectedComments.length > 0 && (
                  <FlatList
                    data={selectedComments}
                    renderItem={renderCommentItem}
                    style={{ flex: 1, marginTop: 5, width: "100%" }}
                  />
                )}
                {selectedComments.length === 0 && (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text style={{ color: "#ddd" }}>No comments</Text>
                  </View>
                )}
              </View>
            </SafeAreaView>
          </Overlay>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
