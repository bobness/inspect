import React from "react";
import { View } from "react-native";
import { Avatar, ListItem, Text } from "react-native-elements";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Summary } from "../types";
import { convertDate } from "../util";

interface Props {
  item: Summary;
  onPress: (e: any) => void;
  onSwipe: () => void;
}

const SWIPE_THRESHOLD = -150;

const NewsRow = ({ item, onPress, onSwipe }: Props) => {
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value.x }, { translateY: offset.value.y }],
  }));

  const archive = () =>
    Gesture.Pan()
      .runOnJS(true)
      .onStart(() => {})
      .onUpdate((e) => {
        if (e.translationX < 0) {
          offset.value = {
            x: e.translationX + start.value.x,
            y: start.value.y,
          };
        }
      })
      .onEnd(() => {
        // TODO: make this a % of the element's width, ideally
        if (offset.value.x < SWIPE_THRESHOLD) {
          onSwipe();
        } else {
          offset.value = start.value;
        }
      });

  return (
    <GestureDetector gesture={archive()}>
      <Animated.View style={animatedStyles}>
        <ListItem
          bottomDivider
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
          // style={animatedStyles}
          onPress={onPress}
          key={`summary #${item.id}`}
        >
          <Avatar
            // title={item.title[0]}
            // titleStyle={{ color: "black" }}
            source={(item.avatar_uri as any) && { uri: item.avatar_uri }}
            // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
          />
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
          </ListItem.Content>
          <View>
            <Avatar
              // title={item.title[0]}
              // titleStyle={{ color: "black" }}
              source={(item.logo_uri as any) && { uri: item.logo_uri }}
              // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
            />
            {item.updated_at && <Text>{convertDate(item.updated_at)}</Text>}
          </View>
        </ListItem>
      </Animated.View>
    </GestureDetector>
  );
};

export default NewsRow;
