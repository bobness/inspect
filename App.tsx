import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
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
  text?: string;
  webUrl?: string;
}

export default function App() {
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | undefined>();

  const hideShareOverlay = useCallback(() => {
    setShareUrl(undefined);
    setShareModalVisible(false);
  }, [shareModalVisible]);

  const handleShare = useCallback((shareObject: ShareObject) => {
    console.log("*** got share object: ", shareObject);
    if (shareObject.webUrl) {
      setShareUrl(shareObject.webUrl);
    }
    // else if (shareObject.text) {}
    setShareModalVisible(true);
  }, []);

  ReceiveSharingIntent.getReceivedFiles(
    handleShare,
    (error: any) => {
      console.error(error);
    },
    "net.datagotchi.inspect"
  );

  // ReceiveSharingIntent.clearReceivedFiles();
  return (
    <>
      <ShareModal
        modalVisible={shareModalVisible}
        url={shareUrl}
        hideOverlay={hideShareOverlay}
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
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
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
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
    </>
  );
}
