import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
  ScrollView,
  RefreshControl,
  Share,
  TextInput,
} from "react-native";
import {
  Avatar,
  CheckBox,
  Overlay,
  Icon,
  Button,
  Input,
} from "react-native-elements";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import IonIcon from "react-native-vector-icons/Ionicons";
import FontistoIcon from "react-native-vector-icons/Fontisto";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

import commonStyle from "../styles/CommonStyle";
import BottomToolbar from "../components/BottomToolbar";
import {
  deleteSummary,
  followAuthor,
  getNewsById,
  getNewsByUid,
  markAsRead,
  postComment,
  postReaction,
  postShare,
  sendNotification,
  unfollowAuthor,
  updateSummary,
} from "../store/news";

import { getAuthUser, getProfileInformation } from "../store/auth";
import {
  Comment,
  Reaction,
  ReactionMap,
  Snippet as SnippetType,
  Summary,
  User,
} from "../types";
import CommentRow from "../components/CommentRow";
import { convertDate } from "../util";
import Snippet from "../components/Snippet";
import useCurrentUserContext from "../hooks/useCurrentUserContext";
import VoiceInput from "../components/VoiceInput";
import SourceLogo from "../components/SourceLogo";

interface Props {
  route: {
    params: { data: any };
  };
  navigation: any;
  setCurrentSummaryId: (id: number | undefined) => void;
  setCurrentUser: (user: User) => void;
}

