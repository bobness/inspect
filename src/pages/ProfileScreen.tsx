import React, { useEffect, useState } from "react";

import commonStyle from "../styles/CommonStyle";
import { Keyboard, KeyboardAvoidingView, Text, TouchableWithoutFeedback, View, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Tab, TabView, ListItem, Avatar } from "react-native-elements";
import { getAuthUser } from "../store/auth";

const list = {
    email: 'test@test.com',
    username: 'TEst',
    summaries: [
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
        },
        {
            title: 'GOP filibusters Jan 6 commission',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman'
        },
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
        },
        {
            title: 'GOP filibusters Jan 6 commission',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman'
        },
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
        },
        {
            title: 'GOP filibusters Jan 6 commission',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman'
        },
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
        },
        {
            title: 'GOP filibusters Jan 6 commission',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman'
        },
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
        },
        {
            title: 'GOP filibusters Jan 6 commission',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman'
        },
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
        },
        {
            title: 'GOP filibusters Jan 6 commission',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman'
        },
        {
            title: 'The super rich often pay < 1% in taxes',
            subtitle: 'Vice President',
            avatar_url: 'https://dominoone.org/storage/user/image/2HnBQwRJPKI2ytcipqhYtnLrcuiayxFGdzxBo3CN.jpeg',
            website_logo: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg',
        },
        {
            title: 'GOP filibusters Jan 6 commission',
            avatar_url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
            website_logo: 'https://minitex.umn.edu/sites/default/files/styles/manual_crop_16_9/public/images/2021-02/Ebooks%20Minnesota%20for%20Minitex%20News.png?h=4cf87883&itok=Vmq7vBp9',
            subtitle: 'Vice Chairman'
        },
    ],
    users: [{
        username: 'John',
        email: 'john@test.com',
    }],
};

export default function ProfileScreen(props: any) {
    const { navigation } = props;
    const [profileData, setProfileData]: any = useState(list);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        getAuthUser().then(data => {
            setProfileData(data);
        });
    }, []);

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
                    onPress={() => navigation.goBack()}
                    containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                />
            ),
        });
    }, [navigation]);

    const renderNewsItem = ({ item }: any) => (
        <ListItem
            bottomDivider
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
            style={{ flex: 1, width: '100%' }}
            onPress={() => { navigation.navigate('NewsView', { data: item }) }}
        >
            <Avatar title={item.title[0]} source={item.avatar_url && { uri: item.avatar_url }} />
            <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <Avatar title={item.title[0]} source={item.website_logo && { uri: item.website_logo }} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
        </ListItem>
    );

    const renderFollowerItem = ({ item }: any) => (
        <ListItem
            bottomDivider
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
            style={{ flex: 1, width: '100%' }}
            onPress={() => { navigation.navigate('NewsView', { data: item }) }}
        >
            <ListItem.Content>
                <ListItem.Title>{item.username}</ListItem.Title>
            </ListItem.Content>
            <Avatar title={item.username[0]} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
        </ListItem>
    );

    return (
        <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={commonStyle.pageContainer}>
                    <Tab value={tabIndex} onChange={setTabIndex} indicatorStyle={{ backgroundColor: 'green' }}>
                        <Tab.Item title="Info" titleStyle={{ color: 'black' }} />
                        <Tab.Item title="Articles" titleStyle={{ color: 'black' }} />
                        <Tab.Item title="Follow" titleStyle={{ color: 'black' }} />
                    </Tab>
                    <TabView value={tabIndex} onChange={setTabIndex}>
                        <TabView.Item style={{ width: '100%' }}>
                            <View style={{ flex: 1, padding: 10 }}>
                                <Input
                                    label='Email Address'
                                    placeholder='Email Address'
                                    leftIcon={<Icon
                                        name='envelope'
                                        size={24}
                                        color='black' />}
                                    value={profileData?.email}
                                    autoCompleteType={undefined} />
                                <Input
                                    label='User Name'
                                    placeholder='User Name'
                                    leftIcon={<Icon
                                        name='user'
                                        size={24}
                                        color='black' />}
                                    value={profileData?.username}
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
                                        onPress={() => navigation.goBack()}
                                    />
                                </View>
                            </View>
                        </TabView.Item>
                        <TabView.Item style={{ width: '100%' }}>
                            <FlatList
                                data={profileData.summaries}
                                renderItem={renderNewsItem}
                                style={{ flex: 1, width: '100%' }}
                            />
                        </TabView.Item>
                        <TabView.Item style={{ width: '100%' }}>
                            <FlatList
                                data={profileData.followers}
                                renderItem={renderFollowerItem}
                                style={{ flex: 1, width: '100%' }}
                            />
                        </TabView.Item>
                    </TabView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}