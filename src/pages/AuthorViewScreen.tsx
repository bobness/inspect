import React, { useEffect, useState } from "react";

import commonStyle from "../styles/CommonStyle";
import { Text, View, FlatList, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { ListItem, Avatar, Button, Image, Icon } from "react-native-elements";
import BottomToolbar from "../components/BottomToolbar";
import { getProfileInformation } from "../store/auth";
const list = [
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
    {
        name: 'The super rich often pay < 1% in taxes',
        subtitle: 'Vice President',
        avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
        website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
    },
    {
        name: 'GOP filibusters Jan 6 commission',
        avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
        website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
        subtitle: 'Vice Chairman'
    },
];
export default function AuthorViewScreen(props: any) {
    const {
        route: {
            params: {
                data
            }
        }, navigation
    } = props;
    const [authData, setAuthData]: any = useState(null);
    const [isRefreshing, setRefreshing] = useState(false);

    const renderItem = ({ item }: any) => (
        <ListItem
            bottomDivider
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
            style={{ flex: 1, width: '100%' }}
            onPress={() => { navigation.navigate('AuthorNewsView', { data: item }) }}
        >
            <Icon type="font-awesome" name="file" tvParallaxProperties={undefined} />
            <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <Avatar title={item.title[0]} titleStyle={{ color: 'black' }} source={item.website_logo && { uri: item.website_logo }} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
        </ListItem>
    );

    const getAuthProfileData = (auth_id: number) => {
        setRefreshing(true);
        return getProfileInformation(auth_id).then(res => {
            setRefreshing(false);
            setAuthData(res);
        });
    }

    useEffect(() => {
        getAuthProfileData(data.id)
    }, []);

    const handleRefresh = () => {
        getAuthProfileData(data.id);
    };

    if (!authData) {
        return (
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", padding: 10 }}>
                <ActivityIndicator />
            </View>
        )
    };

    return (
        <View style={commonStyle.pageContainer}>
            <View style={{ flex: 1, padding: 10 }}>
                <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                    <View>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Icon type="material" name="chevron-left" tvParallaxProperties={undefined} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                        <Avatar title={authData?.username[0]} titleStyle={{ color: 'black' }} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
                        <Text style={{ paddingLeft: 10, fontSize: 18 }}>{authData?.username}</Text>
                    </View>
                    <Button
                        title="Follow"
                        buttonStyle={{ backgroundColor: '#6AA84F' }}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700' }}>Trusted sources: </Text>
                    <ScrollView contentContainerStyle={{ flexDirection: 'row', }}>
                        <Image
                            source={{ uri: 'https://www.logodesign.net/logo/eye-and-house-5806ld.png' }}
                            style={{ width: 30, height: 30, borderWidth: 2, borderColor: '#6AA84F', marginHorizontal: 2 }}
                        />
                        <Image
                            source={{ uri: 'https://www.logodesign.net/logo/eye-and-house-5806ld.png' }}
                            style={{ width: 30, height: 30, borderWidth: 2, borderColor: '#6AA84F', marginHorizontal: 2 }}
                        />
                        <Image
                            source={{ uri: 'https://www.logodesign.net/logo/eye-and-house-5806ld.png' }}
                            style={{ width: 30, height: 30, borderWidth: 2, borderColor: '#6AA84F', marginHorizontal: 2 }}
                        />
                    </ScrollView>
                </View>
                <FlatList
                    data={authData?.summaries}
                    renderItem={renderItem}
                    style={{ flex: 1, width: '100%' }}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />
            </View>
            <BottomToolbar {...props} />
        </View>
    );
}