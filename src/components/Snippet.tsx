import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Overlay } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

import {
  Comment,
  Reaction,
  ReactionMap,
  Snippet as SnippetType,
} from "../types";
import CommentRow from "./CommentRow";
import { postReaction } from "../store/news";

interface Props {
  navigation: any;
  snippet: SnippetType;
  comments?: Comment[];
  reactions?: Reaction[];
  toggleCommentOverlay: (openState?: boolean, commentId?: number) => void;
  handleRefresh: () => void;
}

const Snippet = ({
  navigation,
  snippet,
  comments,
  reactions,
  toggleCommentOverlay,
  handleRefresh,
}: Props) => {
  const [emojiSelectorIsVisible, setEmojiSelectorIsVisible] = useState(false);

  const reduceByAmount = (result: ReactionMap, item: Reaction) => {
    if (Object.hasOwn(result, item.reaction)) {
      result[item.reaction] += 1;
    } else {
      result[item.reaction] = 1;
    }
    return result;
  };

  const topReactionsMap = useMemo(() => {
    if (reactions && reactions.length > 0) {
      return reactions /*.sort(sortByDate)*/
        .reduce(reduceByAmount, {});
    }
    return {};
  }, [reactions]);

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

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      // setEmoji(emoji);
      setEmojiSelectorIsVisible(false);
      const reactionData = {
        snippet_id: snippet.id,
        reaction: emoji,
        summary_id: snippet.summary_id,
      };
      postReaction(reactionData).then(() => {
        handleRefresh();
      });
    },
    [snippet]
  );

  return (
    <View style={{ flex: 1 }} key={`snipet #${snippet.id}`}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <FontAwesome
            name="quote-left"
            size={30}
            style={{ alignSelf: "flex-start" }}
          />

          <Text style={{ paddingRight: 10, fontSize: 20, minWidth: 35 }}>
            {topReactions}
          </Text>

          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: "row", paddingVertical: 5 }}>
              <Text style={{ flex: 1, flexWrap: "wrap" }}>{snippet.value}</Text>
            </View>
          </View>

          <View>
            <FontAwesome
              name="quote-right"
              size={30}
              style={{ alignSelf: "flex-end" }}
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
          }}
        >
          {comments &&
            comments.map((comment) => (
              <CommentRow
                item={comment}
                navigation={navigation}
                key={`comment #${comment.id}`}
              />
            ))}
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                toggleCommentOverlay(true, snippet.id);
              }}
            >
              <Text style={{ color: "gray", textAlign: "center", padding: 10 }}>
                Add comment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Overlay
        isVisible={emojiSelectorIsVisible}
        onBackdropPress={() => setEmojiSelectorIsVisible(false)}
        fullScreen={true}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={() => setEmojiSelectorIsVisible(true)}
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
    </View>
  );
};

export default Snippet;
