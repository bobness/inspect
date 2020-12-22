import React from 'react';
import { Image } from "react-native";
import { styles } from '../styles';

const Icon = ({which, style = {width: 50, height: 50}}) => {
    if (which > 0) {
        return <Image style={style} source={require('../static/good.png')} />;
    }
    if (which < 0) {
        return <Image style={style} source={require('../static/bad.png')} />;
    }
    return <Image style={style} source={require('../static/warning.png')} />;
}

export default Icon;