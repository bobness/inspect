import React from "react";
import { ListItem, Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { User } from "../types";

interface Props {
  item: User;
  onPress: (item: any) => void;
}

const UserListItem = ({ item, onPress }: Props) => {
  return (
    <ListItem
      bottomDivider
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      style={{ flex: 1, width: "100%" }}
      onPress={() => onPress(item)}
    >
      <Icon name="newspaper-variant" size={20} color="#517fa4" />
      <Avatar
        // title={item.title[0]}
        // titleStyle={{ color: "black" }}
        source={(item.avatar_uri as any) && { uri: item.avatar_uri }}
        // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
      />
      <ListItem.Content>
        <ListItem.Title>{item.username}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
};

export default UserListItem;
