import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: Colors.lighter,
    },
    // engine: {
    //   position: 'absolute',
    //   right: 0,
    // },
    body: {
      backgroundColor: Colors.white,
    },
    header: {
      fontSize: 30,
      fontWeight: 'bold',
      color: Colors.black,
      textAlign: 'center'
    },
    evaluationView: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    container: {
      alignSelf: 'stretch',
      alignItems: "center"
    },
    menu: {
      alignSelf: 'stretch',
      height: 200
    },
    connectionList: {
      fontSize: 16,
      marginLeft: 20
    }
  });