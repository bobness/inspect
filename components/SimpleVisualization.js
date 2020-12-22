import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "./Icon";
import { styles } from '../styles';
import Evaluator from './Evaluator';

const SimpleVisualization = ({
    article,
    trustingResources,
    distrustingResources,
    trustValue,
    onShare
}) => {
    const [userEvaluation, setUserEvaluation] = useState("undecided");

    useEffect(() => {
        AsyncStorage.getItem(`@inspect/${article.source}`).then((evaluation) => {
            if (evaluation) {
                setUserEvaluation(evaluation);
            }
        });
    }, [article, article.source]);

    const identifyTrust = useCallback((value) => {
        setUserEvaluation(value);
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(`@inspect/${article.source}`, userEvaluation);
    }, [userEvaluation]);

    let evaluationLabel = 'Not Trusted';
    if (trustValue > 0) {
        evaluationLabel = 'Trusted';
    }
    if (trustValue < 0) {
        evaluationLabel = 'Suspicious';
    }

    // TODO: add a preview + a button to share this article with its evaluation on social media
    return  (
        <View style={styles.evaluationView}>
            <View><Icon which={trustValue} /></View>
            <Text style={{fontSize: 20}}>{article.source} is {evaluationLabel} by Your Connections</Text>
            <View style={styles.connectionList}>
                <Text><Icon which={1} style={{width: 16, height: 16}}/> Trusting connections: {trustingResources.length}</Text>
                <Text><Icon which={-1} style={{width: 16, height: 16}}/> Distrusting connections: {distrustingResources.length}</Text>
            </View>
            <Evaluator userEvaluation={userEvaluation} onValueChange={identifyTrust} />
        </View>
    );
}

export default SimpleVisualization;