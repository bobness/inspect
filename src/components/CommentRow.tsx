import React from "react";
import { Dimensions, View } from "react-native";
import AutoHeightWebView from "react-native-autoheight-webview";
import { Avatar, ListItem, Text } from "react-native-elements";

import { Comment } from "../types";
import { convertDate } from "../util";

const AVATAR_WIDTH = 50;
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
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Avatar
          // title={newsData?.title[0]}
          // titleStyle={{ color: "black" }}
          source={
            (item.avatar_uri as any) && {
              uri: item.avatar_uri,
            }
          }
          containerStyle={{
            width: AVATAR_WIDTH,
            height: AVATAR_WIDTH,
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
        <AutoHeightWebView
          style={{
            width:
              Dimensions.get("window").width -
              TAB_SIZE -
              AVATAR_WIDTH -
              LIST_PADDING,
            height: 50,
          }}
          // onSizeUpdated={(size) => console.log(size.height)}
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
        <Text style={{ fontSize: 11, color: "gray" }}>
          {convertDate(item.created_at)}
        </Text>
      </View>
    </View>
  );
};

export default CommentRow;
