import { string } from 'prop-types';
import React, { useState } from 'react';
import { Linking, Share } from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import commonStyle from "../styles/CommonStyle";

interface ActionType {
    title: string;
    content: string;
    url: string
};

export default function BottomAction({ title, content, url }: ActionType) {
    const [shareURL, setShareURL] = useState(url);
    const postOnFacebook = () => {
        let facebookParameters = [];
        if (shareURL)
            facebookParameters.push('u=' + encodeURI(shareURL));
        if (content)
            facebookParameters.push('quote=' + encodeURI(content));
        const url =
            'https://www.facebook.com/sharer/sharer.php?'
            + facebookParameters.join('&');

        Linking.openURL(url)
            .then((data) => {
                alert('Facebook Opened');
            })
            .catch(() => {
                alert('Something went wrong');
            });
    };
    const postOnTwitter = () => {
        let twitterParameters = [];
        if (shareURL)
            twitterParameters.push('url=' + encodeURI(shareURL));
        if (content)
            twitterParameters.push('text=' + encodeURI(content));
        const url =
            'https://twitter.com/intent/tweet?'
            + twitterParameters.join('&');
        Linking.openURL(url)
            .then((data) => {
                alert('Twitter Opened');
            })
            .catch(() => {
                alert('Something went wrong');
            });
    };
    const postOnLinkedin = () => {
        let linkedInParameters = [];
        if (shareURL)
            linkedInParameters.push('url=' + encodeURI(shareURL));
        const url =
            'https://www.linkedin.com/sharing/share-offsite/?'
            + linkedInParameters.join('&');

        Linking.openURL(url)
            .then((data) => {
                alert('LinkedIn Opened');
            })
            .catch(() => {
                alert('Something went wrong');
            });
    };
    const onShare = async () => {
        try {
            const result = await Share.share({
                title: title,
                message: content,
                url: url,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            alert(error.message);
        }
    };
    return (
        <ActionButton buttonColor="rgba(231,76,60,1)" renderIcon={() => <Icon name="share-social" style={commonStyle.actionButtonIcon} />}>
            <ActionButton.Item buttonColor='#3498db' title="Share to Facebook" onPress={() => postOnFacebook()}>
                <Icon name="logo-facebook" style={commonStyle.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#1abc9c' title="Share to Twitter" onPress={() => postOnTwitter()}>
                <Icon name="logo-twitter" style={commonStyle.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#9b59b6' title="Share to LinkedIn" onPress={() => postOnLinkedin()}>
                <Icon name="logo-linkedin" style={commonStyle.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#9b59b6' title="Use another options" onPress={() => onShare()}>
                <Icon name="share-social-outline" style={commonStyle.actionButtonIcon} />
            </ActionButton.Item>
        </ActionButton>
    )
}