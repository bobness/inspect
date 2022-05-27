import React from "react";

import commonStyle from "../styles/CommonStyle";
import { Text, View, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { ListItem, Avatar, Button, Image, Icon } from "react-native-elements";
import BottomToolbar from "../components/BottomToolbar";
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
export default function AuthorViewScreen(props: any) {
    const { navigation } = props;
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
                <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
            <Avatar title={item.name[0]} source={item.site_link && { uri: item.site_link }} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
        </ListItem>
    );

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
                        <Avatar title={'Bob'} source={{ uri: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg' }} />
                        <Text style={{ paddingLeft: 10, fontSize: 18 }}>Bob</Text>
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
                    data={list}
                    renderItem={renderItem}
                    style={{ flex: 1, width: '100%' }}
                />
            </View>
            <BottomToolbar {...props} />
        </View>
    );
}