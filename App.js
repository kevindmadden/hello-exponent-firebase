import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';

import cacheAssetsAsync from './utilities/cacheAssetsAsync';

//GOAL: Write main outer component that will...
//  cache needed images/fonts
//  display loading screen until everything is cached
//  display the outermost container of the app (e.g. the status bar) with the main rootnavigation class inside
//320x(426-470/480-568) dp -- design ui for this

export default class AppContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      appIsReady : false
    }
  }

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/expo-wordmark.png')],
        fonts: [
          FontAwesome.font,
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
          { 'math-font' : require('./assets/fonts/RobotoSlab-Regular.ttf')},
          { 'math-font-narrow' : require('./assets/fonts/StintUltraCondensed-Regular.ttf')},
        ],
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' && <StatusBar backgroundColor="blue" />}
          <RootNavigation />
        </View>
      );
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
