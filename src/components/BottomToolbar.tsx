import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, FlatList, Text, ActivityIndicator } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Overlay, SearchBar, ListItem, Avatar } from 'react-native-elements';

const list = [
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        site_link: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        site_link: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        site_link: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        site_link: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        site_link: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        site_link: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        site_link: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        site_link: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        site_link: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        site_link: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        site_link: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        site_link: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        site_link: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        site_link: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
];

export default function BottomToolbar({ navigation }: any) {
    const [viewLayout, setViewLayout] = useState(false);
    const [visible, setVisible] = useState(false);
    const [keyword, setKeyword] = useState('');

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
        return word;
    };

    const renderItem = ({ item }: any) => (
        <ListItem
            bottomDivider
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
            style={{ flex: 1, width: '100%' }}
            onPress={() => { navigation.navigate('NewsView', { data: item }) }}
        >
            <Avatar title={item.name[0]} source={item.avatar_url && { uri: item.avatar_url }} />
            <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
            <Avatar title={item.name[0]} source={item.site_link && { uri: item.site_link }} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
        </ListItem>
    );

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
                    toggleOverlay();
                }}
            >
                <FontAwesomeIcon name="search" size={20} color="black" />
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
                <FontAwesomeIcon name="user" size={20} color="white" />
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
                        <FlatList data={list} renderItem={renderItem} style={{ flex: 1 }} />
                    </View>
                }
                {!viewLayout &&
                    <ActivityIndicator />
                }
            </Overlay>
        </View>
    )
}