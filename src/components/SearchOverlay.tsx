import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Overlay, SearchBar } from "react-native-elements";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { Summary, User } from "../types";
import VoiceInput from "./VoiceInput";

interface Props {
  toggleOverlay: () => void;
  visible: boolean;
  searchFunction: (keyword: string) => Promise<any[]>;
  renderItem: (item: any) => JSX.Element;
}

const SearchOverlay = ({
  toggleOverlay,
  visible,
  searchFunction,
  renderItem,
}: Props) => {
  const [keyword, setKeyword] = useState("");
  const [timeoutObject, setTimeoutObject] = useState<
    NodeJS.Timeout | undefined
  >();
  const [searchResults, setSearchResults] = useState<
    (Summary | User)[] | undefined
  >();

  const updateSearch = useCallback(
    (word: string) => {
      setSearchResults(undefined);
      setKeyword(word);
      timeoutObject && clearTimeout(timeoutObject);
      const timeout = setTimeout(() => {
        searchFunction(word).then((data) => {
          setSearchResults(data);
        });
      }, 300);
      setTimeoutObject(timeout);
    },
    [timeoutObject]
  );

  return (
    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
      <SafeAreaView style={{ marginTop: 10, height: "100%" }}>
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            Search
          </Text>
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={() => toggleOverlay()}
          >
            <MaterialIcon name="close" color={"black"} size={24} />
          </TouchableOpacity>
        </View>
        <VoiceInput resultCallback={(text: string) => updateSearch(text)} />
        <SearchBar
          placeholder="Type Here..."
          // @ts-expect-error because the onChangeText types are ridiculous
          onChangeText={(item) => updateSearch(item)}
          value={keyword}
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
        {!!keyword && searchResults && searchResults.length > 0 && (
          <>
            <Text>Results:</Text>
            <FlatList
              data={searchResults}
              renderItem={renderItem}
              style={{ flex: 1, marginTop: 5 }}
            />
          </>
        )}
      </SafeAreaView>
    </Overlay>
  );
};

export default SearchOverlay;
