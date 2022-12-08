import React, { useCallback, useEffect, useMemo, useState } from "react";
import RenderHtml from "react-native-render-html";

import commonStyle from "../styles/CommonStyle";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  useWindowDimensions,
} from "react-native";
import {
  ListItem,
  Avatar,
  Button,
  Icon,
  SearchBar,
} from "react-native-elements";
import BottomToolbar from "../components/BottomToolbar";
import { getProfileInformation } from "../store/auth";
import { followAuthor, unfollowAuthor } from "../store/news";
import NewsRow from "../components/NewsRow";
import { Source, Summary } from "../types";
import useCurrentUser from "../hooks/useCurrentUser";

export default function AuthorViewScreen(props: any) {
  const {
    route: {
      params: { data },
    },
    navigation,
  } = props;
  const [userData, setUserData] = useState<any | undefined>();
  const [isRefreshing, setRefreshing] = useState(false);
  const [articleSearch, setArticleSearch] = useState<string>("");
  const [currentSummaries, setCurrentSummaries] = useState<
    Summary[] | undefined
  >();

  const { width } = useWindowDimensions();
  const { currentUser } = useCurrentUser({});

  useEffect(() => {
    if (articleSearch) {
      setCurrentSummaries(
        userData.summaries.filter((summary: Summary) =>
          summary.title
            .toLocaleLowerCase()
            .includes(articleSearch.toLocaleLowerCase())
        )
      );
    }
  }, [articleSearch]);

  const handleFollow = (user_id: number) => {
    const postData = {
      follower_id: user_id,
    };
    followAuthor(postData).then(() => {
      handleRefresh();
    });
  };

  const handleUnfollow = (user_id: number) => {
    unfollowAuthor(user_id).then(() => {
      handleRefresh();
    });
  };

  const followerIds = useMemo(() => {
    if (userData) {
      return userData.followers.map((follower: any) =>
        Number(follower.follower_id)
      );
    }
  }, [userData]);

  const renderSummaryItem = ({ item }: any) => (
    <NewsRow
      item={item}
      onPress={() => {
        navigation.navigate("NewsView", { data: item });
      }}
      onLongPress={() => {}}
      onSwipeLeft={(id: number) => {}}
    />
  );

  const getProfileData = (user_id: number) => {
    setRefreshing(true);
    return getProfileInformation(user_id).then((res) => {
      setRefreshing(false);
      setUserData(res);
      setCurrentSummaries(res.summaries);
    });
  };

  useEffect(() => {
    getProfileData(data.id);
  }, [data]);

  const handleRefresh = () => {
    getProfileData(data.id);
  };

  if (!userData) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={commonStyle.pageContainer}>
      <View style={{ flex: 1, padding: 10 }}>
        <View
          style={{ flexDirection: "row", marginTop: 20, alignItems: "center" }}
        >
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon
                type="material"
                name="chevron-left"
                tvParallaxProperties={undefined}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
            }}
          >
            <Avatar
              // title={authData.username[0]}
              // titleStyle={{ color: "black" }}
              // containerStyle={{
              //   borderColor: "green",
              //   borderWidth: 1,
              //   padding: 3,
              // }}
              source={userData.avatar_uri && { uri: userData.avatar_uri }}
            />
            <Text style={{ paddingLeft: 10, fontSize: 18 }}>
              {userData.username}
            </Text>
          </View>
          {currentUser && followerIds.includes(currentUser.id) && (
            <Button
              title="Unfollow"
              buttonStyle={{ backgroundColor: "#6AA84F" }}
              onPress={() => handleUnfollow(userData.id)}
            />
          )}
          {currentUser && !followerIds.includes(currentUser.id) && (
            <Button
              title="Follow"
              buttonStyle={{ backgroundColor: "#6AA84F" }}
              onPress={() => handleFollow(userData.id)}
            />
          )}
        </View>
        <View style={{ flexDirection: "row", padding: 10 }}>
          {userData.profile && (
            <RenderHtml
              contentWidth={width}
              source={{ html: userData.profile }}
            />
          )}
        </View>
        {userData.trusted_sources && userData.trusted_sources.length > 0 && (
          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", marginRight: 10 }}>
              Trusted sources:
            </Text>
            {userData.trusted_sources
              .filter((source: Source) => !!source.logo_uri)
              .map((source: Source) => (
                <Image
                  // title={item.title[0]}
                  // titleStyle={{ color: "black" }}
                  source={(source.logo_uri as any) && { uri: source.logo_uri }}
                  style={{
                    // borderColor: "green",
                    // borderWidth: 1,
                    // padding: 3,
                    height: 34,
                    width: 34,
                    resizeMode: "contain",
                  }}
                  key={`trusted source #${source.id}`}
                />
              ))}
          </View>
        )}
        <SearchBar
          placeholder="Filter on article summaries..."
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
          renderItem={renderSummaryItem}
          style={{ flex: 1, width: "100%" }}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      </View>
      <BottomToolbar {...props} />
    </View>
  );
}
