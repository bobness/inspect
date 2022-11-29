import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Avatar, ListItem, Text } from "react-native-elements";
import { Gesture, GestureDetector, State } from "react-native-gesture-handler";
import Animated, {
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Summary } from "../types";
import { convertDate } from "../util";

interface Props {
  item: Summary;
  onPress: (e: any) => void;
  onLongPress: () => void;
  onSwipeLeft: (id: number) => void;
}

const MIN_HORIZONTAL_THRESHOLD = 50; // px
const FULL_HORIZONTAL_THRESHOLD = 100; // px
const SLIDE_OUT_DURATION = 500; // ms

const NewsRow = ({ item, onPress, onLongPress, onSwipeLeft }: Props) => {
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value.x }, { translateY: offset.value.y }],
  }));

  const isLongPressed = useSharedValue(false);
  const startPosition = useSharedValue(0);

  // HACK: can't change React state because that's on the JS thread
  // so: create a variable on the UI thread
  const articleIdToArchive = useSharedValue(0);
  // then, on the JS thread, occasionally check it and act on it
  setInterval(() => {
    if (articleIdToArchive.value > 0) {
      onSwipeLeft(articleIdToArchive.value);
      articleIdToArchive.value = 0;
    }
    if (isLongPressed.value) {
      onLongPress();
    }
  }, 100);

  const longPressGesture = Gesture.LongPress()
    .onStart(() => {
      isLongPressed.value = true;
    })
    .onTouchesUp(() => {
      console.log("*** onTouchesUp from long press");
      // if they release without swiping
      isLongPressed.value = false;
    })
    .minDuration(250);

  const horizontalPanGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown((event, manager) => {
      startPosition.value = event.changedTouches[0].x;
    })
    .onTouchesMove((event, manager) => {
      if (isLongPressed.value) {
        const lastPosition = event.changedTouches[0].x;
        const xMovement = lastPosition - startPosition.value;

        if (xMovement < -MIN_HORIZONTAL_THRESHOLD) {
          manager.activate();
        }
      } else {
        manager.fail();
      }
    })
    .onUpdate((event) => {
      if (event.state === State.ACTIVE) {
        if (event.translationX < 0) {
          offset.value = {
            x: event.translationX + start.value.x,
            y: start.value.y,
          };
        }
      }
    })
    .onEnd(() => {
      // TODO: make this a % of the element's width, ideally
      if (offset.value.x < -FULL_HORIZONTAL_THRESHOLD) {
        articleIdToArchive.value = item.id!;
      } else {
        offset.value = start.value;
      }
    })
    .onFinalize(() => {
      isLongPressed.value = false;
    })
    .simultaneousWithExternalGesture(longPressGesture);

  const composedGesture = Gesture.Race(horizontalPanGesture, longPressGesture);

  const itemStyle = useMemo(() => {
    const baseStyle = {
      marginVertical: 5,
      marginHorizontal: 10,
    };
    if (isLongPressed.value) {
      return {
        ...baseStyle,
        borderStyle: "dotted" as const,
        borderWidth: 2,
        borderColor: "black",
      };
    }
    return baseStyle;
  }, [isLongPressed.value]);

  // FIXME: test to verify this works
  useEffect(() => {
    return () => {
      isLongPressed.value = false;
    };
  }, []);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={animatedStyles}
        exiting={SlideOutLeft.duration(SLIDE_OUT_DURATION)}
      >
        <ListItem
          bottomDivider
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
          style={itemStyle}
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
