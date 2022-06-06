import React, { useState } from "react";
import { View, TouchableOpacity, FlatList, Text, ActivityIndicator, Alert } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Overlay, SearchBar, ListItem, Avatar } from 'react-native-elements';
import { searchInformation } from "../store/news";

const list = {
    summaries: [
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
            type: 'news',
        },
        {
            title: 'Vice Chairman',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman',
            type: 'profile',
        },
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
            type: 'news',
        },
        {
            title: 'Vice Chairman',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman',
            type: 'profile',
        },
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
            type: 'news',
        },
        {
            title: 'Vice Chairman',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman',
            type: 'profile',
        },
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
            type: 'news',
        },
        {
            title: 'Vice Chairman',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman',
            type: 'profile',
        },
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
            type: 'news',
        },
        {
            title: 'Vice Chairman',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman',
            type: 'profile',
        },
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
            type: 'news',
        },
        {
            title: 'Vice Chairman',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman',
            type: 'profile',
        },
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
            type: 'news',
        },
        {
            title: 'Vice Chairman',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman',
            type: 'profile',
        },
    ],
    users: [{
        username: 'TEST',
        email: 'test@test.com',
    }],
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
        if (word) {
            setSearchData({ summaries: list.summaries.filter(item => item.title.indexOf(word) > -1 || item.website_logo.indexOf(word) > -1), users: list.users.filter(item => item.username.indexOf(word) > -1 || item.email.indexOf(word) > -1)})
        } else {
            setSearchData(list);
        }
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
                if (item.type === 'news') {
                    navigation.navigate('NewsView', { data: item })
                } else if (item.type === 'profile') {
                    navigation.navigate('AuthorView', { data: item })
                }
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
            <Avatar title={item.username[0]} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
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
                if (item.type === 'news') {
                    navigation.navigate('NewsView', { data: item })
                } else if (item.type === 'profile') {
                    navigation.navigate('AuthorView', { data: item })
                }
            }}
        >
            <Icon
                name='newspaper-variant'
                size={20}
                color='#517fa4'
            />
            <Avatar title={item.title[0]} source={item.avatar_url && { uri: item.avatar_url }} />
            <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <Avatar title={item.title[0]} source={item.website_logo && { uri: item.website_logo }} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
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
                    <View style={{ marginTop: 10 }}>
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
                        <FlatList data={searchData.users} renderItem={renderUserItem} style={{ flex: 1 }} />
                        <FlatList data={searchData.summaries} renderItem={renderSummaryItem} style={{ flex: 1 }} />
                    </View>
                }
                {!viewLayout &&
                    <ActivityIndicator />
                }
            </Overlay>
        </View>
    )
}