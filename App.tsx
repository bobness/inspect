import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/pages/LoginScreen';
import RegisterScreen from './src/pages/RegisterScreen';
import HomeScreen from './src/pages/HomeScreen';
import NewsViewScreen from './src/pages/NewsViewScreen';
import AuthorViewScreen from './src/pages/AuthorViewScreen';
import AuthorNewsViewScreen from './src/pages/AuthorNewsViewScreen';

const Stack: any = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NewsView" component={NewsViewScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AuthorView" component={AuthorViewScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AuthorNewsView" component={AuthorNewsViewScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
