import React, { ComponentProps, useRef, useEffect, useState } from "react";

import commonStyle from "../styles/CommonStyle";
import { Keyboard, KeyboardAvoidingView, Text, TouchableWithoutFeedback, View, FlatList, TouchableOpacity, Image, SafeAreaView, Platform } from "react-native";
import { Avatar, Overlay, Icon, Button, } from "react-native-elements";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { BottomToolbar, BottomAction } from "../components";
import { getNewsById, postComment, postReaction } from "../store/news";

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
export default function AuthorNewsViewScreen(props: ComponentProps<any>) {
    const {
        route: {
            params: {
                data
            }
        },
        navigation
    } = props;
    let richText: any = useRef(null);
    const [visible, setVisible] = useState(false);
    const [visibleCommentModal, setVisibleCommentModal] = useState(false);
    const [selectedCommentId, selectCommentId]: any = useState(null);
    const [commentText, setCommentText] = useState('');
    const [emoji, setEmoji] = useState('🤔');
    const [newsData, setNewsData]: any = useState(null);

    const getNewsDataById = (id: number) => {
        getNewsById(id).then(result => {
            setNewsData(result);
        });
    }

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const toggleCommentOverlay = () => {
        if (visibleCommentModal) {
            setCommentText('');
            selectCommentId(null);
        }
        setVisibleCommentModal(!visibleCommentModal);
    };

    const getContent = () => {
        let content = '';
        if (newsData && newsData?.snippets) {
            content = newsData?.snippets.join(' ');
        }
        return content;
    };

    useEffect(() => {
        getNewsDataById(data.id);
    }, [data]);

    const handleSaveFeedback = () => {
        const commentData = {
            snippet_id: selectedCommentId,
            comment: commentText,
            summary_id: data.id,
        }
        postComment(data.id, commentData).then(() => {
            toggleCommentOverlay();
            getNewsDataById(data.id);
        })
    };

    const handleEmojiSelect = (emoji: string) => {
        setEmoji(emoji);
        setVisible(false);
        const reactionData = {
            snippet_id: selectedCommentId,
            reaction: emoji,
            summary_id: data.id,
        };
        postReaction(data.id, reactionData).then(() => {
            getNewsDataById(data.id);
        })
    }

    const renderItem = ({ item }: any) => (
        <View style={{ marginTop: 10 }}>
            <TouchableOpacity onPress={() => { selectCommentId(item.id); setVisible(!visible); }}>
                <View style={{ flexDirection: 'row', paddingVertical: 5, }}>
                    <Text style={{ paddingRight: 10, fontSize: 20 }}>{emoji}</Text>
                    <Text>{item.value}</Text>
                </View>
            </TouchableOpacity>
            <View style={{ paddingLeft: 36, flexDirection: 'row' }}>
                <Text style={{ fontSize: 18 }}>{emoji}2</Text>
                <TouchableOpacity onPress={() => { selectCommentId(item.id); toggleCommentOverlay() }}>
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

    return (
        <KeyboardAvoidingView style={commonStyle.containerView} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={commonStyle.pageContainer}>

                    <View style={{ flex: 1, padding: 10 }}>
                        <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ marginRight: 10 }}>
                                    <Icon type="material" name="chevron-left" tvParallaxProperties={undefined} />
                                </TouchableOpacity>
                                <Icon type="font-awesome" name="file" tvParallaxProperties={undefined} />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                                <Avatar title={newsData?.author?.username[0]}/>
                                <Text style={{ paddingLeft: 10, fontSize: 18 }}>{newsData?.author?.username}</Text>
                            </View>
                            <Button
                                title="Follow"
                                buttonStyle={{ backgroundColor: '#6AA84F' }}
                            />
                        </View>
                        <View style={{ alignItems: 'center', padding: 10 }}>
                            <Image
                                source={{ uri: 'https://laurenpoussard.com/wp-content/uploads/2020/01/logo-BigShotLogos-e1579096728995.jpg' }}
                                style={{ height: 40, width: 80, }}
                                resizeMode={'contain'} />
                        </View>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingBottom: 10, alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, flex: 1, paddingHorizontal: 10, textAlign: 'center' }}>{newsData?.title}</Text>
                        </View>
                        <FlatList
                            data={newsData.snippets}
                            renderItem={renderItem}
                            style={{ flex: 1, width: '100%' }}
                        />
                        <BottomAction title={newsData.title} content={getContent()} url={newsData.website_logo} />
                    </View>
                    <BottomToolbar {...props} />

                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay} style={{ width: '100%', height: '100%' }}>
                        <EmojiSelector
                            onEmojiSelected={emoji => handleEmojiSelect(emoji)}
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
                                        setCommentText(descriptionText);
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