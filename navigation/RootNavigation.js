import { Notifications } from 'expo';
import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';

import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

import { HomeScreen } from '../screens/HomeScreen';
import FactorQuizScreen from '../screens/FactorQuizScreen'
//height: Platform.OS === "ios" ? 64 : (56 + StatusBar.currentHeight),
const RootStackNavigator = StackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    FactorQuizScreen: {
      screen: FactorQuizScreen,
    },
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
      headerStyle: {
        height: Platform.OS === "ios" ? 64 : (56 + StatusBar.currentHeight),
        paddingTop: Platform.OS === "ios" ? 20 : StatusBar.currentHeight,
      },
    }),
    headerMode: Platform.OS === 'ios' ? 'float' : 'float', //or 'screen' for android/ 'float' for ios //'none' for fullscreen
  }
)

export default class RootNavigator extends React.Component {
  render() {
    return <RootStackNavigator />;
  }
}
