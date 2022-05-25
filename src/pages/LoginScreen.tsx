import React from "react";

import styles from "../styles/LoginStyle";
import { Alert, Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Button, SocialIcon } from "react-native-elements";
import * as Facebook from "expo-facebook";

const appId = "1047121222092614";

export default function LoginScreen({ navigation }: any) {
    const onLoginPress = () => { navigation.navigate('Home') };

    const onFbLoginPress = async () => {
        try {
            await Facebook.initializeAsync({
                appId,
            });
            const loginResponse = await Facebook.logInWithReadPermissionsAsync({
                permissions: ["public_profile", "email"],
            });
            if (loginResponse.type === "success") {
                const response = await fetch(`https://graph.facebook.com/me?access_token=${loginResponse.token}`);
                Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);
            }
        } catch ({ message }) {
            Alert.alert(`Facebook Login Error: ${message}`);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.containerView} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.loginScreenContainer}>
                    <View style={styles.loginFormView}>
                        <Text style={styles.logoText}>INSPECT</Text>
                        <TextInput placeholder="Username" placeholderTextColor="#c4c3cb" style={styles.loginFormTextInput} />
                        <TextInput placeholder="Password" placeholderTextColor="#c4c3cb" style={styles.loginFormTextInput} secureTextEntry={true} />
                        <Button buttonStyle={styles.loginButton} onPress={() => onLoginPress()} title="Login" />
                        <View style={[{ marginTop: 10, alignItems: 'center', }]}>
                            <Text style={{ color: '#c4c3cb', fontSize: 16, fontWeight: '700' }}>Login with</Text>
                            <View style={styles.row}>
                                <TouchableOpacity onPress={onFbLoginPress}>
                                    <SocialIcon
                                        type='facebook'
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <SocialIcon
                                        type='google'
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <SocialIcon
                                        type='linkedin'
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[{ marginTop: 10, alignItems: 'center', }]}>
                            <Text style={{ color: '#c4c3cb', fontSize: 16, fontWeight: '700' }}> - OR - </Text>
                            <View style={styles.row}>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <Text>Signup with manually</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}