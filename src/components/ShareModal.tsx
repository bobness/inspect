import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { instance } from "../store/api";

import {
  Alert,
  Button,
  GestureResponderEvent,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, CheckBox, Input, Overlay } from "react-native-elements";
// import Collapsible from "react-native-collapsible";
import { getAuthUser } from "../store/auth";
import { Source } from "../types";
import { postSummary } from "../store/news";

interface Props {
  modalVisible: boolean;
  url?: string;
  hideOverlay: () => void;
  refreshFeed: () => void;
}

const ShareModal = ({ modalVisible, url, hideOverlay, refreshFeed }: Props) => {
  const [cleanedUrl, setCleanedUrl] = useState<string | undefined>();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [source, setSource] = useState<Source | undefined>();
  const [pageContents, setPageContents] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string | undefined>();
  const [snippets, setSnippets] = useState<string[]>([]);

  const titleInputRef = useRef(null);
  const urlRegex = useMemo(
    () => RegExp("https?://.*\\.([a-zA-Z0-9]+\\.[a-z]+)\\/.*"),
    []
  );

  const parseBaseUrl = useCallback(
    (fullUrl: string) => {
      const match = fullUrl.match(urlRegex);
      return match ? match[1] : undefined;
    },
    [urlRegex]
  );

  const cleanUrl = useCallback((url?: string) => {
    if (url) {
      const qPosition = url.indexOf("?"),
        justUrl = url.substring(0, qPosition > -1 ? qPosition : url.length);
      return justUrl;
    }
  }, []);

  const cleanup = useCallback(() => {
    setSource(undefined);
    setCleanedUrl(undefined);
    // TODO: setUrl(undefined)?
    // setDefaultTitle(undefined)
    setTitle(undefined);
  }, []);

  const submitShare = useCallback(async () => {
    if (title) {
      const authUser = await getAuthUser(); // TODO: memoize on first load
      const summary = {
        url: cleanedUrl,
        title,
        user_id: authUser.id,
        source_id: source?.id,
        snippets,
      };
      await postSummary(summary);
      cleanup();
      hideOverlay();
    } else {
      console.log('*** "empty" title: ', title); // DEBUG
      // FIXME: this happens when there is text for the title
      Alert.alert("Please specify a title for your summary");
    }
  }, [hideOverlay, cleanup, title]);

  useEffect(() => {
    if (modalVisible && url) {
      setCleanedUrl(cleanUrl(url));
      const baseUrl = parseBaseUrl(url);
      Promise.all([
        instance.get(`/sources/${baseUrl}`).then((res) => {
          if (res.data) {
            setSource(res.data);
          }
        }),
        // instance.get(url).then((res) => {
        //   setPageContents(res.data);
        // }),
      ]).then(() => setLoading(false));
    }
  }, [modalVisible, url]);

  // useEffect(() => {
  //   if (pageContents) {
  //     // TODO: detect title
  //    setDefaultTitle(...);
  //   }
  // }, [pageContents]);

  // useEffect(() => {
  //   if (useDefaultTitle) {
  //     setTitle(defaultTitle);
  //   }
  // }, [useDefaultTitle]);

  // TODO: use a component that gets created, destroyed, and re-created instead? (to avoid manual cleanup)
  return (
    <Overlay
      isVisible={modalVisible}
      onBackdropPress={() => {
        cleanup();
        hideOverlay();
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
          }}
        >
          <Text style={{ fontSize: 20 }}>Create New Summary</Text>
          {/* FIXME: why `source` requires `any` instead of `string` is beyond me */}
          <Avatar
            title="?"
            titleStyle={{ color: "black", fontSize: 40 }}
            source={(source?.logo_uri as any) && { uri: source?.logo_uri }}
            containerStyle={{
              borderWidth: 1,
              borderColor: "black",
              borderStyle: "solid",
              width: 100,
              height: 100,
            }}
          />
          <Input
            editable={false}
            label="url"
            value={cleanedUrl}
            style={{ fontSize: 20, fontWeight: "bold" }}
            autoCompleteType={undefined}
          >
            {url}
          </Input>
          <Input
            ref={titleInputRef}
            label="Title"
            placeholder="New title that explains the contribution of the article"
            // leftIcon={<Icon name="envelope" size={24} color="black" />}
            value={title}
            editable={!loading}
            onChangeText={(text: string) => {
              setTitle(text);
            }}
            autoCompleteType={undefined}
          />
          {/* <CheckBox value={useDefaultTitle} onValueChange={setUseDefaultTitle}> /> */}
          {/*
          TODO: wait until there's a way to do this in React Native / we find one
          <TouchableOpacity
            onPress={() => {
              setIsCollapsed(!isCollapsed);
            }}
          >
            @ts-expect-error react-native-collapsible hasn't fixed the React 18 requirement for the 'children' prop: https://github.com/oblador/react-native-collapsible/issues/436
            <Collapsible collapsed={isCollapsed}>
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Text selectTextOnFocus={null} onPressOut={(event: GestureResponderEvent) => {
                  setSnippetText(event.currentTarget.);
                }}>{pageContents}</Text>
              </View>
            </Collapsible>
          </TouchableOpacity> */}
          <Button title="Create Summary" onPress={submitShare} />
        </View>
      </SafeAreaView>
    </Overlay>
  );
};

export default ShareModal;
