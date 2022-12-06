import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

export default function BottomToolbar({ navigation }: any) {
  const confirmLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to Logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            navigation.navigate("Login");
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <View
      style={{ backgroundColor: "white", flexDirection: "row", padding: 10 }}
    >
      <TouchableOpacity
        style={{
          height: 60,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <FontAwesomeIcon name="home" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          height: 60,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
        onPress={() => {
          navigation.navigate("My Profile");
        }}
      >
        <FontAwesomeIcon name="user" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          height: 60,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
        onPress={() => {
          confirmLogout();
        }}
      >
        <FontAwesomeIcon name="sign-out" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
}
