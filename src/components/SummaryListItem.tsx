import React from "react";
import { ListItem, Avatar, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Summary } from "../types";

interface Props {
  item: Summary;
  onPress: (item: any) => void;
}

const SummaryListItem = ({ item, onPress }: Props) => {
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
        <ListItem.Title>{item.title}</ListItem.Title>
      </ListItem.Content>
      {item.logo_uri && (
        <Avatar
          // title={item.title[0]}
          // titleStyle={{ color: "black" }}
          source={(item.logo_uri as any) && { uri: item.logo_uri }}
          // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
        />
      )}
      {!item.logo_uri && <Text>{item.source_baseurl}</Text>}
    </ListItem>
  );
};

export default SummaryListItem;
