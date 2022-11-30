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

import BottomToolbar from "../components/BottomToolbar";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import ShareMenu from "../components/ShareMenu";
import {
  deleteSummary,
  followAuthor,
  getNewsById,
  markAsRead,
  postComment,
  postReaction,
  sendNotification,
  unfollowAuthor,
  updateSummary,
} from "../store/news";

import { getAuthUser, getProfileInformation } from "../store/auth";
import { Comment, Reaction, ReactionMap, Summary, User } from "../types";
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
  const [authorData, setAuthorData] = useState<User | undefined>();
  const [editTitleMode, setEditTitleMode] = useState(false);
  const [globalComments, setGlobalComments] = useState<Comment[] | undefined>();
  const [globalReactions, setGlobalReactions] = useState<
    Reaction[] | undefined
  >();

  const handleRefresh = async () => {
    setLoading(true);
    await getNewsDataById(data.id);
    const authUser = await getAuthUser();
    setAuthUser(authUser);
    setLoading(false);
  };

  useEffect(() => {
    if (newsData && !authorData) {
      populateAuthorData(newsData.user_id);
    }
  }, [newsData]);

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
    handleRefresh();
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

  const reduceByAmount = (result: ReactionMap, item: Reaction) => {
    if (Object.hasOwn(result, item.reaction)) {
      result[item.reaction] += 1;
    } else {
      result[item.reaction] = 1;
    }
    return result;
  };

  const topReactionsMap = useMemo(() => {
    if (globalReactions && globalReactions.length > 0) {
      return globalReactions /*.sort(sortByDate)*/
        .reduce(reduceByAmount, {});
    }
    return {};
  }, [globalReactions]);

  const topReactions = useMemo(() => {
    const reactionArray = Object.keys(topReactionsMap).sort(
      (a, b) => topReactionsMap[a] - topReactionsMap[b]
    );
    const responseArray: string[] = [];
    // TODO: improve the algorithm here?
    if (reactionArray.length >= 1) {
      responseArray.push(reactionArray[0]);
      if (reactionArray.length >= 2) {
        responseArray.push(reactionArray[1]);
        if (reactionArray.length >= 3) {
          responseArray.push(reactionArray[2]);
        }
      }
    }
    return responseArray;
  }, [topReactionsMap]);

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

  const getViewStyle = (item: Summary) => {
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
  };

  const populateAuthorData = async (user_id: number) => {
    setLoading(true);
    const data = await getProfileInformation(user_id);
    setAuthorData(data);
    setLoading(false);
  };

  const followerIds = useMemo(() => {
    if (authorData) {
      return authorData.followers.map((follower: any) =>
        Number(follower.follower_id)
      );
    }
    return [];
  }, [authorData]);

  const handleFollow = useCallback((user_id: number) => {
    const postData = {
      follower_id: user_id,
    };
    followAuthor(postData).then(() => {
      handleRefresh();
    });
  }, []);

  const handleUnfollow = useCallback((user_id: number) => {
    unfollowAuthor(user_id).then(() => {
      handleRefresh();
    });
  }, []);

  return (
    <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
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
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: 20,
                }}
              >
                <View>
                  <Icon
                    name="file-alt"
                    type="font-awesome-5"
                    color="black"
                    size={34}
                    tvParallaxProperties={undefined}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
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
                    {newsData.username ?? "(username)"}
                  </Text>
                </View>
                <View>
                  {authorData &&
                    authUser &&
                    authorData.id !== authUser.id &&
                    followerIds.includes(authUser.id) && (
                      <Button
                        title="Unfollow"
                        buttonStyle={{ backgroundColor: "#6AA84F" }}
                        onPress={() => handleUnfollow(authorData.id)}
                      />
                    )}
                  {authorData &&
                    authUser &&
                    authorData.id !== authUser.id &&
                    !followerIds.includes(authUser.id) && (
                      <Button
                        title="Follow"
                        buttonStyle={{ backgroundColor: "#6AA84F" }}
                        onPress={() => handleFollow(authorData.id)}
                      />
                    )}
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: "row", marginBottom: 10 }}>
                <Text style={{ paddingRight: 10, fontSize: 20, minWidth: 35 }}>
                  {topReactions}
                </Text>
                <Avatar
                  // title={newsData.title[0]}
                  // titleStyle={{ color: "black" }}
                  source={
                    (newsData.logo_uri as any) && { uri: newsData.logo_uri }
                  }
                  containerStyle={{
                    borderColor: "green",
                    borderWidth: 1,
                    padding: 3,
                  }}
                />
              </View>

              <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
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
                {authUser?.id == newsData.user_id && (
                  <View style={{ flex: 1 }}>
                    <Icon
                      name="pen"
                      type="font-awesome-5"
                      style={{ paddingHorizontal: 10 }}
                      tvParallaxProperties={undefined}
                      onPress={() => setEditTitleMode(true)}
                    />
                  </View>
                )}
              </View>

              {newsData.updated_at && (
                <View
                  style={{
                    flex: 1,
                    marginTop: 10,
                  }}
                >
                  <Text>Updated {convertDate(newsData.updated_at)}</Text>
                </View>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => {
                  toggleCommentOverlay();
                }}
              >
                <Text style={{ color: "grey" }}>Add comment</Text>
              </TouchableOpacity>
            </View>

            {newsData.snippets && newsData.snippets.length > 0 && (
              <View style={{ flex: 1, borderWidth: 1, borderColor: "red" }}>
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
                  refreshing={loading}
                  onRefresh={handleRefresh}
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
              <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
              <View>
                <Text style={{ width: 50, textAlign: "center" }}>Actions</Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
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
                  Tap the link to add snippets as evidence
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
    </KeyboardAvoidingView>
  );
}
