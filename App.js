/**
 * @format
 * @flow strict-local
 */

import React, { useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import Carousel from './components/Carousel';

import SimpleVisualization from './components/SimpleVisualization';
import useArticle from './hooks/useArticle';
import useEvaluation from './hooks/useEvaluation';
import useServer from './hooks/useServer';
import {styles} from './styles';

const App = () => {
  const URL = '#test';
  const { status, article, error } = useArticle(URL);
  const {trustingResources, distrustingResources, trustValue} = useEvaluation(article);
  // const {send} = useServer();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View>
              <Text style={styles.header}>
                Inspect: Source
              </Text>
              <Text>
                {error && <Text>Error! - ${error}</Text>}
              </Text>
              {article && 
                <SimpleVisualization 
                  article={article} 
                  trustingResources={trustingResources}
                  distrustingResources={distrustingResources}
                  trustValue={trustValue}
                  />
              }
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
