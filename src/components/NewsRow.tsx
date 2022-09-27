import React from "react";
import { Avatar, ListItem } from "react-native-elements";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface Props {
  item: any;
  onPress: (e: any) => void;
  onSwipe: () => void;
}

// FIXME: dragging gets stuck
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
        if (offset.value.x < 0) {
          start.value = {
            x: offset.value.x,
            y: offset.value.y,
          };
          start.value = offset.value;
          onSwipe();
        }
      });

  return (
    <GestureDetector gesture={archive()}>
      <Animated.View style={animatedStyles}>
        <ListItem
          bottomDivider
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
          style={{ flex: 1, width: "100%" }}
          // style={animatedStyles}
          onPress={onPress}
        >
          <Avatar
            // title={item.title[0]}
            // titleStyle={{ color: "black" }}
            source={item.avatar_uri && { uri: item.avatar_uri }}
            // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
          />
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
          </ListItem.Content>
          <Avatar
            // title={item.title[0]}
            // titleStyle={{ color: "black" }}
            source={item.logo_uri && { uri: item.logo_uri }}
            // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
          />
        </ListItem>
      </Animated.View>
    </GestureDetector>
  );
};

export default NewsRow;
