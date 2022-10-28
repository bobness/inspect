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
  getNewsById,
  postSummary,
  sendNotification,
  updateSummary,
} from "../store/news";
import { AuthUser, Source } from "../types";
import { instance } from "../store/api";

interface Props {
  route: any;
  navigation: any;
  currentSummaryId?: number;
}

const titleRegex = new RegExp("<head>[^]*<title>([^]+)</title>[^]*</head>");

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
  const [isDraft, setIsDraft] = useState(true);
  const [title, setTitle] = useState<string | undefined>();
  const [authUser, setAuthUser] = useState<AuthUser | undefined>();
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
        setIsDraft(summary.is_draft);
      });
    }
  }, [currentSummaryId]);

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

  useEffect(() => {
    getAuthUser().then((user) => {
      setAuthUser(user);
    });
  }, []);

  useEffect(() => {
    if (data.weblink) {
      setCleanedUrl(cleanUrl(data.weblink));
      const baseUrl = parseBaseUrl(data.weblink);
      Promise.all([
        instance.get<string>(data.weblink).then((result) => {
          const html = result.data;
          const match = html.match(titleRegex);
          if (match && match[1]) {
            const docTitle = match[1];
            setDefaultTitle(docTitle);
          }
        }),
        instance.get(`/sources/${baseUrl}`).then((res) => {
          if (res.data) {
            setSource(res.data);
          }
        }),
      ]).then(() => setLoading(false));
    }

    if (data.text) {
      setNewSnippet({ value: data.text });
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
        is_draft: isDraft,
      };
      const result = await postSummary(summary);
      if (isDraft) {
        cleanup();
        // FIXME: not working!
        navigation.navigate("NewsView", { data: result });
      } else {
        await sendNotification({
          title: "A new summary was created!",
          text: summary.title,
          summary_id: result.id,
        });
        cleanup();
        navigation.navigate("Home");
      }
    } else {
      Alert.alert("Please specify a title for your summary");
    }
  }, [authUser, cleanup, title]);

  const submitUpdate = useCallback(async () => {
    const updateBlock = {
      snippets: [newSnippet],
    };
    await updateSummary(currentSummaryId, updateBlock);
    if (isDraft) {
      cleanup();
      navigation.navigate("NewsView", { data: { id: currentSummaryId } });
    } else {
      await sendNotification({
        title: "A summary was updated!",
        text: title,
        summary_id: currentSummaryId,
      });
      cleanup();
      navigation.navigate("Home");
    }
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
              <>
                <CheckBox
                  title="Use existing title?"
                  checked={useDefaultTitle}
                  onPress={() => setUseDefaultTitle(!useDefaultTitle)}
                />
                <CheckBox
                  title="Make it a draft"
                  checked={isDraft}
                  onPress={() => setIsDraft(!isDraft)}
                />
              </>
            )}
            {!currentSummaryId && !isDraft && (
              <Text style={{ color: "red" }}>
                This will get shared when created
              </Text>
            )}
            {currentSummaryId && (
              <>
                <ScrollView>
                  {snippets.map((snippet) => (
                    <Text
                      key={`snippet #${snippet.id}`}
                      style={{
                        borderColor: "black",
                        borderWidth: 1,
                      }}
                    >
                      {snippet.value}
                    </Text>
                  ))}
                  <Text
                    key="new snippet"
                    style={{ borderColor: "yellow", borderWidth: 5 }}
                  >
                    {newSnippet?.value}
                  </Text>
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
