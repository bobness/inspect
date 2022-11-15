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

import { getAuthUser } from "../store/auth";
import { Comment, Reaction, Summary, User } from "../types";
import CommentRow from "../components/CommentRow";
import { convertDate } from "../util";
import Snippet from "../components/Snippet";

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
  const [globalComments, setGlobalComments] = useState<Comment[] | undefined>();
  const [globalReactions, setGlobalReactions] = useState<
    Reaction[] | undefined
  >();

  const getNewsDataById = (id: number) => {
    setLoading(true);
    return getNewsById(id).then((result) => {
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

  useEffect(() => {
    if (newsData) {
      const snippetIds = newsData.snippets?.map((snippet) => snippet.id) ?? [];
      if (newsData.comments) {
        setGlobalComments(
          newsData.comments.filter(
            (comment) => !snippetIds.includes(comment.snippet_id)
          )
        );
      }
      if (newsData.reactions) {
        setGlobalReactions(
          newsData.reactions.filter(
            (reaction) => !snippetIds.includes(reaction.snippet_id)
          )
        );
      }
    }
  }, [newsData]);

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

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
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
    },
    [data]
  );

  const handleRefresh = async () => {
    setLoading(true);
    await getNewsDataById(data.id);
    setLoading(false);
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
                  flex: 1,
                  justifyContent: "space-between",
                  flexDirection: "column",
                  paddingBottom: 10,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar
                    // title={newsData?.title[0]}
                    // titleStyle={{ color: "black" }}
                    source={
                      (newsData.avatar_uri as any) && {
                        uri: newsData.avatar_uri,
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
                  <Text style={{ paddingLeft: 10, fontSize: 18 }}>
                    (username)
                  </Text>
                </View>

                <View>
                  <Avatar
                    // title={newsData.title[0]}
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

                <View>
                  {!editTitleMode && (
                    <Text
                      style={{
                        fontSize: 18,
                        paddingHorizontal: 10,
                        textAlign: "center",
                        color: "blue",
                      }}
                      onPress={() => {
                        setCurrentSummaryId(newsData.id);
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
                </View>

                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {newsData.updated_at && (
                    <Text>Updated {convertDate(newsData.updated_at)}</Text>
                  )}
                  {authUser?.id == newsData.user_id && (
                    <Button
                      title="Edit Title"
                      onPress={() => setEditTitleMode(true)}
                    />
                  )}
                </View>
              </View>

              {newsData.snippets && newsData.snippets.length > 0 && (
                <View style={{ borderWidth: 1, borderColor: "red", flex: 1 }}>
                  <FlatList
                    data={newsData.snippets}
                    renderItem={({ item }) => (
                      <Snippet
                        snippet={item}
                        comments={newsData.comments.filter(
                          (comment) => comment.snippet_id == item.id
                        )}
                        reactions={newsData.reactions.filter(
                          (reaction) => reaction.snippet_id == item.id
                        )}
                        navigation={navigation}
                        toggleCommentOverlay={toggleCommentOverlay}
                      />
                    )}
                    // style={{
                    //   width: "100%",
                    // }}
                    // contentContainerStyle={{ paddingBottom: 10 }}
                    // refreshing={loading}
                    // onRefresh={handleRefresh}
                  />
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
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
                    {newsData.snippets && newsData.snippets.length === 0
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
