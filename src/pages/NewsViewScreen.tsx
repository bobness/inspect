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
import { Avatar, Overlay, Icon, Button, Input } from "react-native-elements";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import BottomToolbar from "../components/BottomToolbar";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import ShareMenu from "../components/ShareMenu";
import {
  deleteSummary,
  getNewsById,
  markAsRead,
  postComment,
  postReaction,
  sendNotification,
  updateSummary,
} from "../store/news";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { getAuthUser } from "../store/auth";
import { Reaction, Summary, User } from "../types";
import CommentRow from "../components/CommentRow";
import { convertDate } from "../util";

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
  const [commentText, setCommentText] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleCommentModal, setVisibleCommentModal] = useState(false);
  const [emoji, setEmoji] = useState("🤔");
  const [loading, setLoading] = useState(false);
  const [authUser, setAuthUser] = useState<User | undefined>();
  const [editTitleMode, setEditTitleMode] = useState(false);

  const getNewsDataById = (id: number) => {
    setLoading(true);
    getNewsById(id).then((result) => {
      setNewsData(result);
      setLoading(false);
    });
  };

  useEffect(() => {
    setCurrentSummaryId(undefined);
  }, []);

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

  const getContent = () => {
    let content = "";
    if (newsData && newsData?.snippets) {
      content = newsData?.snippets.map((item: any) => item.value).join("\n\n");
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
      if (newsData?.comments) {
        return newsData.comments.filter(
          (reaction: any) => reaction.snippet_id == snippet_id
        );
      }
      return [];
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

  const showTopEmoji = (reactions?: any[]) => {
    if (reactions && reactions.length > 0) {
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
    const comments = getComments(item.id);
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
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {comments.length > 0 && (
                <FlatList
                  data={comments}
                  renderItem={({ item }) => (
                    <CommentRow item={item} navigation={navigation} />
                  )}
                  style={{ flex: 1, marginTop: 5, width: "100%" }}
                />
              )}
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

  const handleRefresh = () => {
    getNewsDataById(data.id);
  };

  const deleteItem = useCallback(() => {
    if (data) {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to Delete this item?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              await deleteSummary(data.id);
              navigation.navigate("Home");
            },
          },
        ],
        {
          cancelable: true,
        }
      );
    }
  }, [navigation, data]);

  const archiveItem = useCallback(async () => {
    await markAsRead(data.id);
    navigation.navigate("Home");
  }, [navigation, data]);

  const publishDraft = useCallback(() => {
    Alert.alert(
      "Confirm Publish",
      "Are you sure you want to Publish this draft?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Publish",
          onPress: async () => {
            await updateSummary(data.id, { is_draft: false });
            await sendNotification({
              title: "A summary was published!",
              text: data.title,
              summary_id: data.id,
            });
            getNewsDataById(data.id);
          },
        },
      ],
      {
        cancelable: true,
      }
    );
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
      return Object.assign(baseStyle, {
        backgroundColor: "#ccc",
        borderStyle: "dashed" as const,
      });
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
                  source={
                    (newsData?.avatar_uri as any) && {
                      uri: newsData?.avatar_uri,
                    }
                  }
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
                {!editTitleMode && (
                  <Text
                    style={{
                      fontSize: 18,
                      flex: 1,
                      paddingHorizontal: 10,
                      textAlign: "center",
                      color: "blue",
                    }}
                    onPress={() => {
                      setCurrentSummaryId(newsData.id);
                      // TODO: measure/reduce the number of stack items that iOS creates from going back and forth from Safari
                      Linking.openURL(newsData.url);
                    }}
                  >
                    {newsData.title}
                  </Text>
                )}
                {editTitleMode && (
                  <Input
                    // ref={titleInputRef}
                    label="Title"
                    placeholder="New title that explains the contribution of the article"
                    value={newsData.title}
                    // editable={!loading}
                    onChangeText={(text: string) => {
                      // if (text !== defaultTitle) {
                      //   setUseDefaultTitle(false);
                      // }
                      setNewsData({
                        ...newsData,
                        title: text,
                      });
                    }}
                    blurOnSubmit={true}
                    onBlur={() =>
                      updateSummary(newsData.id, {
                        title: newsData.title,
                      }).then(() => setEditTitleMode(false))
                    }
                    autoCompleteType={undefined}
                  />
                )}
                <Avatar
                  // title={newsData?.title[0]}
                  // titleStyle={{ color: "black" }}
                  source={
                    (newsData.logo_uri as any) && { uri: newsData.logo_uri }
                  }
                  // containerStyle={{
                  //   borderColor: "green",
                  //   borderWidth: 1,
                  //   padding: 3,
                  // }}
                />
              </View>
              {newsData.updated_at && (
                <Text>Updated {convertDate(newsData.updated_at)}</Text>
              )}
              {authUser?.id == newsData.user_id && (
                <Button
                  title="Edit Title"
                  onPress={() => setEditTitleMode(true)}
                />
              )}
              {newsData?.snippets && newsData.snippets.length > 0 && (
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
                    {newsData?.snippets && newsData.snippets.length === 0
                      ? "some "
                      : "more "}
                    snippets as evidence for this summary
                  </Text>
                </View>
                {authUser?.id == newsData.user_id && newsData.is_draft && (
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
                <ShareMenu
                  title={newsData.title}
                  content={getContent()}
                  url={newsData.url}
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
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
