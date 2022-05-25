import React from "react";

import commonStyle from "../styles/CommonStyle";
import { Keyboard, KeyboardAvoidingView, Text, TouchableWithoutFeedback, View, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from "react-native-elements";
import BottomToolbar from "../components/BottomToolbar";

export default function ProfileScreen(props: any) {
    const { navigation } = props;
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    type={'clear'}
                    icon={
                        <Icon
                            name="chevron-left"
                            size={15}
                            color="black"
                            style={{ marginRight: 5 }}
                        />
                    }
                    onPress={() => navigation.navigate('Home')}
                    containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                />
            ),
        });
    }, [navigation]);

    return (
        <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={commonStyle.pageContainer}>
                    <View style={{ flex: 1, padding: 10 }}>
                        <Input
                            label='Email Address'
                            placeholder='Email Address'
                            leftIcon={<Icon
                                name='envelope'
                                size={24}
                                color='black' />}
                            autoCompleteType={undefined} />
                        <Input
                            label='User Name'
                            placeholder='User Name'
                            leftIcon={<Icon
                                name='user'
                                size={24}
                                color='black' />}
                            autoCompleteType={undefined} />
                        <Input
                            label='Password'
                            placeholder='Password'
                            leftIcon={<Icon
                                name='lock'
                                size={24}
                                color='black' />}
                            autoCompleteType={undefined} />
                        <Input
                            label='Confirm Password'
                            placeholder='Confirm Password'
                            leftIcon={<Icon
                                name='lock'
                                size={24}
                                color='black' />}
                            autoCompleteType={undefined} />
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Button
                                title="Save"
                                icon={
                                    <Icon
                                        name="save"
                                        size={15}
                                        color="white"
                                        style={{ marginRight: 5 }}
                                    />
                                }
                                buttonStyle={{ marginHorizontal: 10 }}
                            />
                            <Button
                                title="Back"
                                icon={
                                    <Icon
                                        name="arrow-left"
                                        size={15}
                                        color="white"
                                        style={{ marginRight: 5 }}
                                    />
                                }
                                buttonStyle={{ marginHorizontal: 10, backgroundColor: '#DD4A48' }}
                            />
                        </View>
                    </View>
                    <BottomToolbar {...props} />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}