import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import ReceiveSharingIntent from "react-native-receive-sharing-intent";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/pages/LoginScreen";
import RegisterScreen from "./src/pages/RegisterScreen";
import HomeScreen from "./src/pages/HomeScreen";
import NewsViewScreen from "./src/pages/NewsViewScreen";
import AuthorViewScreen from "./src/pages/AuthorViewScreen";
import AuthorNewsViewScreen from "./src/pages/AuthorNewsViewScreen";
import ProfileScreen from "./src/pages/ProfileScreen";
import { useCallback, useState } from "react";
import ShareModal from "./src/components/ShareModal";

const Stack: any = createNativeStackNavigator();

interface ShareObject {
  text: string | null;
  weblink: string | null;
}

export default function App() {
  const [user, setUser] = useState<any[] | undefined>();
  const [shareUrl, setShareUrl] = useState<string | undefined>();

  const handleShare = useCallback(([shareObject]: ShareObject[]) => {
    // FIXME: still happening multiple times
    if (shareObject.weblink && shareUrl !== shareObject.weblink) {
      // console.log("*** setting shareUrl: ", shareObject.weblink); // DEBUG
      setShareUrl(shareObject.weblink);
    }
    // else if (shareObject.text) {}
  }, []);
  ReceiveSharingIntent.getReceivedFiles(
    handleShare,
    (error: any) => {
      console.error(error);
    },
    "net.datagotchi.inspect"
  );

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await AsyncStorage.getItem("@user");
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      } else {
        setUser({
          userId: 0,
        });
      }
    };
    fetchUser();
  }, []);

  // ReceiveSharingIntent.clearReceivedFiles();

  if (!user) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user.userId === 0 ? "Login" : "Home"}>
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
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
