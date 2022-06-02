import React, { useState, useRef } from "react";

import styles from "../styles/RegisterStyle";
import { Alert, Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { Button } from "react-native-elements";

export default function RegisterScreen({ navigation }: any) {
    const usernameRef: any = useRef(null);
    const emailRef: any = useRef(null);
    const passwordRef: any = useRef(null);
    const confirmPasswordRef: any = useRef(null);
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const onRegisterPress = () => {
        if (!username) {
            Alert.alert('Username is required.');
            usernameRef.current.focus();
            return;
        }
        if (!email) {
            Alert.alert('Email is required.');
            emailRef.current.focus();
            return;
        }
        if (!password) {
            Alert.alert('Password is required.');
            passwordRef.current.focus();
            return;
        }
        if (!confirmPassword) {
            Alert.alert('Confirm Password is required.');
            confirmPasswordRef.current.focus();
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Please make sure your passwords match.');
            setConfirmPassword('');
            confirmPasswordRef.current.focus();
            return;
        }
        const postData = {
            username,
            email,
            password,
        };
        navigation.navigate('Home');
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
                        />
                        <TextInput
                            ref={emailRef}
                            placeholder="Email"
                            placeholderTextColor="#c4c3cb"
                            style={styles.registerFormTextInput}
                            onChangeText={(v: string) => setEmail(v)}
                            value={email}
                        />
                        <TextInput
                            ref={passwordRef}
                            placeholder="Password"
                            placeholderTextColor="#c4c3cb"
                            style={styles.registerFormTextInput}
                            secureTextEntry={true}
                            onChangeText={(v: string) => setPassword(v)}
                            value={password}
                        />
                        <TextInput
                            ref={confirmPasswordRef}
                            placeholder="Confirm Password"
                            placeholderTextColor="#c4c3cb"
                            style={styles.registerFormTextInput}
                            secureTextEntry={true}
                            onChangeText={(v: string) => setConfirmPassword(v)}
                            value={confirmPassword}
                        />
                        <Button buttonStyle={styles.registerButton} onPress={() => onRegisterPress()} title="Register" />
                        <Button title="Back to the Login" type="clear" onPress={() => navigation.navigate('Login')} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}