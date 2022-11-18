import React, { useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { ListItem } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { Comment, Reaction, Snippet as SnippetType } from "../types";
import CommentRow from "./CommentRow";

interface Props {
  snippet: SnippetType;
  comments?: Comment[];
  reactions?: Reaction[];
  toggleCommentOverlay: () => void;
  navigation: any;
}

interface ReactionMap {
  [reaction: string]: number;
}

const Snippet = ({
  snippet,
  comments,
  reactions,
  toggleCommentOverlay,
  navigation,
}: Props) => {
  const reduceByAmount = (result: ReactionMap, item: Reaction) => {
    if (Object.hasOwn(result, item.reaction)) {
      result[item.reaction] += 1;
    } else {
      result[item.reaction] = 1;
    }
    return result;
  };

  const getTopEmoji = useCallback(() => {
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
  }, [reactions]);

  return (
    <ListItem
      bottomDivider
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      key={`snipet #${snippet.id}`}
    >
      <View style={{ flexDirection: "row" }}>
        <FontAwesome
          name="quote-left"
          size={30}
          style={{ alignSelf: "flex-start" }}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: "row", paddingVertical: 5 }}>
            <Text style={{ flex: 1, flexWrap: "wrap" }}>
              {snippet.value}
              {/* test */}
            </Text>
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

      {/* <Text style={{ paddingRight: 10, fontSize: 20, minWidth: 35 }}>
            {getTopEmoji()}
          </Text> */}

      <View
        style={{
          flex: 1,
        }}
      >
        {comments && comments.length > 0 && (
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <CommentRow item={item} navigation={navigation} />
            )}
            style={{ marginTop: 5, width: "100%" }}
          />
        )}
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              toggleCommentOverlay();
            }}
          >
            <Text style={{ color: "grey" }}>Add comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ListItem>
  );
};

export default Snippet;
