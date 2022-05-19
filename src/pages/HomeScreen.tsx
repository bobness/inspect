import React from "react";

import commonStyle from "../styles/CommonStyle";
import { Keyboard, KeyboardAvoidingView, Text, TouchableWithoutFeedback, View } from "react-native";

export default function HomeScreen() {
    return (
        <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={commonStyle.pageContainer}>
                    <Text style={commonStyle.logoText}>INSPECTION HOME</Text>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}