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
  RefreshControl,
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
  SearchBar,
  CheckBox,
} from "react-native-elements";
import { deleteAccount, getAuthUser, updateProfile } from "../store/auth";
import {
  actions,
  RichEditor,
  RichToolbar,
  SelectionChangeListener,
} from "react-native-pell-rich-editor";
import { AuthUser, Summary, User } from "../types";
import { searchUsers, unfollowAuthor } from "../store/news";
import useCurrentUserContext from "../hooks/useCurrentUserContext";
import SearchOverlay from "../components/SearchOverlay";
import UserListItem from "../components/UserListItem";
import NewsRow from "../components/NewsRow";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  navigation: any;
  setCurrentUser: (user: User) => void;
}

export default function ProfileScreen(props: Props) {
  const { navigation, setCurrentUser } = props;
  const usernameRef = useRef<any | undefined>();
  const emailRef = useRef<any | undefined>();
  const passwordRef = useRef<any | undefined>();
  const confirmPasswordRef = useRef<any | undefined>();
  const profileRef = useRef<any | undefined>();

  const [currentProfileData, setCurrentProfileData] = useState<
    AuthUser | undefined
  >();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [insertLinkModalVisible, setInsertLinkModalVisible] = useState(false);
  const [insertLinkHref, setInsertLinkHref] = useState<string | undefined>();
  const [insertLinkText, setInsertLinkText] = useState<string | undefined>();
  const [articleSearch, setArticleSearch] = useState<string>("");
  const [currentSummaries, setCurrentSummaries] = useState<
    Summary[] | undefined
  >();
  const [authorSearch, setAuthorSearch] = useState<string>("");
  const [currentFollowingAuthors, setCurrentFollowingAuthors] = useState<
    any[] | undefined
  >();
  const [profileOverlayVisible, setProfileOverlayVisible] = useState(false);
  const [profileEditorDisabled, setProfileEditorDisabled] = useState(true);
  const [searchOverlayVisible, setSearchOverlayVisible] = useState(false);

  const currentUser = useCurrentUserContext();

  useEffect(() => {
    if (currentUser) {
      setCurrentProfileData({
        ...currentUser,
        password: "",
        confirmPassword: "",
      });
      setCurrentSummaries(currentUser.summaries);
      setCurrentFollowingAuthors(currentUser.following);
    }
  }, [currentUser]);

  useEffect(() => {
    navigation.addListener("focus", () => handleRefresh());
  }, [navigation]);

  const handleRefresh = () => {
    setRefreshing(true);
    getAuthUser()
      .then((response) => {
        if (response.data) {
          const user = response.data as AuthUser;
          setCurrentUser(user);
          setCurrentProfileData({
            ...user,
            password: "",
            confirmPassword: "",
          });
          setCurrentSummaries(user.summaries);
          setCurrentFollowingAuthors(user.following);
        } else {
          throw new Error("No auth user returned");
        }
      })
      .catch((err) => {
        alert(`Error! ${err.toString()}`);
      })
      .finally(() => setRefreshing(false));
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

  const handleSave = async () => {
    if (currentUser && currentProfileData) {
      setLoading(true);
      const updateBlock = {
        email:
          currentProfileData.email === currentUser.email
            ? undefined
            : currentProfileData.email, // only send email if it changed
        username:
          currentProfileData.username === currentUser.username
            ? undefined
            : currentProfileData.username,
        avatar_uri:
          currentProfileData.avatar_uri === currentUser.avatar_uri
            ? undefined
            : currentProfileData.avatar_uri,
        enable_push_notifications:
          currentProfileData.enable_push_notifications ===
          currentUser.enable_push_notifications
            ? undefined
            : currentProfileData.enable_push_notifications,
        enable_email_notifications:
          currentProfileData.enable_email_notifications ===
          currentUser.enable_email_notifications
            ? undefined
            : currentProfileData.enable_email_notifications,
      } as any;
      if (currentProfileData.password && currentProfileData.confirmPassword) {
        if (
          currentProfileData.password !== currentProfileData.confirmPassword
        ) {
          Alert.alert("Please make sure your passwords match.");
          setCurrentProfileData({ ...currentProfileData, confirmPassword: "" });
          confirmPasswordRef.current.focus();
          return;
        }
        updateBlock.password =
          currentProfileData.password === currentUser.password
            ? undefined
            : currentProfileData.password; // only send password if it changed
      }
      if (Object.keys(updateBlock).length > 0) {
        await updateProfile(updateBlock);
        setCurrentProfileData({
          ...currentProfileData,
          password: "",
          confirmPassword: "",
        });
      }
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    if (currentProfileData) {
      setLoading(true);
      const updateBlock = {
        profile: currentProfileData.profile,
      };
      await updateProfile(updateBlock);
      setProfileOverlayVisible(false);
      setLoading(false);
    }
  };

  const renderNewsItem = ({ item }: any) => (
    <NewsRow
      item={item}
      onPress={() => {
        navigation.navigate("NewsView", { data: { id: item.id } });
      }}
    />
  );

  const handleUnfollow = (user_id: number) => {
    unfollowAuthor(user_id).then(() => {
      handleRefresh();
    });
  };

  const renderFollowingUser = ({ item }: any) => (
    <ListItem
      bottomDivider
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      style={{ flex: 1, width: "100%" }}
      onPress={() => {
        navigation.navigate("AuthorView", { data: { id: item.user_id } });
      }}
    >
      <Avatar
        // title={item && item.username ? item.username[0] : ""}
        source={item.avatar_uri && { uri: item.avatar_uri }}
        // titleStyle={{ color: "black" }}
        // containerStyle={{ borderColor: "green", borderWidth: 1, padding: 3 }}
      />
      <ListItem.Content>
        <ListItem.Title>{item?.username}</ListItem.Title>
      </ListItem.Content>
      <Button
        title="Unfollow"
        buttonStyle={{ backgroundColor: "#6AA84F" }}
        onPress={() => handleUnfollow(item.user_id)}
      />
    </ListItem>
  );

  useEffect(() => {
    if (currentProfileData?.avatar_uri) {
      handleSave();
    }
  }, [currentProfileData?.avatar_uri]);

  const handlePickPicture = useCallback(() => {
    if (currentProfileData && ImagePicker?.openPicker) {
      ImagePicker.openPicker({
        width: 200,
        height: 200,
        cropping: true,
        mediaType: "photo",
      }).then(async (image) => {
        if (image.path) {
          const base64 = await RNFS.readFile(image.path, "base64");
          setCurrentProfileData({
            ...currentProfileData,
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
    if (
      currentProfileData &&
      profileRef.current &&
      insertLinkHref &&
      insertLinkText
    ) {
      const { profile } = currentProfileData;
      const link = `<a href="${insertLinkHref}">${insertLinkText}</a>`;
      // TODO: insert link where their cursor is/where text is selected
      profileRef.current.setContentHTML(`${profile}\n${link}`);
      hideInsertLinkModal();
    }
  }, [insertLinkHref, insertLinkText]);

  useEffect(() => {
    if (currentProfileData && articleSearch) {
      setCurrentSummaries(
        currentProfileData.summaries?.filter((summary: Summary) =>
          summary.title
            .toLocaleLowerCase()
            .includes(articleSearch.toLocaleLowerCase())
        )
      );
    }
  }, [currentProfileData, articleSearch]);

  useEffect(() => {
    if (currentProfileData && authorSearch) {
      const newAuthors = currentProfileData.following?.filter((user: any) =>
        user.username
          .toLocaleLowerCase()
          .includes(authorSearch.toLocaleLowerCase())
      );
      setCurrentFollowingAuthors(newAuthors);
    }
  }, [authorSearch]);

  const toggleSearchOverlay = () => {
    setSearchOverlayVisible(!searchOverlayVisible);
  };

  const confirmDelete = () => {
    if (currentUser) {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to Delete your account?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              setLoading(true);
              await deleteAccount(currentUser.id);
              await AsyncStorage.clear();
              setLoading(false);
              props.navigation.navigate("Login");
            },
          },
        ],
        {
          cancelable: true,
        }
      );
    }
  };

  return (
    <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
      <View style={{ alignItems: "center", padding: 10 }}>
        <TouchableOpacity onPress={handlePickPicture}>
          <Avatar
            size={180}
            source={{ uri: currentProfileData?.avatar_uri }}
            avatarStyle={{
              borderWidth: 2,
              borderColor: "black",
            }}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <Button
            title="Update Profile"
            onPress={() => setProfileOverlayVisible(true)}
            style={{ margin: 10 }}
          />
          <Button
            title="Delete Account"
            onPress={confirmDelete}
            style={{ margin: 10 }}
            buttonStyle={{ backgroundColor: "red" }}
          />
        </View>
        {currentProfileData && (
          <Overlay
            isVisible={profileOverlayVisible}
            onBackdropPress={() => setProfileOverlayVisible(false)}
            overlayStyle={{ width: "100%" }}
          >
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
              initialContentHTML={currentProfileData?.profile}
              initialHeight={250}
              disabled={profileEditorDisabled}
              style={{
                backgroundColor: profileEditorDisabled ? "#ccc" : "white",
              }}
              editorInitializedCallback={() => setProfileEditorDisabled(false)}
              onChange={(text: string) => {
                setCurrentProfileData({ ...currentProfileData, profile: text });
              }}
            />
            <Button title="Save" onPress={() => handleProfileSave()} />
          </Overlay>
        )}
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
              title="Settings"
              titleStyle={{ color: "black", fontSize: 12 }}
            />
            <Tab.Item
              title="Summaries"
              titleStyle={{ color: "black", fontSize: 12 }}
            />
            <Tab.Item
              title="Following"
              titleStyle={{ color: "black", fontSize: 12 }}
            />
          </Tab>
          {/* @ts-expect-error TODO: TabView can't have children??? */}
          <TabView value={tabIndex} onChange={setTabIndex} style={{ flex: 1 }}>
            <TabView.Item style={{ flex: 1, width: "100%" }}>
              <ScrollView
                style={{ flex: 1, padding: 10 }}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={handleRefresh}
                  />
                }
              >
                <Input
                  ref={emailRef}
                  label="Email Address"
                  placeholder="Email Address"
                  leftIcon={<Icon name="envelope" size={24} color="black" />}
                  value={currentProfileData?.email}
                  editable={!loading}
                  onChangeText={(text: string) => {
                    if (currentProfileData) {
                      setCurrentProfileData({
                        ...currentProfileData,
                        email: text,
                      });
                    }
                  }}
                  autoCompleteType={undefined}
                  autoCapitalize="none"
                />
                <Input
                  ref={usernameRef}
                  label="Your Name"
                  placeholder="Your Name"
                  leftIcon={<Icon name="user" size={24} color="black" />}
                  editable={!loading}
                  value={currentProfileData?.username}
                  onChangeText={(text: string) => {
                    if (currentProfileData) {
                      setCurrentProfileData({
                        ...currentProfileData,
                        username: text,
                      });
                    }
                  }}
                  autoCompleteType={undefined}
                  autoCapitalize="none"
                />
                <Input
                  ref={passwordRef}
                  label="New Password"
                  placeholder="Password"
                  leftIcon={<Icon name="lock" size={24} color="black" />}
                  editable={!loading}
                  value={currentProfileData?.password ?? ""}
                  onChangeText={(text: string) => {
                    if (currentProfileData) {
                      setCurrentProfileData({
                        ...currentProfileData,
                        password: text,
                      });
                    }
                  }}
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
                  value={currentProfileData?.confirmPassword ?? ""}
                  onChangeText={(text: string) => {
                    if (currentProfileData) {
                      setCurrentProfileData({
                        ...currentProfileData,
                        confirmPassword: text,
                      });
                    }
                  }}
                  secureTextEntry={true}
                  autoCompleteType={undefined}
                  autoCapitalize="none"
                  autoComplete="off"
                />
                <CheckBox
                  title="Enable push notifications"
                  checked={currentProfileData?.enable_push_notifications}
                  onPress={() => {
                    if (currentProfileData) {
                      setCurrentProfileData({
                        ...currentProfileData,
                        enable_push_notifications:
                          !currentProfileData.enable_push_notifications,
                      });
                    }
                  }}
                />
                <CheckBox
                  title="Enable email notifications"
                  checked={currentProfileData?.enable_email_notifications}
                  onPress={() => {
                    if (currentProfileData) {
                      setCurrentProfileData({
                        ...currentProfileData,
                        enable_email_notifications:
                          !currentProfileData.enable_email_notifications,
                      });
                    }
                  }}
                />
                <Button title="Save" onPress={() => handleSave()} />
              </ScrollView>
            </TabView.Item>
            <TabView.Item
              style={{ width: "100%" }}
              // @ts-expect-error typing this correctly/removing it breaks scrolling
              onMoveShouldSetResponder={(e) => e.stopPropagation()}
            >
              <View style={{ flex: 1 }}>
                {currentProfileData?.summaries &&
                  currentProfileData.summaries.length > 0 && (
                    <>
                      <SearchBar
                        placeholder="Filter on your summaries..."
                        // @ts-expect-error wtf is this complaining? it's working
                        onChangeText={(text: string) => setArticleSearch(text)}
                        value={articleSearch}
                        showCancel={false}
                        lightTheme={false}
                        round={false}
                        onBlur={() => {}}
                        onFocus={() => {}}
                        platform={"ios"}
                        onClear={() => {}}
                        loadingProps={{}}
                        autoCompleteType={undefined}
                        clearIcon={{ name: "close" }}
                        searchIcon={{ name: "search" }}
                        showLoading={false}
                        onCancel={() => {}}
                        cancelButtonTitle={""}
                        cancelButtonProps={{}}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                      />
                      <FlatList
                        data={currentSummaries}
                        renderItem={renderNewsItem}
                        style={{ flex: 1, width: "100%" }}
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                      />
                    </>
                  )}
                {!currentProfileData?.summaries ||
                  (currentProfileData.summaries.length === 0 && (
                    <Text>
                      You have no article summaries. To create one, view the
                      article in another app like Safari, Apple News, or Google
                      News, and share it into Inspect, OR enter the URL on the
                      Create Summary screen accessible by tapping the + icon.
                    </Text>
                  ))}
              </View>
            </TabView.Item>
            <TabView.Item
              style={{ width: "100%" }}
              // @ts-expect-error typing this correctly/removing it breaks scrolling
              onMoveShouldSetResponder={(e) => e.stopPropagation()}
            >
              <>
                <Button onPress={toggleSearchOverlay} title="Search Authors" />
                <SearchBar
                  placeholder="Filter on authors you follow..."
                  // @ts-expect-error wtf is this complaining? it's working
                  onChangeText={(text: string) => setAuthorSearch(text)}
                  value={authorSearch}
                  showCancel={false}
                  lightTheme={false}
                  round={false}
                  onBlur={() => {}}
                  onFocus={() => {}}
                  platform={"ios"}
                  onClear={() => {}}
                  loadingProps={{}}
                  autoCompleteType={undefined}
                  clearIcon={{ name: "close" }}
                  searchIcon={{ name: "search" }}
                  showLoading={false}
                  onCancel={() => {}}
                  cancelButtonTitle={""}
                  cancelButtonProps={{}}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                />
                <FlatList
                  data={currentFollowingAuthors ?? []}
                  renderItem={renderFollowingUser}
                  style={{ flex: 1, width: "100%" }}
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                />
              </>
            </TabView.Item>
          </TabView>
        </View>
      </TouchableWithoutFeedback>
      <SearchOverlay
        toggleOverlay={toggleSearchOverlay}
        visible={searchOverlayVisible}
        searchFunction={(keyword: string) => searchUsers(keyword)}
        renderItem={({ item }: any) => (
          <UserListItem
            item={item}
            onPress={(item) => {
              setSearchOverlayVisible(false);
              navigation.navigate("AuthorView", { data: item });
            }}
          />
        )}
      />
    </KeyboardAvoidingView>
  );
}
