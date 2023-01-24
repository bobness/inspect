import "react-native-gesture-handler";
import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Platform, View } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";

import ReceiveSharingIntent from "react-native-receive-sharing-intent";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Linking from "expo-linking";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/pages/LoginScreen";
import RegisterScreen from "./src/pages/RegisterScreen";
import HomeScreen from "./src/pages/HomeScreen";
import NewsViewScreen from "./src/pages/NewsViewScreen";
import AuthorViewScreen from "./src/pages/AuthorViewScreen";
import ProfileScreen from "./src/pages/ProfileScreen";
import { updateUserExpoToken } from "./src/store/auth";
import SummaryScreen from "./src/pages/SummaryScreen";
import { Subscription } from "expo-modules-core";
import { instance } from "./src/store/api";
import { AuthUser, User } from "./src/types";
import CurrentUserContext from "./src/contexts/CurrentUserContext";
import AboutScreen from "./src/pages/AboutScreen";

const Stack: any = createNativeStackNavigator();

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log("Received a notification in the background!");
    // Do something with the notification data
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

interface ShareObject {
  text: string | null;
  weblink: string | null;
}

interface RouteObejct {
  path: string;
  args?: any;
}

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [user, setUser] = useState<AuthUser | undefined>();
  const [notification, setNotification] = useState<Notification | undefined>();
  const notificationListener = useRef<Subscription | undefined>();
  const responseListener = useRef<Subscription | undefined>();
  const [expoToken, setExpoToken] = useState<string | undefined>();
  const [currentSummaryId, setCurrentSummaryId] = useState<
    number | undefined
  >();
  const [userLoading, setUserLoading] = useState(true);
  const [deepLinkLoading, setDeepLinkLoading] = useState(false);
  const [navigationIsReady, setNavigationIsReady] = useState(false);
  const [desiredRoute, setDesiredRoute] = useState<RouteObejct | undefined>();
  const deepLinkUrlRegex = useMemo(
    () => RegExp("https?://inspect.datagotchi.net/facts/([a-z0-9]+).*"),
    []
  );
  const deepLinkUrl = Linking.useURL();

  const currentRoutePath = useMemo(
    () =>
      navigationIsReady ? navigationRef.getCurrentRoute()?.name : undefined,
    [navigationIsReady, navigationRef]
  );
  const currentRouteArgs: any = useMemo(
    () => (navigationIsReady ? navigationRef.getCurrentOptions() : undefined),
    [navigationIsReady, navigationRef]
  );

  useEffect(() => {
    return () => {
      setDesiredRoute(undefined);
    };
  }, []);

  useEffect(() => {
    if (navigationIsReady && desiredRoute) {
      if (
        (desiredRoute.path && currentRoutePath !== desiredRoute.path) ||
        currentRouteArgs !== desiredRoute.args
      ) {
        setDeepLinkLoading(false);
        // @ts-expect-error no navigationRef template/generic arg
        navigationRef.navigate(desiredRoute.path, desiredRoute.args ?? {});
      }
    }
  }, [
    navigationIsReady,
    currentRoutePath,
    desiredRoute?.path,
    desiredRoute?.args,
  ]);

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        setDesiredRoute({ path: "Login" });
      }
      return error;
    }
  );

  const handleShare = useCallback(([shareObject]: ShareObject[]) => {
    setDesiredRoute({
      path: "CreateSummary",
      args: {
        data: shareObject,
      },
    });
  }, []);
  ReceiveSharingIntent.getReceivedFiles(
    handleShare,
    (error: any) => {
      console.error(error);
    },
    "net.datagotchi.inspect"
  );

  useEffect(() => {
    if (!user) {
      setUserLoading(true);
      AsyncStorage.getItem("@user")
        .then((userInfo) => {
          if (userInfo) {
            const storedUserInfo = JSON.parse(userInfo);
            setUser(storedUserInfo);
          }
        })
        .finally(() => setUserLoading(false));
    }
  }, [user]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoToken(token));

    // FIXME: addNotificationReceivedListener may not be necessary; I don't even use the resulting 'notification' object
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data && data.id) {
          setDesiredRoute({
            path: "NewsView",
            args: { data: { id: data.id } },
          });
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const handleOnLogin = useCallback(
    (userObject: AuthUser) => {
      if (expoToken && !userObject.expo_token) {
        updateUserExpoToken(expoToken);
        userObject.expo_token = expoToken;
      }
      if (
        userObject.expo_token ||
        instance.defaults.baseURL?.includes("localhost")
      ) {
        AsyncStorage.setItem("@user", JSON.stringify(userObject));
        setUser(userObject);
        setDesiredRoute({ path: "Home" });
      } else {
        alert("Error: no push notification token available");
      }
    },
    [expoToken]
  );

  // TODO: save `deepLinkUrl` for the login page if they aren't logged in
  useEffect(() => {
    if (deepLinkUrl && deepLinkUrl.match(deepLinkUrlRegex)) {
      setDeepLinkLoading(true);
      const match = deepLinkUrl.match(deepLinkUrlRegex);
      const uid = match![1];
      setDesiredRoute({ path: "NewsView", args: { data: { uid } } });
    }
  }, [deepLinkUrl]);

  // ReceiveSharingIntent.clearReceivedFiles();

  useEffect(() => {
    if (
      currentRoutePath === "Loading" &&
      navigationIsReady &&
      !userLoading &&
      !deepLinkLoading
    ) {
      if (user) {
        setDesiredRoute({ path: "Home" });
      } else {
        setDesiredRoute({ path: "Login" });
      }
    }
  }, [navigationIsReady, currentRoutePath, userLoading, deepLinkLoading]);

  return (
    <CurrentUserContext.Provider value={user}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => setNavigationIsReady(true)}
      >
        <Stack.Navigator
          initialRouteName={desiredRoute?.path ?? "Loading"}
          initialRouteParams={desiredRoute?.args ?? {}}
        >
          <Stack.Screen name="Loading" options={{ headerShown: false }}>
            {(props: any) => (
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
            )}
          </Stack.Screen>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props: any) => (
              <LoginScreen {...props} onLoginCallback={handleOnLogin} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props: any) => (
              <HomeScreen
                {...props}
                clearCurrentSummaryId={() => setCurrentSummaryId(undefined)}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="NewsView" options={{ headerShown: true }}>
            {(props: any) => (
              <NewsViewScreen
                {...props}
                setCurrentSummaryId={setCurrentSummaryId}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="AuthorView"
            component={AuthorViewScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="My Profile" options={{ headerShown: true }}>
            {(props: any) => (
              <ProfileScreen {...props} setCurrentUser={setUser} />
            )}
          </Stack.Screen>
          <Stack.Screen name="CreateSummary" options={{ headerShown: false }}>
            {(props: any) => (
              <SummaryScreen {...props} currentSummaryId={currentSummaryId} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </CurrentUserContext.Provider>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } catch (err) {
      alert(err);
    }
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