export default function NewsViewScreen(props: Props) {
  const {
    route: {
      params: { data },
    },
    navigation,
    setCurrentSummaryId,
    setCurrentUser,
  } = props;
  let richText: any = useRef(null);
  const [newsData, setNewsData] = useState<Summary | undefined>();
  const [selectedCommentId, setSelectedCommentId] = useState<
    number | undefined
  >();
  const [selectedSnippetId, setSelectedSnippetId] = useState<
    number | undefined
  >();
  const [commentText, setCommentText] = useState("");
  const [visibleCommentModal, setVisibleCommentModal] = useState(false);
  const [emojiSelectorIsVisible, setEmojiSelectorIsVisible] = useState(false);
  // const [emoji, setEmoji] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [authorData, setAuthorData] = useState<User | undefined>();
  const [editTitleMode, setEditTitleMode] = useState(false);
  const [globalComments, setGlobalComments] = useState<Comment[] | undefined>();
  const [globalReactions, setGlobalReactions] = useState<
    Reaction[] | undefined
  >();
  const [watchIsEnabled, setWatchIsEnabled] = useState(false);
  const [addSnippetIsVisible, setAddSnippetVisible] = useState(false);
  const [newSnippetValue, setNewSnippetValue] = useState<string | undefined>();

  const currentUser = useCurrentUserContext();

  const handleRefresh = async () => {
    setLoading(true);
    if (data.id) {
      await getNewsDataById(data.id);
    } else if (data.uid) {
      await getNewsDataByUid(data.uid);
    }
    const newUser = await getAuthUser();
    setCurrentUser(newUser);
    setLoading(false);
  };

  useEffect(() => {
    if (newsData && !authorData) {
      populateAuthorData(newsData.user_id);
    }
  }, [newsData]);

  useEffect(() => {
    if (newsData) {
      setWatchIsEnabled(newsData.is_watched ?? false);
    }
  }, [newsData]);

  const getNewsDataById = (id: number) => {
    setLoading(true);
    return getNewsById(id).then((result) => {
      setNewsData(result);
      setLoading(false);
    });
  };

  const getNewsDataByUid = (uid: string) => {
    setLoading(true);
    return getNewsByUid(uid).then((result) => {
      setNewsData(result);
      setLoading(false);
    });
  };

  useEffect(() => {
    setCurrentSummaryId(undefined);
  }, []);

  useEffect(() => {
    // TODO: add logic to possibly not refresh when navigating here from HomeScreen because `data` already contains everything
    handleRefresh();
  }, [data]);

  useEffect(() => {
    if (newsData) {
      if (newsData.comments) {
        setGlobalComments(
          newsData.comments.filter((comment) => !comment.snippet_id)
        );
      }
      if (newsData.reactions) {
        setGlobalReactions(
          newsData.reactions.filter((reaction) => !reaction.snippet_id)
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

  const toggleCommentOverlay = (openState?: boolean, snippetId?: number) => {
    if (openState === false || visibleCommentModal) {
      setCommentText("");
      setSelectedCommentId(undefined);
    }
    if (openState !== undefined) {
      setVisibleCommentModal(openState);
    } else {
      setVisibleCommentModal(!visibleCommentModal);
    }
    if (snippetId) {
      setSelectedSnippetId(snippetId);
    }
  };

  const toggleEmojiOverlay = (openState?: boolean, snippetId?: number) => {
    // if (openState === false || emojiSelectorIsVisible) {
    //   setEmoji(undefined);
    // }
    if (openState !== undefined) {
      setEmojiSelectorIsVisible(openState);
    } else {
      setEmojiSelectorIsVisible(!emojiSelectorIsVisible);
    }
    if (snippetId) {
      setSelectedSnippetId(snippetId);
    } else {
      setSelectedSnippetId(undefined);
    }
  };

  const getContent = () => {
    let content = "";
    if (newsData && newsData?.snippets) {
      content = newsData?.snippets.map((item: any) => item.value).join("\n\n");
    }
    return content;
  };

  const handleSaveComment = () => {
    const commentData = {
      snippet_id: selectedSnippetId,
      comment: commentText,
      summary_id: data.id,
    };
    postComment(commentData).then(() => {
      toggleCommentOverlay(false);
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

  const populateAuthorData = async (user_id: number) => {
    setLoading(true);
    const data = await getProfileInformation(user_id);
    setAuthorData(data);
    setLoading(false);
  };

  const followerIds = useMemo(() => {
    if (authorData?.followers) {
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

  const handleEmojiSelect = async (emoji: string, snippetId?: number) => {
    setEmojiSelectorIsVisible(false);
    await postReaction({
      reaction: emoji,
      summary_id: newsData?.id,
      snippet_id: snippetId,
    });
    handleRefresh();
  };

  const goToUrl = (newsData: Summary) => {
    setCurrentSummaryId(newsData.id);
    Linking.openURL(newsData.url);
  };

  const toggleEditTitle = async (openState: boolean, newsData: Summary) => {
    if (openState) {
      setEditTitleMode(true);
    } else {
      setEditTitleMode(false);
      await updateSummary(newsData.id, {
        title: newsData.title,
      });
    }
  };

  const saveNewSnippet = useCallback(() => {
    if (newsData?.id && newSnippetValue) {
      const newSnippet = {
        value: newSnippetValue,
        summary_id: newsData.id,
      };
      updateSummary(newsData.id, {
        snippets: [newSnippet],
      }).then(() => {
        setAddSnippetVisible(false);
        setNewSnippetValue(undefined);
        handleRefresh();
      });
    }
  }, [newsData, newSnippetValue]);

  return (
    <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
      <View style={commonStyle.pageContainer}>
        {newsData && (
          <ScrollView
            style={{
              flex: 1,
              padding: 10,
            }}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
            }
            contentContainerStyle={{
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flexShrink: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View style={{ flex: 1 }}>
                {/* <Icon
                  name="file-alt"
                  type="font-awesome-5"
                  color="black"
                  size={50}
                  tvParallaxProperties={undefined}
                /> */}
              </View>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AuthorView", {
                    data: { id: newsData.user_id },
                  });
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
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
                    size="medium"
                    // containerStyle={{
                    //   borderColor: "green",
                    //   borderWidth: 1,
                    //   padding: 3,
                    // }}
                  />
                  <Text style={{ paddingHorizontal: 20, fontSize: 18 }}>
                    {newsData.username ?? "(username)"}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={{ flex: 1 }}>
                {authorData &&
                  currentUser &&
                  authorData.id !== currentUser.id &&
                  followerIds.includes(currentUser.id) && (
                    <Button
                      title="Unfollow"
                      titleStyle={{ fontSize: 16 }}
                      buttonStyle={{ backgroundColor: "#6AA84F" }}
                      onPress={() => handleUnfollow(authorData.id)}
                    />
                  )}
                {authorData &&
                  currentUser &&
                  authorData.id !== currentUser.id &&
                  !followerIds.includes(currentUser.id) && (
                    <Button
                      title="Follow"
                      titleStyle={{ fontSize: 16 }}
                      buttonStyle={{ backgroundColor: "#6AA84F" }}
                      onPress={() => handleFollow(authorData.id)}
                    />
                  )}
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                paddingTop: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                }}
              >
                {topReactions.join("") || (
                  <FontistoIcon name="surprised" size={26} />
                )}
              </Text>
              <SourceLogo
                data={{
                  id: newsData.source_id,
                  logo_uri: newsData.logo_uri,
                  baseurl: newsData.source_baseurl,
                }}
                style={{
                  minWidth: 34,
                  height: 34,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                flexWrap: "wrap",
                flexShrink: 1,
              }}
            >
              {!editTitleMode && (
                <Text
                  style={{
                    fontSize: 18,
                    padding: 10,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "blue",
                  }}
                  onPress={() => goToUrl(newsData)}
                >
                  {newsData.title}
                </Text>
              )}
              {editTitleMode && (
                <Input
                  // ref={titleInputRef}
                  label="Factual Title"
                  placeholder="New title that explains the factual contribution"
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
                  autoCompleteType={undefined}
                  multiline={true}
                />
              )}
            </View>

            {currentUser?.id == newsData.user_id && (
              <Button
                onPress={() => toggleEditTitle(!editTitleMode, newsData)}
                title={editTitleMode ? "✔️ Set Title" : "🖊️ Edit Title"}
                buttonStyle={{ backgroundColor: "blue" }}
              />
            )}

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "gray" }}>
                {newsData.updated_at &&
                  newsData.updated_at === newsData.created_at &&
                  `Created ${convertDate(newsData.updated_at)}`}
                {newsData.updated_at &&
                  newsData.updated_at !== newsData.created_at &&
                  `Updated ${convertDate(newsData.updated_at)}`}
              </Text>
              <CheckBox
                title="Watch"
                checked={watchIsEnabled}
                onPress={() => {
                  setWatchIsEnabled(!watchIsEnabled);
                }}
              />
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "column",
              }}
            >
              {newsData.comments &&
                newsData.comments
                  .filter((comment) => !comment.snippet_id)
                  .map((comment) => (
                    <CommentRow
                      item={comment}
                      navigation={navigation}
                      key={`comment #${comment.id}`}
                    />
                  ))}
              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <Text
                  style={{ color: "blue", textAlign: "center", padding: 10 }}
                  onPress={() => toggleEmojiOverlay(true)}
                >
                  <FontistoIcon name="surprised" /> React (
                  {globalReactions?.length ?? 0})
                </Text>
                <Text
                  style={{ color: "blue", textAlign: "center", padding: 10 }}
                  onPress={() => {
                    toggleCommentOverlay(true);
                  }}
                >
                  <IonIcon name="chatbubble" /> Comment (
                  {globalComments?.length ?? 0})
                </Text>
                <Text
                  style={{ color: "blue", textAlign: "center", padding: 10 }}
                  onPress={async () => {
                    const result = await Share.share({
                      message: `https://inspect.datagotchi.net/facts/${newsData.uid}`,
                    });
                    if (result.action === Share.sharedAction) {
                      await postShare(newsData.id, result.activityType);
                    }
                  }}
                >
                  <IonIcon name="share-social" /> Share (
                  {newsData.shares.length})
                </Text>
              </View>
            </View>

            {addSnippetIsVisible && (
              <View style={{ flex: 1 }}>
                <TextInput
                  style={{
                    height: 100,
                    width: "100%",
                    backgroundColor: "white",
                  }}
                  value={newSnippetValue}
                  onChangeText={(text: string) => setNewSnippetValue(text)}
                  multiline={true}
                />
                <Button
                  title="Save"
                  onPress={saveNewSnippet}
                  disabled={!newSnippetValue}
                />
              </View>
            )}

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{ flex: 1, height: 1, backgroundColor: "black" }}
                />
                <View>
                  <Text
                    style={{
                      width: 70,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Evidence
                  </Text>
                </View>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: "black" }}
                />
              </View>
              {newsData.snippets.length === 0 && (
                <Text style={{ textAlign: "center", padding: 10 }}>
                  (None yet added)
                </Text>
              )}
              {newsData.snippets.map((snippet) => (
                <Snippet
                  snippet={snippet}
                  comments={newsData.comments.filter(
                    (comment) => comment.snippet_id == snippet.id
                  )}
                  reactions={newsData.reactions.filter(
                    (reaction) => reaction.snippet_id == snippet.id
                  )}
                  navigation={navigation}
                  toggleCommentOverlay={toggleCommentOverlay}
                  toggleEmojiOverlay={toggleEmojiOverlay}
                  handleRefresh={handleRefresh}
                  key={`snippet component #${snippet.id}`}
                />
              ))}
              {currentUser?.id == newsData.user_id && newsData && (
                <Button
                  title="➕ Evidence"
                  onPress={() => {
                    setAddSnippetVisible(true);
                  }}
                  titleStyle={{ fontSize: 16 }}
                />
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
              <View>
                <Text
                  style={{ width: 60, textAlign: "center", fontWeight: "bold" }}
                >
                  Actions
                </Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              {!newsData.is_archived && (
                <Button
                  onPress={archiveItem}
                  title="🗂 Archive"
                  buttonStyle={{ backgroundColor: "orange" }}
                />
              )}
              {currentUser?.id == newsData.user_id && (
                <Button
                  onPress={deleteItem}
                  title="🗑 Delete"
                  buttonStyle={{ backgroundColor: "red" }}
                />
              )}
            </View>
          </ScrollView>
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
          onBackdropPress={() => toggleCommentOverlay(false)}
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
              <VoiceInput
                resultCallback={(text: string) => {
                  richText.current.setContentHTML(text);
                  setCommentText(text);
                }}
              />
              <TouchableOpacity
                onPress={handleSaveComment}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  padding: 2,
                  borderRadius: 3,
                  paddingRight: 10,
                  borderColor: "gray",
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
                    color: commentText?.length > 0 ? "black" : "gray",
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
                pasteAsPlainText={true}
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
          isVisible={emojiSelectorIsVisible}
          // onBackdropPress={() => toggleEmojiOverlay(false)}
          fullScreen={true}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => toggleEmojiOverlay(false)}
            >
              <MaterialIcon
                name="close"
                color={"black"}
                size={30}
                style={{ marginBottom: 10 }}
              />
            </TouchableOpacity>
            <EmojiSelector
              onEmojiSelected={(emoji) =>
                handleEmojiSelect(emoji, selectedSnippetId)
              }
              showSearchBar={false}
              showTabs={true}
              showHistory={true}
              showSectionTitles={true}
              category={Categories.all}
            />
          </SafeAreaView>
        </Overlay>
      </View>
    </KeyboardAvoidingView>
  );
}
