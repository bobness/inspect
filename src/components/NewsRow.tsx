import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Avatar, ListItem, Text } from "react-native-elements";
import { Gesture, GestureDetector, State } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Summary } from "../types";
import { convertDate } from "../util";

interface Props {
  item: Summary;
  onPress: (e: any) => void;
  onSwipe: (id: number) => void;
}

const GESTURE_THRESHOLD = 20;
const SWIPE_THRESHOLD = 150;

const NewsRow = ({ item, onPress, onSwipe }: Props) => {
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value.x }, { translateY: offset.value.y }],
  }));

  // HACK: can't change React state because that's on the JS thread
  // so: create a variable on the UI thread
  const articleIdToArchive = useSharedValue(0);
  // then, on the JS thread, occasionally check it and act on it
  setInterval(() => {
    if (articleIdToArchive.value > 0) {
      // TODO: sometimes happens > 1 time... but maybe that's OK
      onSwipe(articleIdToArchive.value);
      articleIdToArchive.value = 0;
    }
  }, 100);

  // const stateManagers = {
  //   vertical: useSharedValue<GestureStateManagerType | undefined>(undefined),
  //   horizontal: useSharedValue<GestureStateManagerType | undefined>(undefined),
  // };

  // const verticalPanGesture = Gesture.Pan()
  //   .manualActivation(true)
  //   .runOnJS(true)
  //   .onTouchesMove((e, sm) => {
  //     const hasMoved = e.changedTouches.reduce<boolean>((hasMoved, touch) => {
  //       if (!hasMoved && Math.abs(touch.y) > GESTURE_THRESHOLD) {
  //         return true;
  //       }
  //       return hasMoved;
  //     }, false);
  //     if (hasMoved) {
  //       console.log("*** activating vertical pan");
  //       sm.activate();
  //     }
  //   })
  //   .onUpdate((e) => {
  //     // FIXME: maybe use a threshold instead of 0
  //     // TODO: handle scrolling up (refresh) and down (seeing more items) differently?
  //     if (Math.abs(e.translationY) > 0) {
  //       console.log("*** detected vertical movement");
  //       if (e.state === State.ACTIVE) {
  //         console.log("*** updating vertical offset");
  //         offset.value = {
  //           x: start.value.x,
  //           y: e.translationY + start.value.y,
  //         };
  //       } else if (stateManagers.vertical.value) {
  //         // FIXME: maybe need to look at the other state values, too
  //         console.log("*** gesture state: ", e.state);
  //         console.log("*** activating vertical state manager");
  //         stateManagers.vertical.value.activate();
  //       }
  //     } else {
  //       // FIXME: verify that this doesn't fail too quickly
  //       console.log("*** FAILING vertical state manager");
  //       stateManagers.vertical.value?.fail();
  //     }
  //   });
  // .onEnd(() => {
  // TODO: make this a % of the element's width, ideally
  // if (offset.value.y < SWIPE_THRESHOLD) {
  // FIXME: do vertical gestures require an onEnd action?
  // onSwipe();
  // } else {
  //   offset.value = start.value;
  // }
  // });

  const horizontalPanGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((e, sm) => {
      if (e.state !== State.ACTIVE) {
        const hasMoved = e.changedTouches.reduce<boolean>((hasMoved, touch) => {
          if (!hasMoved && Math.abs(touch.x) > GESTURE_THRESHOLD) {
            return true;
          }
          return hasMoved;
        }, false);
        if (hasMoved) {
          // console.log("*** activating horizontal pan");
          sm.activate();
        }
      }
    })
    // .runOnJS(true)
    .onUpdate((e) => {
      // FIXME: maybe use a threshold instead of 0
      if (e.translationX < 0) {
        // console.log("*** detected horizontal movement");
        if (e.state === State.ACTIVE) {
          // console.log("*** updating horizontal offset");
          offset.value = {
            x: e.translationX + start.value.x,
            y: start.value.y,
          };
        }
      }
    })
    .onEnd(() => {
      // TODO: make this a % of the element's width, ideally
      if (offset.value.x < -SWIPE_THRESHOLD) {
        // TODO: this code is on the UI thread, so it can ONLY call *pure* worklet code
        // console.log("*** setting articleIdToArchive.value to: ", item.id!);
        articleIdToArchive.value = item.id!;
      } else {
        offset.value = start.value;
      }
    });
  // .simultaneousWithExternalGesture(verticalPanGesture);

  // const composedPanGesture = Gesture.Race(
  //   horizontalPanGesture,
  //   verticalPanGesture
  // );

  return (
    <GestureDetector gesture={horizontalPanGesture}>
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
