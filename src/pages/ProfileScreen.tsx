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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  Input,
  Button,
  Tab,
  TabView,
  ListItem,
  Avatar,
} from "react-native-elements";
import { getAuthUser, updateProfile } from "../store/auth";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

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

  useEffect(() => {
    getAuthUser()
      .then((data) => {
        console.log("*** got profileData.profile: ", data.profile);
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

  const renderNewsItem = ({ item }: any) => (
    <ListItem
      bottomDivider
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      style={{ flex: 1, width: "100%" }}
      onPress={() => {
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
        // FIXME: go somewhere else
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
                    // actions.insertImage,
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.heading1,
                    actions.insertLink,
                  ]}
                  iconMap={{
                    [actions.heading1]: ({ tintColor }) => (
                      <Text style={[{ color: tintColor }]}>H1</Text>
                    ),
                  }}
                  onInsertLink={() => {
                    console.log("*** inserting link: ", arguments);
                    // TODO: open modal to ask for url and link text
                    // TODO: insert <a href={url}>{text}</a> into profile
                    const profile = profileData.profile;
                    const newText = '<a href="#">Test</a>';
                    setProfileData({
                      ...profileData,
                      profile: `${profile} ${newText}`,
                    });
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
                  onBlur={() => {
                    handleSave("profile");
                  }}
                />
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
