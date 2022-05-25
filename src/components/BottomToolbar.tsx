import React, { useState } from "react";
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Overlay } from 'react-native-elements';

export default function BottomToolbar({ navigation }: any) {
    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    return (
        <View style={{ backgroundColor: 'white', height: 50, flexDirection: 'row' }}>
            <TouchableOpacity
                style={{
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                }}
                onPress={() => {
                    setVisible(true)
                }}
            >
                <Icon name="search" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    height: 60,
                    backgroundColor: '#238636',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                }}
                onPress={() => {
                    navigation.navigate('Profile');
                }}
            >
                <Icon name="user" size={20} color="white" />
            </TouchableOpacity>
            
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} style={{ width: '100%', height: '100%' }}>
            </Overlay>
        </View>
    )
}