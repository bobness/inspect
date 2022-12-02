import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  useMemo,
} from "react";

import commonStyle from "../styles/CommonStyle";
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableWithoutFeedback,
  View,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { Input, CheckBox, Button } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import { getAuthUser } from "../store/auth";
import {
  createSource,
  getNewsById,
  getSource,
  postSummary,
  sendNotification,
  updateSummary,
} from "../store/news";
import { User, Source } from "../types";
import { instance } from "../store/api";

interface Props {
  route: any;
  navigation: any;
  currentSummaryId?: number;
}

const titleRegex = RegExp("<head.*>[^]*<title>([^]+)</title>[^]*</head>");

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
  const [authUser, setAuthUser] = useState<User | undefined>();
  const [snippets, setSnippets] = useState<any[]>([]);
  const [newSnippet, setNewSnippet] = useState<any | undefined>();
  const [defaultTitle, setDefaultTitle] = useState<string | undefined>();
  const [useDefaultTitle, setUseDefaultTitle] = useState(false);

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
    () => RegExp("https?://.*\\.([a-zA-Z0-9]+\\.[a-z]+)\\/.*"),
    []
  );

  const parseBaseUrl = useCallback(
    (fullUrl: string) => {
      const match = fullUrl.match(baseUrlRegex);
      return match ? match[1] : undefined;
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

  useEffect(() => {
    getAuthUser().then((user) => {
      setAuthUser(user);
    });
  }, []);

  const processSharedUrl = (url: string) => {
    setLoading(true);
    setCleanedUrl(cleanUrl(url));
    const baseUrl = parseBaseUrl(url);
    Promise.all([
      instance.get<string>(url).then((result) => {
        const html = result.data;
        const match = html.match(titleRegex);
        if (match && match[1]) {
          const docTitle = match[1];
          setDefaultTitle(docTitle);
        }
      }),
      getSource(baseUrl).then((data) => {
        if (data) {
          setSource(data);
        } else {
          return createSource(baseUrl).then((newSource) =>
            setSource(newSource)
          );
        }
      }),
    ]).then(() => setLoading(false));
  };

  useEffect(() => {
    if (data.weblink) {
      processSharedUrl(data.weblink);
    } else if (data.text) {
      if (currentSummaryId) {
        setNewSnippet({ value: data.text });
      } else {
        // Google News returns the url in the text object, not weblink
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
  }, []);

  const submitShare = useCallback(async () => {
    if (authUser && title) {
      const summary = {
        url: cleanedUrl,
        title,
        user_id: authUser.id,
        source_id: source?.id,
      };
      const result = await postSummary(summary);
      await sendNotification({
        title: "A new summary was created!",
        text: summary.title,
        summary_id: result.id,
      });
      cleanup();
      navigation.navigate("Home");
    } else {
      Alert.alert("Please specify a title for your summary");
    }
  }, [authUser, cleanup, title]);

  const submitUpdate = useCallback(async () => {
    const updateBlock = {
      snippets: [newSnippet],
    };

    try {
      await updateSummary(currentSummaryId, updateBlock);
      await sendNotification({
        title: "A summary was updated!",
        text: title,
        summary_id: currentSummaryId,
      });
    } catch (err) {
      alert(`Error! ${err}`);
    }

    cleanup();
    navigation.navigate("Home");
  }, [currentSummaryId, newSnippet]);

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
    <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={commonStyle.pageContainer}>
          <View style={{ flex: 1, padding: 10, marginBottom: 30 }}>
            <Text style={commonStyle.logoText}>INSPECT</Text>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              {defaultTitle}
            </Text>
            <Text style={{ color: "blue", marginBottom: 10 }}>
              {cleanedUrl}
            </Text>
            <Input
              ref={titleInputRef}
              label="Title"
              placeholder="New title that explains the contribution of the article"
              value={title}
              editable={!loading && !currentSummaryId}
              onChangeText={(text: string) => {
                if (text !== defaultTitle) {
                  setUseDefaultTitle(false);
                }
                setTitle(text);
              }}
              autoCompleteType={undefined}
            />
            {!currentSummaryId && (
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
                disabled={!title}
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
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
