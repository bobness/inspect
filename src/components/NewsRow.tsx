import React, { useEffect, useMemo, useState } from "react";
import { Image, View } from "react-native";
import { Avatar, Icon, ListItem, Text } from "react-native-elements";
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
  onSwipeLeft: (id: number) => void;
}

const FULL_HORIZONTAL_THRESHOLD = 100; // px

const NewsRow = ({ item, onPress, onSwipeLeft }: Props) => {
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value.x }],
  }));

  const startPosition = useSharedValue({ x: 0, y: 0 });

  // HACK: can't change React state because that's on the JS thread
  // so: create a variable on the UI thread
  const articleIdToArchive = useSharedValue(0);
  // then, on the JS thread, occasionally check it and act on it
  setInterval(() => {
    if (articleIdToArchive.value > 0) {
      onSwipeLeft(articleIdToArchive.value);
      articleIdToArchive.value = 0;
    }
  }, 50);

  const horizontalPanGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown((event, manager) => {
      startPosition.value = {
        x: event.changedTouches[0].x,
        y: event.changedTouches[0].y,
      };
    })
    .onTouchesMove((event, manager) => {
      const lastPosition = {
        x: event.changedTouches[0].x,
        y: event.changedTouches[0].y,
      };
      const xMovement = lastPosition.x - startPosition.value.x;
      const slope = (lastPosition.y - startPosition.value.y) / xMovement;
      if (slope > -Infinity && Math.abs(slope) <= 1) {
        manager.activate();
      } else {
        manager.fail();
      }
    })
    .onUpdate((event) => {
      if (event.state === State.ACTIVE && Math.abs(event.translationX) > 0) {
        offset.value = {
          x: event.translationX + start.value.x,
          y: start.value.y,
        };
      }
    })
    .onEnd(() => {
      if (Math.abs(offset.value.x) > FULL_HORIZONTAL_THRESHOLD) {
        articleIdToArchive.value = item.id!;
        if (offset.value.x < 0) {
          offset.value = {
            x: offset.value.x - 3000,
            y: start.value.y,
          };
        } else {
          offset.value = {
            x: offset.value.x + 3000,
            y: start.value.y,
          };
        }
      } else {
        offset.value = start.value;
      }
    });

  return (
    <GestureDetector gesture={horizontalPanGesture} key={`summary #${item.id}`}>
      <Animated.View style={animatedStyles}>
        <ListItem
          bottomDivider
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
          style={{
            flex: 1,
            justifyContent: "flex-start",
            marginVertical: 5,
            marginHorizontal: 10,
            borderWidth: 1,
            borderColor: "gray",
          }}
          onPress={onPress}
        >
          <Avatar
            // title={item.title[0]}
            // titleStyle={{ color: "black" }}
            size="medium"
            source={(item.avatar_uri as any) && { uri: item.avatar_uri }}
            // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
          />
          <ListItem.Content
            style={{
              flex: 1,
            }}
          >
            <ListItem.Title style={{ fontSize: 14 }}>
              {item.title}
            </ListItem.Title>
          </ListItem.Content>
          <View>
            {item.logo_uri && (
              <Image
                // title={item.title[0]}
                // titleStyle={{ color: "black" }}
                source={(item.logo_uri as any) && { uri: item.logo_uri }}
                style={{
                  // borderColor: "green",
                  // borderWidth: 1,
                  // padding: 3,
                  height: 34,
                  resizeMode: "contain",
                }}
              />
            )}
            {!item.logo_uri && (
              <Text style={{ textAlign: "center" }}>{item.source_baseurl}</Text>
            )}
            <Text style={{ fontSize: 12, textAlign: "center" }}>
              {item.updated_at &&
                item.updated_at === item.created_at &&
                `Created ${convertDate(item.updated_at)}`}
              {item.updated_at &&
                item.updated_at !== item.created_at &&
                `Updated ${convertDate(item.updated_at)}`}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                {/* TODO: get from the service route */}
                {item.snippets?.length ?? "?"}
                <Icon
                  name="sticky-note"
                  type="font-awesome-5"
                  color="black"
                  size={16}
                  tvParallaxProperties={undefined}
                />
              </Text>
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                {/* TODO: get from the service route */}
                {item.reactions?.length ?? "?"}
                <Icon
                  name="smile"
                  type="font-awesome-5"
                  color="black"
                  size={16}
                  tvParallaxProperties={undefined}
                />
              </Text>
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                {/* TODO: get from the service route */}
                {item.comments?.length ?? "?"}
                <Icon
                  name="comments"
                  type="font-awesome-5"
                  color="black"
                  size={16}
                  tvParallaxProperties={undefined}
                />
              </Text>
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                {/* TODO: get from the service route */}
                {item.shares?.length ?? "?"}
                <Icon
                  name="share-alt"
                  type="font-awesome-5"
                  color="black"
                  size={16}
                  tvParallaxProperties={undefined}
                />
              </Text>
            </View>
          </View>
        </ListItem>
      </Animated.View>
    </GestureDetector>
  );
};

export default NewsRow;
