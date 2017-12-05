import { Notifications } from 'expo';
import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

import DifficultyOverlay from '../screens/DifficultyOverlay';
import FactorQuizScreen from '../screens/FactorQuizScreen';
//height: Platform.OS === "ios" ? 64 : (56 + StatusBar.currentHeight),

const OverlayStackNavigator = StackNavigator(
  {
    DifficultyOverlay: {
      screen: DifficultyOverlay
    },
  },
  {
    cardStyle: { backgroundColor: '#000000', opacity:1},
  }
)

export default class OverlayNavigator extends React.Component {
  render() {
    return <OverlayStackNavigator />;
  }
}
