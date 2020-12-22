/**
 * @format
 * @flow strict-local
 */

import React, { useCallback } from 'react';
import { NativeModules } from 'react-native';
const ShareExtension = NativeModules.ShareExtension;

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
  const { status, article, error } = useArticle(ShareExtension);
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
                Inspect {/* TODO: create an actual header image */}
              </Text>

              {/* TODO: add a progress gif */}

              {error && 
                <Text>Error! - ${error}</Text>
              }

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
