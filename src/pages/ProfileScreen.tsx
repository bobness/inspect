import React, { useCallback, useEffect, useState, useRef } from "react";
import ImagePicker from "react-native-image-crop-picker";
import RNFS from "react-native-fs";

import commonStyle from "../styles/CommonStyle";
import {
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  TouchableWithoutFeedback,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  Input,
  Button,
  Tab,
  TabView,
  ListItem,
  Avatar,
  Overlay,
} from "react-native-elements";
import { getAuthUser, updateProfile } from "../store/auth";
import {
  actions,
  RichEditor,
  RichToolbar,
  SelectionChangeListener,
} from "react-native-pell-rich-editor";
import { Summary } from "../types";

export default function ProfileScreen(props: any) {
  const { navigation } = props;
  const usernameRef = useRef<any | undefined>();
  const emailRef = useRef<any | undefined>();
  const passwordRef = useRef<any | undefined>();
  const confirmPasswordRef = useRef<any | undefined>();
  const profileRef = useRef<any | undefined>();

  const [profileData, setProfileData] = useState<any | undefined>();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [insertLinkModalVisible, setInsertLinkModalVisible] = useState(false);
  const [insertLinkHref, setInsertLinkHref] = useState<string | undefined>();
  const [insertLinkText, setInsertLinkText] = useState<string | undefined>();

  useEffect(() => {
    getAuthUser()
      .then((data) => {
        setProfileData({
          ...data,
          password: "",
          confirmPassword: "",
        });
      })
      .catch((err) => {
        console.error("error! ", err);
      });
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    getAuthUser().then((data) => {
      setRefreshing(false);
      setProfileData(data);
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          type={"clear"}
          icon={
            <Icon
              name="chevron-left"
              size={15}
              color="black"
              style={{ marginRight: 5 }}
            />
          }
          onPress={() => navigation.goBack()}
          containerStyle={{ justifyContent: "center", alignItems: "center" }}
        />
      ),
    });
  }, [navigation]);

  const handleSave = async (fieldName: string) => {
    switch (fieldName) {
      case "username":
        setLoading(true);
        await updateProfile({ username: profileData.username });
        setLoading(false);
        break;
      case "password":
      // if (!profileData.confirmPassword) {
      //   Alert.alert("Confirm Password is required.");
      //   confirmPasswordRef.current.focus();
      //   return;
      // }
      case "confirmPassword":
        if (profileData.password && profileData.confirmPassword) {
          if (profileData.password !== profileData.confirmPassword) {
            Alert.alert("Please make sure your passwords match.");
            setProfileData({ ...profileData, confirmPassword: "" });
            confirmPasswordRef.current.focus();
            return;
          }
          setLoading(true);
          await updateProfile({ password: profileData.password });
          setProfileData({ ...profileData, password: "", confirmPassword: "" });
          setLoading(false);
        }
        break;
      case "avatar_uri":
        setLoading(true);
        await updateProfile({ avatar_uri: profileData.avatar_uri });
        setLoading(false);
        break;
      case "profile":
        setLoading(true);
        await updateProfile({ profile: profileData.profile });
        setLoading(false);
      default:
    }
  };

  const getNewsItemStyle = useCallback((item: Summary) => {
    const baseStyle = { flex: 1, width: "100%" };
    if (item.is_draft) {
      return {
        ...baseStyle,
        borderWidth: 1,
        borderStyle: "dashed" as const,
        backgroundColor: "#ccc",
      };
    }
    return baseStyle;
  }, []);

  const renderNewsItem = ({ item }: any) => (
    <ListItem
      bottomDivider
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      style={getNewsItemStyle(item)}
      onPress={() => {
        // TODO: doesn't work
        navigation.navigate("NewsView", { data: item });
      }}
    >
      <Avatar
        // title={item?.title[0] ?? ""}
        // titleStyle={{ color: "black" }}
        source={item?.avatar_uri && { uri: item.avatar_uri }}
        // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
      />
      <ListItem.Content>
        <ListItem.Title>{item?.title}</ListItem.Title>
      </ListItem.Content>
      <Avatar
        // title={item?.title[0] ?? ""}
        // titleStyle={{ color: "black" }}
        source={item?.logo_uri && { uri: item.logo_uri }}
        // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
      />
    </ListItem>
  );

  const renderFollowerItem = ({ item }: any) => (
    <ListItem
      bottomDivider
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      style={{ flex: 1, width: "100%" }}
      onPress={() => {
        // TODO: doesn't work
        // navigation.navigate("NewsView", { data: item });
      }}
    >
      <ListItem.Content>
        <ListItem.Title>{item?.username}</ListItem.Title>
      </ListItem.Content>
      <Avatar
        // title={item && item.username ? item.username[0] : ""}
        source={item.avatar_uri && { uri: item.avatar_uri }}
        // titleStyle={{ color: "black" }}
        // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
      />
    </ListItem>
  );

  useEffect(() => {
    if (profileData?.avatar_uri) {
      handleSave("avatar_uri");
    }
  }, [profileData?.avatar_uri]);

  const handlePickPicture = useCallback(() => {
    if (ImagePicker?.openPicker) {
      ImagePicker.openPicker({
        width: 200,
        height: 200,
        cropping: true,
        mediaType: "photo",
      }).then(async (image) => {
        if (image.path) {
          const base64 = await RNFS.readFile(image.path, "base64");
          setProfileData({
            ...profileData,
            avatar_uri: `data:image/png;base64,${base64}`,
          });
        }
      });
    }
  }, [ImagePicker?.openPicker]);

  const hideInsertLinkModal = useCallback(() => {
    setInsertLinkHref(undefined);
    setInsertLinkText(undefined);
    setInsertLinkModalVisible(false);
  }, []);

  const doInsertLink = useCallback(() => {
    if (profileRef.current && insertLinkHref && insertLinkText) {
      const { profile } = profileData;
      const link = `<a href="${insertLinkHref}">${insertLinkText}</a>`;
      // TODO: insert link where their cursor is/where text is selected
      profileRef.current.setContentHTML(`${profile}\n${link}`);
      hideInsertLinkModal();
    }
  }, [insertLinkHref, insertLinkText]);

  return (
    <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity onPress={handlePickPicture}>
          <Avatar
            size={180}
            source={{ uri: profileData?.avatar_uri }}
            avatarStyle={{
              borderWidth: 2,
              borderColor: "black",
            }}
          />
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={commonStyle.pageContainer}>
          <Tab
            value={tabIndex}
            onChange={setTabIndex}
            indicatorStyle={{ backgroundColor: "green" }}
            disableIndicator={loading}
          >
            <Tab.Item
              title="Info"
              titleStyle={{ color: "black", fontSize: 12 }}
            />
            <Tab.Item
              title="Articles"
              titleStyle={{ color: "black", fontSize: 12 }}
            />
            <Tab.Item
              title="Followers"
              titleStyle={{ color: "black", fontSize: 12 }}
            />
          </Tab>
          {/* @ts-expect-error TODO: TabView can't have children??? */}
          <TabView value={tabIndex} onChange={setTabIndex}>
            <TabView.Item style={{ width: "100%" }}>
              <ScrollView style={{ flex: 1, padding: 10 }}>
                <Input
                  ref={emailRef}
                  label="Email Address"
                  placeholder="Email Address"
                  leftIcon={<Icon name="envelope" size={24} color="black" />}
                  value={profileData?.email}
                  editable={!loading}
                  onChangeText={(text: string) => {
                    setProfileData({ ...profileData, email: text });
                  }}
                  onBlur={() => handleSave("email")}
                  autoCompleteType={undefined}
                  autoCapitalize="none"
                />
                <Input
                  ref={usernameRef}
                  label="User Name"
                  placeholder="User Name"
                  leftIcon={<Icon name="user" size={24} color="black" />}
                  editable={!loading}
                  value={profileData?.username}
                  onChangeText={(text: string) => {
                    setProfileData({ ...profileData, username: text });
                  }}
                  onBlur={() => handleSave("username")}
                  autoCompleteType={undefined}
                  autoCapitalize="none"
                />
                <Input
                  ref={passwordRef}
                  label="New Password"
                  placeholder="Password"
                  leftIcon={<Icon name="lock" size={24} color="black" />}
                  editable={!loading}
                  value={profileData?.password || ""}
                  onChangeText={(text: string) => {
                    setProfileData({ ...profileData, password: text });
                  }}
                  onBlur={() => handleSave("password")}
                  secureTextEntry={true}
                  autoCompleteType={undefined}
                  autoCapitalize="none"
                  autoComplete="off"
                />
                <Input
                  ref={confirmPasswordRef}
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  leftIcon={<Icon name="lock" size={24} color="black" />}
                  editable={!loading}
                  value={profileData?.confirmPassword || ""}
                  onChangeText={(text: string) => {
                    setProfileData({ ...profileData, confirmPassword: text });
                  }}
                  onBlur={() => handleSave("confirmPassword")}
                  secureTextEntry={true}
                  autoCompleteType={undefined}
                  autoCapitalize="none"
                  autoComplete="off"
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    paddingLeft: 12,
                    color: "#888",
                    fontSize: 16,
                  }}
                >
                  Your Profile
                </Text>
                <RichToolbar
                  editor={profileRef}
                  actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.insertLink,
                  ]}
                  onInsertLink={() => {
                    setInsertLinkModalVisible(true);
                  }}
                />
                <RichEditor
                  ref={profileRef}
                  placeholder="Your Profile"
                  initialContentHTML={profileData?.profile}
                  initialHeight={250}
                  onChange={(text: string) => {
                    setProfileData({ ...profileData, profile: text });
                  }}
                />
                <Button
                  title="Save Profile"
                  onPress={() => handleSave("profile")}
                />
                <Overlay
                  isVisible={insertLinkModalVisible}
                  onBackdropPress={() => {
                    hideInsertLinkModal();
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
                      <Text style={{ fontSize: 20 }}>Insert Link</Text>
                      <Input
                        label="URL"
                        value={insertLinkHref}
                        onChangeText={(text: string) => {
                          setInsertLinkHref(text);
                        }}
                        autoCompleteType={undefined}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <Input
                        label="Text"
                        value={insertLinkText}
                        onChangeText={(text: string) => {
                          setInsertLinkText(text);
                        }}
                        autoCompleteType={undefined}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <Button title="Insert" onPress={doInsertLink} />
                    </View>
                  </SafeAreaView>
                </Overlay>
              </ScrollView>
            </TabView.Item>
            <TabView.Item style={{ width: "100%" }}>
              <FlatList
                data={profileData?.summaries ?? {}}
                renderItem={renderNewsItem}
                style={{ flex: 1, width: "100%" }}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            </TabView.Item>
            <TabView.Item style={{ width: "100%" }}>
              <FlatList
                data={profileData?.followers ?? {}}
                renderItem={renderFollowerItem}
                style={{ flex: 1, width: "100%" }}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            </TabView.Item>
          </TabView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
