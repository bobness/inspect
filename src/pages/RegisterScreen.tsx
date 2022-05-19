import React from "react";

import styles from "../styles/RegisterStyle";
import { Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { Button } from "react-native-elements";

export default function RegisterScreen({ navigation }: any) {
    const onRegisterPress = () => { };

    return (
        <KeyboardAvoidingView style={styles.containerView} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.registerScreenContainer}>
                    <View style={styles.registerFormView}>
                        <Text style={styles.logoText}>INSPECTION</Text>
                        <TextInput placeholder="Username" placeholderTextColor="#c4c3cb" style={styles.registerFormTextInput} />
                        <TextInput placeholder="Email" placeholderTextColor="#c4c3cb" style={styles.registerFormTextInput} />
                        <TextInput placeholder="Password" placeholderTextColor="#c4c3cb" style={styles.registerFormTextInput} secureTextEntry={true} />
                        <TextInput placeholder="Confirm Password" placeholderTextColor="#c4c3cb" style={styles.registerFormTextInput} secureTextEntry={true} />
                        <Button buttonStyle={styles.registerButton} onPress={() => onRegisterPress()} title="Register" />
                        <Button title="Back to the Login" type="clear" onPress={() => navigation.navigate('Login')} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}