import React from 'react';
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
} from 'react-native';

import { BigButton, SquareButton, FlexKey } from '../components/Button';
import { MonoText } from '../components/StyledText';
import { getFactoredEquation } from '../logic/differenceOfSquares';

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = { equation: {equationString:'Placeholder'}, keyValue:'' }

  }
  static navigationOptions = {
    headerTitle: 'Main Menu',
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => true)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => true)
  }

  render() {
    return (

      <View style={{flex:1, flexDirection:'column'}}>
      <ScrollView>
      <View style={styles.container}>



        <View style={styles.buttonGroupContainer}>
          <BigButton text='Easy' backgroundColor='palegreen' onPress={() => this.props.navigation.navigate('Easy')} />
          <SquareButton text='?' backgroundColor='moccasin' style={{marginLeft:10}} onPress={() => this.props.navigation.navigate('Easy')} />
        </View>

        <View style={styles.buttonGroupContainer}>
          <BigButton text='Medium' backgroundColor='lightsalmon' />
          <SquareButton text='?' backgroundColor='moccasin' style={{marginLeft:10}}/>
        </View>

        <View style={styles.buttonGroupContainer}>
          <BigButton text='Hard' backgroundColor='lightcoral' onPress={() => console.log(getFactoredEquation('differenceOfSquares', true))} />
          <SquareButton text='?' backgroundColor='moccasin' style={{marginLeft:10}}/>
        </View>


      </View>
      </ScrollView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection : 'column',
    justifyContent : 'center',
  },
  buttonGroupContainer : {
    flexDirection : 'row',
    margin : 10,
  },
  buttonGroupContainer2 : {
    flexDirection : 'row',
  },
  factorItText : {
    fontSize : 40,
    color : 'white',
    textAlign : 'center',
    backgroundColor : 'black',
  }
})
