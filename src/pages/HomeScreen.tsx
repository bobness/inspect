import React, { useEffect, useState } from "react";

import commonStyle from "../styles/CommonStyle";
import { Keyboard, KeyboardAvoidingView, Text, TouchableWithoutFeedback, View, FlatList, ActivityIndicator } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import BottomToolbar from "../components/BottomToolbar";
import { getAllNews } from "../store/news";
const list: any = [];
export default function HomeScreen(props: any) {
    const { navigation } = props;
    const [newsData, setNewsData] = useState(list);

    useEffect(() => {
        getAllNews().then(data => {
            setNewsData(data);
        });
    }, []);

    const renderItem = ({ item }: any) => (
        <ListItem
            bottomDivider
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
            style={{ flex: 1, width: '100%' }}
            onPress={() => { navigation.navigate('NewsView', { data: item }) }}
        >
            <Avatar title={item.title[0]} source={item.avatar_url && { uri: item.avatar_url }} titleStyle={{ color: 'black' }} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
            <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <Avatar title={item.title[0]} titleStyle={{ color: 'black' }} source={item.website_logo && { uri: item.website_logo }} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
        </ListItem>
    );

    return (
        <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={commonStyle.pageContainer}>
                    <View style={{ flex: 1, padding: 10 }}>
                        <Text style={commonStyle.logoText}>INSPECT</Text>
                        {newsData.length > 0 &&
                            <FlatList
                                data={newsData}
                                renderItem={renderItem}
                                style={{ flex: 1, width: '100%' }}
                            />
                        }
                        {!newsData.length &&
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", padding: 10 }}>
                                <ActivityIndicator />
                            </View>
                        }
                    </View>
                    <BottomToolbar {...props} />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}