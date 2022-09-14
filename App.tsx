import "react-native-gesture-handler";
import { useCallback, useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator, Platform } from "react-native";
import { NavigationContainer, useNavigation, useNavigationContainerRef } from "@react-navigation/native";

import ReceiveSharingIntent from "react-native-receive-sharing-intent";
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/pages/LoginScreen";
import RegisterScreen from "./src/pages/RegisterScreen";
import HomeScreen from "./src/pages/HomeScreen";
import NewsViewScreen from "./src/pages/NewsViewScreen";
import AuthorViewScreen from "./src/pages/AuthorViewScreen";
import AuthorNewsViewScreen from "./src/pages/AuthorNewsViewScreen";
import ProfileScreen from "./src/pages/ProfileScreen";
import ShareModal from "./src/components/ShareModal";
import { updateUserExpoToken } from "./src/store/auth";
import SummaryScreen from "./src/pages/SummaryScreen";

const Stack: any = createNativeStackNavigator();

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  console.log('Received a notification in the background!');
  // Do something with the notification data
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

interface ShareObject {
  text: string | null;
  weblink: string | null;
}

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [user, setUser] = useState<any | undefined>();
  const [notification, setNotification] = useState(false);
  const [sharedContent, setSharedContent] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [shareUrl, setShareUrl] = useState<string | undefined>();
  const [addedNewsId, setNewsId] = useState<number | undefined>();

  const handleShare = useCallback(([shareObject]: ShareObject[]) => {
    // FIXME: still happening multiple times
    if (shareObject.weblink && shareUrl !== shareObject.weblink) {
      // console.log("*** setting shareUrl: ", shareObject.weblink); // DEBUG
      setShareUrl(shareObject.weblink);
    }
    setSharedContent(true);
    navigationRef.navigate('CreateSummary', {
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

  const handleToken = async (token: any) => {
    if (token) {
      if (user && !user.expo_token) {
        await updateUserExpoToken(token);
        user.expo_token = token;
        setUser(user);
        await AsyncStorage.setItem("@user", JSON.stringify(user));
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await AsyncStorage.getItem("@user");
      if (userInfo) {
        const storedUserInfo = JSON.parse(userInfo);
        setUser(storedUserInfo);
      } else {
        setUser({
          userId: 0,
        });
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => handleToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data && data.id) {
        setNewsId(data.id);
        navigationRef.navigate('NewsView', { data });
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!user) {
    return (
      <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // ReceiveSharingIntent.clearReceivedFiles();
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={user.userId === 0 ? "Login" : 'Home'}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props: any) => (
            <HomeScreen
              {...props}
              shareUrl={shareUrl}
              setShareUrl={setShareUrl}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="NewsView"
          component={NewsViewScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="AuthorView"
          component={AuthorViewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AuthorNewsView"
          component={AuthorNewsViewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="CreateSummary"
          component={SummaryScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
