import React, { useEffect, useState } from "react";
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
import { ListItem, Avatar, Button, Icon } from "react-native-elements";
import BottomToolbar from "../components/BottomToolbar";
import { getProfileInformation } from "../store/auth";

export default function AuthorViewScreen(props: any) {
  const {
    route: {
      params: { data },
    },
    navigation,
  } = props;
  const [authData, setAuthData]: any = useState(null);
  const [isRefreshing, setRefreshing] = useState(false);

  const { width } = useWindowDimensions();

  const renderSummaryItem = ({ item }: any) => (
    <ListItem
      bottomDivider
      hasTVPreferredFocus={undefined}
      tvParallaxProperties={undefined}
      style={{ flex: 1, width: "100%" }}
      onPress={() => {
        navigation.navigate("AuthorNewsView", { data: item });
      }}
    >
      <Icon type="font-awesome" name="file" tvParallaxProperties={undefined} />
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
      </ListItem.Content>
      <Avatar
        // title={item.title[0]}
        // titleStyle={{ color: "black" }}
        source={item.logo_uri && { uri: item.logo_uri }}
        containerStyle={{
          /*borderColor: "green",*/ borderWidth: 1,
          padding: 3,
        }}
      />
    </ListItem>
  );

  const getAuthProfileData = (auth_id: number) => {
    setRefreshing(true);
    return getProfileInformation(auth_id).then((res) => {
      setRefreshing(false);
      setAuthData(res);
    });
  };

  useEffect(() => {
    getAuthProfileData(data.id);
  }, [data]);

  const handleRefresh = () => {
    getAuthProfileData(data.id);
  };

  if (!authData) {
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
              source={authData.avatar_uri && { uri: authData.avatar_uri }}
            />
            <Text style={{ paddingLeft: 10, fontSize: 18 }}>
              {authData.username}
            </Text>
          </View>
          {/* <Button title="Follow" buttonStyle={{ backgroundColor: "#6AA84F" }} /> */}
        </View>
        <View style={{ flexDirection: "row", padding: 10 }}>
          {authData.profile && (
            <RenderHtml
              contentWidth={width}
              source={{ html: authData.profile }}
            />
          )}
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700" }}>
            Trusted sources:{" "}
          </Text>
          <ScrollView contentContainerStyle={{ flexDirection: "row" }}>
            {authData.trusted_sources.map((source: any) => (
              <Image
                source={
                  source.logo_uri && {
                    uri: source.logo_uri,
                  }
                }
                style={{
                  width: 30,
                  height: 30,
                  // borderWidth: 2,
                  // borderColor: "#6AA84F",
                  marginHorizontal: 2,
                }}
              />
            ))}
          </ScrollView>
        </View>
        <FlatList
          data={authData.summaries}
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
