import React from "react";
import { Dimensions, View } from "react-native";
import AutoHeightWebView from "react-native-autoheight-webview";
import { Avatar, ListItem, Text } from "react-native-elements";

import { Comment } from "../types";
import { convertDate } from "../util";

const AVATAR_WIDTH = 34;
const TAB_SIZE = 20;
const LIST_PADDING = 2 * 10;

interface Props {
  item: Comment;
  navigation: any;
}

const CommentRow = ({ item, navigation }: Props) => {
  return (
    <View
      style={{ flex: 1, flexDirection: "column", marginTop: 10 }}
      key={`comment #${item.id}`}
    >
      <View style={{ flex: 1, flexDirection: "row", marginLeft: TAB_SIZE }}>
        {item.avatar_uri && (
          <Avatar
            // title={newsData?.title[0]}
            // titleStyle={{ color: "black" }}
            source={
              (item.avatar_uri as any) && {
                uri: item.avatar_uri,
              }
            }
            containerStyle={{
              marginRight: 5,
            }}
            // containerStyle={{
            //   borderColor: "green",
            //   borderWidth: 1,
            //   padding: 3,
            // }}
            onPress={() => {
              navigation.navigate("AuthorView", {
                data: { id: item.user_id },
              });
            }}
          />
        )}
        {!item.avatar_uri && (
          <Text
            style={{
              width: 34,
              height: 34,
              borderWidth: 1,
              borderColor: "black",
              fontSize: 26,
              marginRight: 5,
              textAlign: "center",
            }}
            onPress={() => {
              navigation.navigate("AuthorView", {
                data: { id: item.user_id },
              });
            }}
          >
            ?
          </Text>
        )}
        <AutoHeightWebView
          style={{
            width:
              Dimensions.get("window").width -
              TAB_SIZE -
              AVATAR_WIDTH -
              LIST_PADDING -
              2, // TODO: why is -2 necessary?
          }}
          files={[
            {
              href: "cssfileaddress",
              type: "text/css",
              rel: "stylesheet",
            },
          ]}
          source={{ html: item.comment }}
          // scalesPageToFit={true}
          scrollEnabled={false}
          viewportContent={"width=device-width, user-scalable=no"}
        />
      </View>
      <View style={{ alignItems: "flex-end", marginTop: 5 }}>
        <Text style={{ fontSize: 11, color: "gray" }}>
          {convertDate(item.created_at)}
        </Text>
      </View>
    </View>
  );
};

export default CommentRow;
