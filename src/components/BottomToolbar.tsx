import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Text,
} from "react-native";
import { Button, Input, Overlay } from "react-native-elements";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

export default function BottomToolbar({ navigation }: any) {
  const [summaryUrlModalVisible, setSummaryUrlModalVisible] = useState(false);
  const [summaryUrl, setSummaryUrl] = useState<string | undefined>();

  const doCreateSummary = useCallback(() => {
    setSummaryUrlModalVisible(false);
    setTimeout(() => setSummaryUrl(undefined), 300);
    navigation.navigate("CreateSummary", { data: { weblink: summaryUrl } });
  }, [summaryUrl]);

  const validUrlRegex = useMemo(() => RegExp("https?://.*"), []);
  const validUrl = useCallback(
    (text?: string) => text && text.match(validUrlRegex),
    [validUrlRegex]
  );

  const confirmLogout = () => {
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
            navigation.navigate("Login");
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <>
      <View
        style={{ backgroundColor: "white", flexDirection: "row", padding: 10 }}
      >
        <TouchableOpacity
          style={{
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <FontAwesomeIcon name="home" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
          onPress={() => {
            setSummaryUrlModalVisible(true);
          }}
        >
          <FontAwesomeIcon name="plus" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
          onPress={() => {
            navigation.navigate("My Profile");
          }}
        >
          <FontAwesomeIcon name="user" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
          onPress={() => {
            confirmLogout();
          }}
        >
          <FontAwesomeIcon name="sign-out" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <Overlay
        isVisible={summaryUrlModalVisible}
        onBackdropPress={() => {
          setSummaryUrlModalVisible(false);
          setSummaryUrl(undefined);
        }}
        overlayStyle={{ width: "100%" }}
      >
        <SafeAreaView>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 20 }}>Create Summary</Text>
            <Input
              label="URL"
              value={summaryUrl}
              onChangeText={(text: string) => {
                setSummaryUrl(text);
              }}
              autoCompleteType={undefined}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Button
              title="Create Summary"
              onPress={doCreateSummary}
              disabled={!summaryUrl || !validUrl(summaryUrl)}
            />
          </View>
        </SafeAreaView>
      </Overlay>
    </>
  );
}
