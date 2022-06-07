import React, { useState } from "react";
import { View, TouchableOpacity, FlatList, Text, ActivityIndicator, Alert } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Overlay, SearchBar, ListItem, Avatar } from 'react-native-elements';
import { searchInformation } from "../store/news";

const list = {
    summaries: [],
    users: [],
};

let timeout: any = null;

export default function BottomToolbar({ navigation }: any) {
    const [viewLayout, setViewLayout] = useState(false);
    const [visible, setVisible] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [searchData, setSearchData] = useState(list);

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
                        navigation.navigate('Login');
                    },
                },
            ],
            {
                cancelable: true,
                onDismiss: () =>
                    Alert.alert(
                        "This alert was dismissed by tapping outside of the alert dialog."
                    ),
            }
        );
    }

    const toggleOverlay = () => {
        if (!visible) {
            setTimeout(() => {
                setViewLayout(true);
            }, 200);
        } else {
            setViewLayout(false);
        }
        setVisible(!visible);
    };

    const updateSearch: any = (word: string) => {
        setKeyword(word);
        timeout && clearTimeout(timeout);
        timeout = setTimeout(function () {
            searchInformation(word).then(data => {
                setSearchData(data);
            });
        }, 300);
        return word;
    };

    const renderUserItem = ({ item }: any) => (
        <ListItem
            bottomDivider
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
            style={{ flex: 1, width: '100%' }}
            onPress={() => {
                setVisible(false);
                navigation.navigate('AuthorView', { data: item })
            }}
        >

            <FontAwesomeIcon
                name='user-circle'
                size={20}
                color='#517fa4'
            />
            <ListItem.Content>
                <ListItem.Title>{item.username}</ListItem.Title>
            </ListItem.Content>
            <Avatar title={item.username[0]} titleStyle={{ color: 'black' }} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
        </ListItem>
    );

    const renderSummaryItem = ({ item }: any) => (
        <ListItem
            bottomDivider
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
            style={{ flex: 1, width: '100%' }}
            onPress={() => {
                setVisible(false);
                navigation.navigate('NewsView', { data: item })
            }}
        >
            <Icon
                name='newspaper-variant'
                size={20}
                color='#517fa4'
            />
            <Avatar title={item.title[0]} titleStyle={{ color: 'black' }} source={item.avatar_url && { uri: item.avatar_url }} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
            <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <Avatar title={item.title[0]} titleStyle={{ color: 'black' }} source={item.website_logo && { uri: item.website_logo }} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
        </ListItem>
    );

    return (
        <View style={{ backgroundColor: 'white', height: 60, flexDirection: 'row' }}>
            <TouchableOpacity
                style={{
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                }}
                onPress={() => {
                    navigation.navigate('Home')
                }}
            >
                <FontAwesomeIcon name="home" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                }}
                onPress={() => {
                    toggleOverlay();
                }}
            >
                <FontAwesomeIcon name="search" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                }}
                onPress={() => {
                    navigation.navigate('Profile');
                }}
            >
                <FontAwesomeIcon name="user" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                }}
                onPress={() => {
                    confirmLogout();
                }}
            >
                <FontAwesomeIcon name="sign-out" size={20} color="black" />
            </TouchableOpacity>

            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                {viewLayout &&
                    <View style={{ marginTop: 10, height: '100%', }}>
                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '700' }}>Search</Text>
                            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => toggleOverlay()}>
                                <Icon
                                    name="close"
                                    color={'black'}
                                    size={24}
                                />
                            </TouchableOpacity>
                        </View>
                        <SearchBar
                            placeholder="Type Here..."
                            onChangeText={updateSearch}
                            value={keyword}
                            showCancel={false}
                            lightTheme={false}
                            round={false}
                            onBlur={() => { }}
                            onFocus={() => { }}
                            platform={"ios"}
                            onClear={() => { }}
                            loadingProps={{}}
                            autoCompleteType={undefined}
                            clearIcon={{ name: 'close' }}
                            searchIcon={{ name: 'search' }}
                            showLoading={false}
                            onCancel={() => { }}
                            cancelButtonTitle={""}
                            cancelButtonProps={{}} />
                        {searchData.users && searchData.users.length > 0 &&
                            <>
                                <Text>Users:</Text>
                                <FlatList data={searchData.users} renderItem={renderUserItem} style={{ flex: 1, marginTop: 5, }} />
                            </>
                        }
                        {searchData.summaries && searchData.summaries.length > 0 &&
                            <>
                                <Text>Summaries:</Text>
                                <FlatList data={searchData.summaries} renderItem={renderSummaryItem} style={{ flex: 1, marginTop: 5, }} />
                            </>
                        }

                    </View>
                }
                {!viewLayout &&
                    <ActivityIndicator />
                }
            </Overlay>
        </View>
    )
}