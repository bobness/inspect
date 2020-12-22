import React from 'react';
import { View, Text } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { styles } from "../styles";

const Evaluator = ({userEvaluation, onValueChange}) => {
    return (
        <View style={styles.container}>
            <Text style={{marginTop: 20, fontSize: 15, fontWeight: 'bold'}}>Select Your Evaluation</Text>
            <Picker 
                style={styles.menu}
                selectedValue={userEvaluation}
                onValueChange={onValueChange}>
                <Picker.Item label="Undecided" value="undecided" />
                <Picker.Item label="I Trust This Source" value="trusted" />
                <Picker.Item label="I Do Not Trust This Source" value="distrusted" />
            </Picker>
        </View>
    );
};

export default Evaluator;