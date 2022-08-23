import React, { useEffect, useState, useRef } from "react";

import commonStyle from "../styles/CommonStyle";
import {
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  TouchableWithoutFeedback,
  View,
  FlatList,
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

export default function AboutScreen(props: any) {
  const { navigation } = props;
  const usernameRef: any = useRef(null);
  const emailRef: any = useRef(null);
  const passwordRef: any = useRef(null);
  const confirmPasswordRef: any = useRef(null);
  // const [profileData, setProfileData] = useState<any | undefined>();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);

  // useEffect(() => {
  //     getAuthUser().then(data => {
  //         setProfileData(data);
  //     });
  // }, []);

  // const handleRefresh = () => {
  //     setRefreshing(true);
  //     getAuthUser().then(data => {
  //         setRefreshing(false);
  //         setProfileData(data);
  //     });
  // }

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
        title={item.title[0]}
        titleStyle={{ color: "black" }}
        source={item.avatar_uri && { uri: item.avatar_uri }}
        containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
      />
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
      </ListItem.Content>
      <Avatar
        title={item.title[0]}
        titleStyle={{ color: "black" }}
        source={item.logo_uri && { uri: item.logo_uri }}
        containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
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
        navigation.navigate("NewsView", { data: item });
      }}
    >
      <ListItem.Content>
        <ListItem.Title>{item.username}</ListItem.Title>
      </ListItem.Content>
      <Avatar
        title={item?.username[0]}
        titleStyle={{ color: "black" }}
        containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
      />
    </ListItem>
  );

  return (
    <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={commonStyle.pageContainer}>
          <Tab
            value={tabIndex}
            onChange={setTabIndex}
            indicatorStyle={{ backgroundColor: "green" }}
            disableIndicator={loading}
          >
            <Tab.Item title="Info" titleStyle={{ color: "black" }} />
            <Tab.Item title="Articles" titleStyle={{ color: "black" }} />
            <Tab.Item title="Follow" titleStyle={{ color: "black" }} />
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
                  autoCompleteType={undefined}
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
                  autoCompleteType={undefined}
                />
                <Input
                  ref={passwordRef}
                  label="Password"
                  placeholder="Password"
                  leftIcon={<Icon name="lock" size={24} color="black" />}
                  editable={!loading}
                  value={profileData?.password || ""}
                  onChangeText={(text: string) => {
                    setProfileData({ ...profileData, password: text });
                  }}
                  autoCompleteType={undefined}
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
                  autoCompleteType={undefined}
                />
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Button
                    title="Save"
                    icon={
                      <Icon
                        name="save"
                        size={15}
                        color="white"
                        style={{ marginRight: 5 }}
                      />
                    }
                    disabled={loading}
                    buttonStyle={{ marginHorizontal: 10 }}
                    onPress={handleSave}
                  />
                  <Button
                    title="Back"
                    icon={
                      <Icon
                        name="arrow-left"
                        size={15}
                        color="white"
                        style={{ marginRight: 5 }}
                      />
                    }
                    disabled={loading}
                    buttonStyle={{
                      marginHorizontal: 10,
                      backgroundColor: "#DD4A48",
                    }}
                    onPress={() => navigation.goBack()}
                  />
                </View>
              </View>
            </TabView.Item>
            <TabView.Item style={{ width: "100%" }}>
              <FlatList
                data={profileData.summaries}
                renderItem={renderNewsItem}
                style={{ flex: 1, width: "100%" }}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            </TabView.Item>
            <TabView.Item style={{ width: "100%" }}>
              <FlatList
                data={profileData.followers}
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
