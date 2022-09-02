import React, { useCallback, useEffect, useState, useRef } from "react";

import commonStyle from "../styles/CommonStyle";
import {
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  TouchableWithoutFeedback,
  View,
  FlatList,
  TouchableOpacity,
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

export default function ProfileScreen(props: any) {
  const { navigation } = props;
  const usernameRef: any = useRef(null);
  const emailRef: any = useRef(null);
  const passwordRef: any = useRef(null);
  const confirmPasswordRef: any = useRef(null);
  const [profileData, setProfileData] = useState<any | undefined>();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);

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

  return (
    <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity>
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

      {/* <Input
                  ref={avatarRef}
                  label="Avatar"
                  placeholder="Avatar"
                  leftIcon={<Icon name="photo" size={24} color="black" />}
                  editable={!loading}
                  value={profileData?.avatar_url}
                  onChangeText={(text: string) => {
                    setProfileData({ ...profileData, avatar_url: text });
                  }}
                  autoCompleteType={undefined}
                  autoCapitalize="none"
                /> */}
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
              <View style={{ flex: 1, padding: 10 }}>
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
                  // FIXME: causes a repeating warning that messes up the UI
                  // leftIcon={<Icon name="user" size={24} color="black" />}
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
              </View>
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
