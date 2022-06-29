import React, { useEffect, useRef, useState } from "react";

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
} from "react-native";
import { Avatar, Overlay, Icon } from "react-native-elements";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import BottomToolbar from "../components/BottomToolbar";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import BottomAction from "../components/BottomAction";
import { getNewsById, postComment, postReaction } from "../store/news";
import moment from "moment";
import AutoHeightWebView from "react-native-autoheight-webview";

import { Dimensions } from "react-native";

const list = [
  {
    title: "The super rich often pay < 1% in taxes",
    subtitle: "Vice President",
    avatar_url:
      "https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg",
    website_logo:
      "https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg",
  },
  {
    title: "GOP filibusters Jan 6 commission",
    avatar_url:
      "https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png",
    website_logo:
      "https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9",
    subtitle: "Vice Chairman",
  },
  {
    title: "The super rich often pay < 1% in taxes",
    subtitle: "Vice President",
    avatar_url:
      "https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg",
    website_logo:
      "https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg",
  },
  {
    title: "GOP filibusters Jan 6 commission",
    avatar_url:
      "https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png",
    website_logo:
      "https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9",
    subtitle: "Vice Chairman",
  },
  {
    title: "The super rich often pay < 1% in taxes",
    subtitle: "Vice President",
    avatar_url:
      "https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg",
    website_logo:
      "https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg",
  },
  {
    title: "GOP filibusters Jan 6 commission",
    avatar_url:
      "https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png",
    website_logo:
      "https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9",
    subtitle: "Vice Chairman",
  },
  {
    title: "The super rich often pay < 1% in taxes",
    subtitle: "Vice President",
    avatar_url:
      "https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg",
    website_logo:
      "https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg",
  },
  {
    title: "GOP filibusters Jan 6 commission",
    avatar_url:
      "https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png",
    website_logo:
      "https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9",
    subtitle: "Vice Chairman",
  },
  {
    title: "The super rich often pay < 1% in taxes",
    subtitle: "Vice President",
    avatar_url:
      "https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg",
    website_logo:
      "https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg",
  },
  {
    title: "GOP filibusters Jan 6 commission",
    avatar_url:
      "https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png",
    website_logo:
      "https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9",
    subtitle: "Vice Chairman",
  },
  {
    title: "The super rich often pay < 1% in taxes",
    subtitle: "Vice President",
    avatar_url:
      "https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg",
    website_logo:
      "https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg",
  },
  {
    title: "GOP filibusters Jan 6 commission",
    avatar_url:
      "https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png",
    website_logo:
      "https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9",
    subtitle: "Vice Chairman",
  },
  {
    title: "The super rich often pay < 1% in taxes",
    subtitle: "Vice President",
    avatar_url:
      "https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg",
    website_logo:
      "https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg",
  },
  {
    title: "GOP filibusters Jan 6 commission",
    avatar_url:
      "https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png",
    website_logo:
      "https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9",
    subtitle: "Vice Chairman",
  },
];

export default function NewsViewScreen(props: any) {
  const {
    route: {
      params: { data },
    },
    navigation,
  } = props;
  let richText: any = useRef(null);
  const [newsData, setNewsData]: any = useState(null);
  const [selectedCommentId, selectCommentId]: any = useState(null);
  const [selectedComments, setSelectedComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleCommentModal, setVisibleCommentModal] = useState(false);
  const [visibleViewCommentModal, setVisibleViewCommentModal] = useState(false);
  const [emoji, setEmoji] = useState("🤔");
  const [loading, setLoading] = useState(false);

  const convertDate = (date_str: string) => {
    return moment(date_str).fromNow();
  };

  const getNewsDataById = (id: number) => {
    setLoading(true);
    getNewsById(id).then((result) => {
      setNewsData(result);
      setLoading(false);
    });
  };

  useEffect(() => {
    getNewsDataById(data.id);
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

  const getComments = (snippet_id: number) => {
    return newsData.comments.filter(
      (reaction: any) => reaction.snippet_id == snippet_id
    );
  };

  const getEmoji = (snippet_id: number) => {
    return newsData.reactions.filter(
      (reaction: any) => reaction.snippet_id == snippet_id
    );
  };

  const renderItem = ({ item }: any) => {
    const emojis = getEmoji(item.id);
    const commments = getComments(item.id);
    return (
      <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          onPress={() => {
            selectCommentId(item.id);
            setVisible(!visible);
          }}
        >
          <View style={{ flexDirection: "row", paddingVertical: 5 }}>
            <Text style={{ paddingRight: 10, fontSize: 20, minWidth: 35 }}>
              {emojis.length > 0 ? emojis[0].reaction : ""}
            </Text>
            <Text>{item.value}</Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            paddingLeft: 36,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 16, color: "grey" }}>
              {emojis.length > 0 ? emojis[0].reaction : ""}{" "}
              {emojis.length > 0 ? emojis.length : ""}
            </Text>
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
  };

  const renderCommentItem = ({ item }: any) => {
    return (
      <View style={{ flex: 1, width: "100%" }}>
        <View style={{ marginTop: 10 }}>
          <AutoHeightWebView
            style={{ width: Dimensions.get("window").width - 15, height: 50 }}
            customStyle={`
                            * {
                                font-family: 'Times New Roman';
                            }
                            p {
                                font-size: 14px;
                                line-height: 30px;
                            }
                        `}
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

  if (!newsData) {
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

  return (
    <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={commonStyle.pageContainer}>
          <View style={{ flex: 1, padding: 10 }}>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                paddingBottom: 10,
                alignItems: "center",
              }}
            >
              <Avatar
                title={newsData?.title[0]}
                titleStyle={{ color: "black" }}
                source={newsData?.avatar_uri && { uri: newsData?.avatar_uri }}
                containerStyle={{
                  borderColor: "green",
                  borderWidth: 1,
                  padding: 3,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  flex: 1,
                  paddingHorizontal: 10,
                  textAlign: "center",
                }}
              >
                {newsData?.title}
              </Text>
              <Avatar
                title={newsData?.title[0]}
                titleStyle={{ color: "black" }}
                source={
                  newsData?.website_logo
                    ? { uri: newsData?.website_logo }
                    : undefined
                }
                containerStyle={{
                  borderColor: "green",
                  borderWidth: 1,
                  padding: 3,
                }}
              />
            </View>
            <FlatList
              data={newsData?.snippets || []}
              renderItem={renderItem}
              style={{ flex: 1, width: "100%" }}
              refreshing={loading}
              onRefresh={handleRefresh}
            />
            <BottomAction
              title={newsData?.title}
              content={getContent()}
              url={newsData?.website_logo}
            />
          </View>
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
                <Text>Feedback:</Text>
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
                    color="#ccc"
                    style={{ paddingHorizontal: 10 }}
                    tvParallaxProperties={undefined}
                  />
                  <Text style={{ color: "grey", fontWeight: "bold" }}>
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
