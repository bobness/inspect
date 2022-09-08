import React, { useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "../styles/RegisterStyle";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "react-native-elements";
import { userRegister } from "../store/auth";
import { setToken } from "../store/api";

export default function RegisterScreen({ navigation }: any) {
  const usernameRef: any = useRef(null);
  const emailRef: any = useRef(null);
  const passwordRef: any = useRef(null);
  const confirmPasswordRef: any = useRef(null);
  const [loading, setLoading] = useState(false);

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const onRegisterPress = () => {
    if (!username) {
      Alert.alert("Username is required.");
      usernameRef.current.focus();
      return;
    }
    if (!email) {
      Alert.alert("Email is required.");
      emailRef.current.focus();
      return;
    }
    if (!password) {
      Alert.alert("Password is required.");
      passwordRef.current.focus();
      return;
    }
    if (!confirmPassword) {
      Alert.alert("Confirm Password is required.");
      confirmPasswordRef.current.focus();
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Please make sure your passwords match.");
      setConfirmPassword("");
      confirmPasswordRef.current.focus();
      return;
    }
    const postData = {
      username,
      email,
      password,
    };
    setLoading(true);
    userRegister(postData).then(async (res) => {
      setLoading(false);
      if (res.code !== 200) {
        Alert.alert(res.message);
        return;
      }
      await AsyncStorage.setItem("access_token", res.token);
      await AsyncStorage.setItem("user", JSON.stringify(res));
      setToken(res.token);
      navigation.navigate("Home");
    });
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.registerScreenContainer}>
          <View style={styles.registerFormView}>
            <Text style={styles.logoText}>INSPECT</Text>
            <TextInput
              ref={usernameRef}
              placeholder="Username"
              placeholderTextColor="#c4c3cb"
              style={styles.registerFormTextInput}
              onChangeText={(v: string) => setUserName(v)}
              value={username}
              editable={!loading}
            />
            <TextInput
              ref={emailRef}
              placeholder="Email"
              placeholderTextColor="#c4c3cb"
              style={styles.registerFormTextInput}
              onChangeText={(v: string) => setEmail(v)}
              value={email}
              editable={!loading}
            />
            <TextInput
              ref={passwordRef}
              placeholder="Password"
              placeholderTextColor="#c4c3cb"
              style={styles.registerFormTextInput}
              secureTextEntry={true}
              onChangeText={(v: string) => setPassword(v)}
              value={password}
              editable={!loading}
            />
            <TextInput
              ref={confirmPasswordRef}
              placeholder="Confirm Password"
              placeholderTextColor="#c4c3cb"
              style={styles.registerFormTextInput}
              secureTextEntry={true}
              onChangeText={(v: string) => setConfirmPassword(v)}
              value={confirmPassword}
              editable={!loading}
            />
            <Button
              buttonStyle={styles.registerButton}
              onPress={() => onRegisterPress()}
              title="Register"
              disabled={loading}
            />
            <Button
              title="Back to the Login"
              type="clear"
              onPress={() => navigation.navigate("Login")}
              disabled={loading}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
