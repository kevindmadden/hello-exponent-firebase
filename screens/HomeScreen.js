import React from 'react';
import Expo from 'expo'
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  BackHandler,
  Webview,
  TextInput,
  StatusBar,
  Modal,
} from 'react-native';

import { connect } from 'react-redux'
import { BigButton, SquareButton, FlexKey, MathButton } from '../components/Button';
import { MonoText } from '../components/StyledText';
import { getFactoredEquation } from '../logic/differenceOfSquares';
import DifficultyOverlay from '../screens/DifficultyOverlay'
import { HomeScreenPresentation } from '../screens/HomeScreenPresentation'
import { incrementCounter, decrementCounter, incrementUserValue } from '../actions/mainActions'

import * as firebase from 'firebase';

const mapStateToProps = state => {
  return {
    counter: state.counter
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIncrement: () => {
      dispatch(incrementCounter())
    },
    incrementUserValue: (dataPath) => {
      dispatch(incrementUserValue(dataPath))
    }
  }
}

export const HomeScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreenPresentation)
