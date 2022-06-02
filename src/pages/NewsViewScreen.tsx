import React, { useRef, useState } from "react";

import commonStyle from "../styles/CommonStyle";
import { Keyboard, KeyboardAvoidingView, Text, TouchableWithoutFeedback, View, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Platform } from "react-native";
import { Avatar, Overlay, Icon } from "react-native-elements";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import BottomToolbar from "../components/BottomToolbar";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import BottomAction from "../components/BottomAction";

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

export default function NewsViewScreen(props: any) {
    const {
        route: {
            params: {
                data
            }
        },
        navigation
    } = props;
    let richText = useRef(null);
    const [visible, setVisible] = useState(false);
    const [visibleCommentModal, setVisibleCommentModal] = useState(false);
    const [emoji, setEmoji] = useState('🤔');

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const toggleCommentOverlay = () => {
        setVisibleCommentModal(!visibleCommentModal);
    };

    const getContent = () => {
        return `In 2007, Jeff Bezos, then a multibillionaire and now the world's richest man, did not pay a penny in federal income taxes.`;
    };

    const handleSaveFeedback = () => {
        console.log('put Feedback');
        toggleCommentOverlay();
    }

    const renderItem = ({ item }: any) => (
        <View>
            <TouchableOpacity onPress={() => setVisible(!visible)}>
                <View style={{ flexDirection: 'row', paddingVertical: 5, }}>
                    <Text style={{ paddingRight: 10, fontSize: 20 }}>{emoji}</Text>
                    <Text>{getContent()}</Text>
                </View>
            </TouchableOpacity>
            <View style={{ paddingLeft: 36, flexDirection: 'row' }}>
                <Text style={{ fontSize: 18 }}>{emoji}2</Text>
                <TouchableOpacity onPress={() => toggleCommentOverlay()}>
                    <Icon
                        name='comment-dots'
                        type='font-awesome-5'
                        color='#ccc'
                        style={{ paddingHorizontal: 10 }}
                        tvParallaxProperties={undefined} />
                </TouchableOpacity>
            </View>
        </View>
    );

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Icon type="material" name="chevron-left" tvParallaxProperties={undefined} />
                </TouchableOpacity>
            ),
            title: 'INSPECT'
        });
    }, [navigation]);

    return (
        <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={commonStyle.pageContainer}>
                    <View style={{ flex: 1, padding: 10 }}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingBottom: 10, alignItems: 'center' }}>
                            <Avatar title={data.name[0]} source={data.avatar_url ? { uri: data.avatar_url } : undefined} />
                            <Text style={{ fontSize: 18, flex: 1, paddingHorizontal: 10, textAlign: 'center' }}>{data.name}</Text>
                            <Avatar title={data.name[0]} source={data.site_link ? { uri: data.site_link } : undefined} containerStyle={{ borderColor: 'green', borderWidth: 1, padding: 3 }} />
                        </View>
                        <FlatList
                            data={list}
                            renderItem={renderItem}
                            style={{ flex: 1, width: '100%' }}
                        />
                        <BottomAction title={data.name} content={getContent()} url={data.site_link} />
                    </View>
                    <BottomToolbar {...props} />
                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay} fullScreen={true}>
                        <EmojiSelector
                            onEmojiSelected={emoji => { setEmoji(emoji); setVisible(false); console.log(emoji) }}
                            showSearchBar={false}
                            showTabs={true}
                            showHistory={true}
                            showSectionTitles={true}
                            category={Categories.all}
                        />
                    </Overlay>

                    <Overlay isVisible={visibleCommentModal} onBackdropPress={toggleCommentOverlay} overlayStyle={{ height: 200 }}>
                        <SafeAreaView>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text>Feedback:</Text>
                                <TouchableOpacity onPress={handleSaveFeedback} style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 2, borderRadius: 3, paddingRight: 10, borderColor: 'grey' }}>
                                    <Icon
                                        name='save'
                                        type='font-awesome-5'
                                        color='#ccc'
                                        style={{ paddingHorizontal: 10 }}
                                        tvParallaxProperties={undefined} />
                                    <Text style={{ color: 'grey', fontWeight: 'bold' }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                                <RichEditor
                                    ref={richText}
                                    onChange={descriptionText => {
                                        console.log("descriptionText:", descriptionText);
                                    }}
                                />
                            </KeyboardAvoidingView>
                            <RichToolbar
                                editor={richText}
                                actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.insertBulletsList, actions.insertOrderedList, actions.insertLink, actions.heading1]}
                                iconMap={{ [actions.heading1]: ({ tintColor }) => (<Text style={[{ color: tintColor }]}>H1</Text>), }}
                            />
                        </SafeAreaView>
                    </Overlay>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}