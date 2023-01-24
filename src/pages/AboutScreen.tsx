import React, { useCallback } from "react";
import { Alert, Linking, Text, View } from "react-native";
import { Avatar, Button } from "react-native-elements";
import BottomToolbar from "../components/BottomToolbar";

import commonStyle from "../styles/CommonStyle";

interface Props {
  navigation: any;
}

export default function AboutScreen(props: Props) {
  const confirmLogout = useCallback(() => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to Logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            props.navigation.navigate("Login");
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  }, [Alert, props.navigation]);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
            maxHeight: 134,
          }}
        >
          <Text style={commonStyle.logoText}>
            <Avatar source={{ uri: "icon.png" }} />
            INSPECT
          </Text>
        </View>
        <Text style={{ margin: 10 }}>
          A mobile app to share important news, from reliable sources, with to
          those close to you
        </Text>
        <Text style={{ margin: 10 }}>
          <Avatar source={{ uri: "Color1.png" }} />
          Created by{" "}
          <Text
            style={{ color: "blue", textDecorationLine: "underline" }}
            onPress={() => Linking.openURL("https://datagotchi.net")}
          >
            Datagothchi Labs
          </Text>{" "}
          -- a not-for-profit R&D lab to empower people with information
        </Text>
        <Text style={{ margin: 10 }}>
          <Avatar source={{ uri: "discord.png" }} />
          Come visit us on our{" "}
          <Text
            style={{ color: "blue", textDecorationLine: "underline" }}
            onPress={() =>
              Linking.openURL(
                "https://discord.com/channels/985730197376606258/1003748416821657692"
              )
            }
          >
            Discord server
          </Text>{" "}
          -- where you can ask questions or just chat!
        </Text>
        <Button
          title="Logout"
          onPress={() => confirmLogout()}
          style={{ margin: 10 }}
        />
      </View>
      <BottomToolbar navigation={props.navigation} />
    </View>
  );
}
