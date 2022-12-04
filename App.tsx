import "react-native-gesture-handler";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";

import ReceiveSharingIntent from "react-native-receive-sharing-intent";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

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

interface NavigationPath {
  pathString: string;
  args: any;
}

export default function App() {
  // TODO: not sure how to type this for its .navigate() arguments
  const navigationRef = useNavigationContainerRef();
  const [user, setUser] = useState<any | undefined>();
  const [notification, setNotification] = useState<Notification | undefined>();
  const notificationListener = useRef<Subscription | undefined>();
  const responseListener = useRef<Subscription | undefined>();
  const [expoToken, setExpoToken] = useState<string | undefined>();
  const [currentSummaryId, setCurrentSummaryId] = useState<
    number | undefined
  >();

  const [navigationIsReady, setNavigationIsReady] = useState(false);

  const [queuedPath, setQueuedPath] = useState<NavigationPath | undefined>();
  useEffect(() => {
    if (navigationIsReady && queuedPath) {
      const { pathString, args } = queuedPath;
      setQueuedPath(undefined);
      navigationRef.navigate(pathString, args);
    }
  }, [navigationIsReady]);

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        navigationRef.navigate("Login");
      }
      return error;
    }
  );

  const handleShare = useCallback(([shareObject]: ShareObject[]) => {
    navigationRef.navigate("CreateSummary", {
      data: shareObject,
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
      AsyncStorage.getItem("@user").then((userInfo) => {
        if (userInfo) {
          const storedUserInfo = JSON.parse(userInfo);
          setUser(storedUserInfo);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data && data.id) {
          navigationRef.navigate("NewsView", { data });
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

  const handleOnLogin = (userObject: any) => {
    if (expoToken) {
      updateUserExpoToken(expoToken);
      userObject.expo_token = expoToken;
      AsyncStorage.setItem("@user", JSON.stringify(userObject));
      setUser(userObject);
    }
  };

  // ReceiveSharingIntent.clearReceivedFiles();
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => setNavigationIsReady(true)}
    >
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
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
        <Stack.Screen
          name="My Profile"
          component={ProfileScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen name="CreateSummary" options={{ headerShown: false }}>
          {(props: any) => (
            <SummaryScreen {...props} currentSummaryId={currentSummaryId} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
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
  } else {
    alert("Must use physical device for Push Notifications");
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
