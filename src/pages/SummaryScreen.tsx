import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  useMemo,
} from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableWithoutFeedback,
  View,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Input, CheckBox, Button, Avatar, Icon } from "react-native-elements";

// @ts-expect-error no @types for react-native-html-parser
import { DOMParser } from "react-native-html-parser";

import commonStyle from "../styles/CommonStyle";
import {
  createSource,
  getNewsById,
  getSource,
  createSummary,
  sendNotification,
  updateSummary,
} from "../store/news";
import { Source } from "../types";
import { instance } from "../store/api";
import useCurrentUserContext from "../hooks/useCurrentUserContext";
import VoiceInput from "../components/VoiceInput";

interface Props {
  route: {
    params: {
      data: any;
    };
  };
  navigation: any;
  currentSummaryId?: number;
}

// note: [^] is the same as ., but also includes newlines
const titleRegex = RegExp("<head.*>[^]*<title.*>([^]+)</title>[^]*</head>");

export default function SummaryScreen(props: Props) {
  const {
    route: {
      params: { data },
    },
    navigation,
    currentSummaryId,
  } = props;

  const [cleanedUrl, setCleanedUrl] = useState<string | undefined>();
  const [source, setSource] = useState<Source | undefined>();
  const titleInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string | undefined>();
  const [snippets, setSnippets] = useState<any[]>([]);
  const [newSnippet, setNewSnippet] = useState<any | undefined>();
  const [defaultTitle, setDefaultTitle] = useState<string | undefined>();
  const [useDefaultTitle, setUseDefaultTitle] = useState(false);

  const currentUser = useCurrentUserContext();

  useEffect(() => {
    if (currentSummaryId) {
      getNewsById(currentSummaryId).then((summary) => {
        setTitle(summary.title);
        setSnippets(summary.snippets);
        setCleanedUrl(summary.url);
      });
    }
  }, [currentSummaryId]);

  const urlRegex = useMemo(() => RegExp(/https?:\/\S+/), []);

  const baseUrlRegex = useMemo(
    () => RegExp("https?://([a-zA-Z0-9]+\\.[a-z]+)\\/.*"),
    []
  );

  const subdomainRegex = useMemo(
    () => RegExp("https?://.*\\.([a-zA-Z0-9]+\\.[a-z]+)\\/.*"),
    []
  );

  const parseBaseUrl = useCallback(
    (fullUrl: string) => {
      const match1 = fullUrl.match(baseUrlRegex);
      const match2 = fullUrl.match(subdomainRegex);
      if (match2) {
        return match2[1];
      }
      return match1 ? match1[1] : undefined;
    },
    [baseUrlRegex]
  );

  const cleanUrl = useCallback((url?: string) => {
    if (url) {
      const qPosition = url.indexOf("?"),
        justUrl = url.substring(0, qPosition > -1 ? qPosition : url.length);
      return justUrl;
    }
  }, []);

  const processSharedUrl = async (url: string) => {
    setLoading(true);
    setCleanedUrl(cleanUrl(url));
    const baseUrl = parseBaseUrl(url);
    setTimeout(async () => {
      await instance
        .get<string>(url, {
          headers: { "Content-Type": "text/html" },
        })
        .then((result) => {
          const html = result.data;

          const dom = new DOMParser().parseFromString(html, "text/html");
          const titlesCollection = dom.getElementsByTagName("title");

          if (titlesCollection[0]) {
            const title = titlesCollection[0].firstChild;
            setDefaultTitle(title.nodeValue.trim());
          }
        });
    }, 100);
    await getSource(baseUrl).then((data) => {
      if (data) {
        setSource(data);
      } else {
        return createSource(baseUrl).then((newSource) => {
          setSource(newSource);
        });
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    if (data.weblink) {
      processSharedUrl(data.weblink);
    } else if (data.text) {
      if (currentSummaryId) {
        setNewSnippet({ value: data.text });
      } else {
        // Google News returns the url in the text object, not weblink
        // TODO: extract this into a Google News plugin
        const match = data.text.match(urlRegex);
        if (match) {
          processSharedUrl(match[0]);
        }
      }
    }
  }, [data.text, data.weblink]);

  const cleanup = useCallback(() => {
    setSource(undefined);
    setCleanedUrl(undefined);
    setDefaultTitle(undefined);
    setUseDefaultTitle(false);
    setTitle(undefined);
    delete data.weblink;
    delete data.text;
  }, []);

  const submitShare = useCallback(async () => {
    if (currentUser && title) {
      setLoading(true);
      const summary = {
        url: cleanedUrl,
        title,
        user_id: currentUser.id,
        source_id: source?.id,
      };
      const result = await createSummary(summary);
      if (
        instance.defaults.baseURL &&
        !instance.defaults.baseURL.includes("localhost")
      ) {
        await sendNotification({
          notification_title: `A new summary was created by ${currentUser.username}!`,
          summary_title: summary.title,
          summary_id: result.id,
        });
      }
      cleanup();
      setLoading(false);
      navigation.navigate("Home");
    } else {
      Alert.alert("Please specify a title for your summary");
    }
  }, [currentUser, cleanup, title]);

  const submitUpdate = useCallback(async () => {
    const updateBlock = {
      snippets: [newSnippet],
    };

    try {
      await updateSummary(currentSummaryId, updateBlock);
      if (
        instance.defaults.baseURL &&
        !instance.defaults.baseURL.includes("localhost")
      ) {
        await sendNotification({
          notification_title: `A summary was updated${
            currentUser?.username ? ` by ${currentUser.username}` : ""
          }!`,
          summary_title: title,
          summary_id: currentSummaryId,
        });
      }
      cleanup();
    } catch (err) {
      alert(`Error! ${err}`);
    }

    cleanup();
    navigation.navigate("Home");
  }, [currentSummaryId, newSnippet, currentUser, title]);

  const handleCancel = () => {
    Alert.alert(
      "Are you sure?",
      "Are you sure you want to cancel?",
      [
        {
          text: "Yes",
          onPress: () => {
            cleanup();
            navigation.navigate("Home");
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  useEffect(() => {
    if (useDefaultTitle && defaultTitle) {
      setTitle(defaultTitle);
    }
  }, [useDefaultTitle]);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        width: "100%",
        alignItems: "center",
        backgroundColor: "white",
      }}
      behavior="padding"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={commonStyle.pageContainer}>
          <View style={{ flex: 1, padding: 10, marginBottom: 30 }}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: "800",
                marginTop: 50,
                marginBottom: 30,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              <Avatar source={{ uri: "icon.png" }} />
              INSPECT
            </Text>
            <Text style={{ color: "blue", marginBottom: 10 }}>
              {cleanedUrl}
            </Text>

            <View style={{ flex: 1 }}>
              {!loading && (
                <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                  {defaultTitle}
                </Text>
              )}
              <VoiceInput resultCallback={(text: string) => setTitle(text)} />
              <Input
                ref={titleInputRef}
                label="New Title"
                placeholder="New title that explains the factual contribution"
                value={title}
                editable={!currentSummaryId}
                onChangeText={(text: string) => {
                  if (text !== defaultTitle) {
                    setUseDefaultTitle(false);
                  }
                  setTitle(text);
                }}
                autoCompleteType={undefined}
                multiline={true}
              />
              {title && title.length > 50 && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    margin: 5,
                    padding: 5,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    maxHeight: 70,
                  }}
                >
                  <Icon
                    name="exclamation-triangle"
                    type="font-awesome-5"
                    color="orange"
                    size={16}
                    tvParallaxProperties={undefined}
                  />
                  <Text style={{ color: "orange", textAlign: "center" }}>
                    Length is greater than 50 {"\n"}
                    So it may not show up correctly on Facebook
                  </Text>
                </View>
              )}
              {!currentSummaryId && defaultTitle && (
                <CheckBox
                  title="Use existing title?"
                  checked={useDefaultTitle}
                  onPress={() => setUseDefaultTitle(!useDefaultTitle)}
                />
              )}
              {currentSummaryId && (
                <>
                  <ScrollView>
                    {snippets.map((snippet) => (
                      <Text
                        key={`snippet #${snippet.id}`}
                        style={{
                          opacity: 0.5,
                        }}
                      >
                        {snippet.value}
                      </Text>
                    ))}
                    <View
                      key="new snippet"
                      style={{
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: "black",
                        borderStyle: "dashed",
                        backgroundColor: "#ccc",
                        padding: 10,
                      }}
                    >
                      <Text>{newSnippet?.value}</Text>
                    </View>
                    {newSnippet?.value.length > 1000 && (
                      <Text style={{ color: "red" }}>
                        WARNING: your selection is greater than the max length
                        (1000), so updating may not work
                      </Text>
                    )}
                  </ScrollView>
                </>
              )}
              {currentSummaryId && (
                <Button title="Update Summary" onPress={submitUpdate} />
              )}
              {!currentSummaryId && (
                <Button
                  disabled={!(currentUser && title)}
                  title="Create Summary"
                  onPress={submitShare}
                />
              )}
              <Button
                containerStyle={{ backgroundColor: "#FF6600" }}
                title="Cancel"
                onPress={handleCancel}
              />
            </View>
            {loading && <ActivityIndicator />}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
