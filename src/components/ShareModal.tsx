import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Alert, Button, SafeAreaView, Text, View } from "react-native";
import { Avatar, Input, Overlay } from "react-native-elements";

import CheckBox from "expo-checkbox";

import { instance } from "../store/api";
import { getAuthUser } from "../store/auth";
import { AuthUser, Source } from "../types";
import { postSummary } from "../store/news";

interface Props {
  modalVisible: boolean;
  url?: string;
  hideOverlay: () => void;
  refreshFeed: () => void;
}

const htmlRegex = new RegExp("<head>[^]*<title>([^]+)</title>[^]*</head>");

const ShareModal = ({ modalVisible, url, hideOverlay, refreshFeed }: Props) => {
  const [cleanedUrl, setCleanedUrl] = useState<string | undefined>();
  const [source, setSource] = useState<Source | undefined>();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string | undefined>();
  const [snippets, setSnippets] = useState<string[]>([]);
  const [authUser, setAuthUser] = useState<AuthUser | undefined>();
  const [defaultTitle, setDefaultTitle] = useState<string | undefined>();
  const [useDefaultTitle, setUseDefaultTitle] = useState(false);

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
    setDefaultTitle(undefined);
    setTitle(undefined);
  }, []);

  const submitShare = useCallback(async () => {
    if (authUser && title) {
      const summary = {
        url: cleanedUrl,
        title,
        user_id: authUser.id,
        source_id: source?.id,
        snippets,
      };
      await postSummary(summary);
      cleanup();
      refreshFeed();
      hideOverlay();
    } else {
      Alert.alert("Please specify a title for your summary");
    }
  }, [authUser, hideOverlay, cleanup, title]);

  useEffect(() => {
    getAuthUser().then((user) => {
      setAuthUser(user);
    });
  }, []);

  useEffect(() => {
    if (modalVisible && url) {
      setCleanedUrl(cleanUrl(url));
      const baseUrl = parseBaseUrl(url);
      Promise.all([
        instance.get<Source>(`/sources/${baseUrl}`).then((result) => {
          if (result.data) {
            setSource(result.data);
          }
        }),
        instance.get<string>(url).then((result) => {
          const html = result.data;
          const match = html.match(htmlRegex);
          if (match && match[1]) {
            const docTitle = match[1];
            setDefaultTitle(docTitle);
          }
        }),
      ]).then(() => setLoading(false));
    }
  }, [modalVisible, url]);

  useEffect(() => {
    if (useDefaultTitle) {
      setTitle(defaultTitle);
    }
  }, [useDefaultTitle]);

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
            width: "100%",
          }}
        >
          <Text style={{ fontSize: 20 }}>Create New Summary</Text>
          {/* TODO: why `source` requires `any` instead of `string` is beyond me */}
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
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            {defaultTitle}
          </Text>
          <Text style={{ color: "blue", marginBottom: 10 }}>{cleanedUrl}</Text>
          <View style={{ width: "100%" }}>
            <Input
              ref={titleInputRef}
              label="New Title"
              placeholder="The real contribution of the article"
              value={title}
              editable={!loading}
              onChangeText={(text: string) => {
                setTitle(text);
              }}
              autoCompleteType={undefined}
            />
            <View style={{ flexDirection: "row" }}>
              <CheckBox
                value={useDefaultTitle}
                onValueChange={(value: boolean) => {
                  // FIXME: redundant?
                  setUseDefaultTitle(value);
                }}
              />
              <Text style={{ marginLeft: 5 }}>Use existing title</Text>
            </View>
          </View>
          <Button title="Create Summary" onPress={submitShare} />
        </View>
      </SafeAreaView>
    </Overlay>
  );
};

export default ShareModal;
