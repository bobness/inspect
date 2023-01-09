import React from "react";
import { Linking, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import BottomToolbar from "../components/BottomToolbar";

import commonStyle from "../styles/CommonStyle";

interface Props {
  navigation: any;
}

export default function AboutScreen(props: Props) {
  // states
  // effects
  // callbacks
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <Text style={commonStyle.logoText}>
          <Avatar source={{ uri: "AppIcon.png" }} />
          INSPECT
        </Text>
        <Text style={{ margin: 10 }}>
          A mobile app to share important news with those close to you
        </Text>
        <Text style={{ margin: 10 }}>
          {/* <Avatar source={{ uri: "Color1.png" }} /> */}
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
          {/* <Avatar source={{ uri: "Discord.png" }} /> */}
          Come visit us on our{" "}
          <Text
            style={{ color: "blue", textDecorationLine: "underline" }}
            onPress={() =>
              Linking.openURL(
                "https://discord.com/channels/985730197376606258/1003748416821657692"
              )
            }
          >
            Discord Channel
          </Text>{" "}
          -- where you can ask questions or just chat!
        </Text>
        <Text style={{ margin: 10 }}>
          {/* <Avatar source={{ uri: "Patreon.png" }} /> */}
          If you can, please consider donating on our{" "}
          <Text
            style={{
              color: "blue",
              textDecorationLine: "underline",
              margin: 10,
            }}
            onPress={() =>
              Linking.openURL("https://www.patreon.com/datagotchi")
            }
          >
            Patreon page
          </Text>
        </Text>
      </View>
      <BottomToolbar navigation={props.navigation} />
    </View>
  );
}
