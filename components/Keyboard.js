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

export class NumberKeyboard extends React.Component {

  returnKeyValue(keyValue){
    return this.props.onPress.bind(this, keyValue)
  }

  render () {
    return(
      <View style={{flex:1, flexDirection:'column',}}>
        <View style={{flex:1, flexDirection:'row', borderWidth:0, borderColor:'black', backgroundColor:this.props.backgroundColor}}>
          <FlexKey text='Ø' backgroundColor='red' onPress={this.returnKeyValue('No Solution')} />
          <FlexKey text='✓ Submit' backgroundColor='lawngreen' onPress={this.returnKeyValue('Submit')} />
        </View>
        <View style={{flex:1, flexDirection:'row', borderWidth:0, borderColor:'black', backgroundColor:this.props.backgroundColor}}>
          <FlexKey text='1' backgroundColor='white' onPress={this.returnKeyValue(1)} />
          <FlexKey text='2' backgroundColor='white' onPress={this.returnKeyValue(2)} />
          <FlexKey text='3' backgroundColor='white' onPress={this.returnKeyValue(3)} />
          <FlexKey text='x' backgroundColor='lightblue' onPress={this.returnKeyValue('x')} />
        </View>
        <View style={{flex:1, flexDirection:'row', borderWidth:0, borderColor:'black', backgroundColor:this.props.backgroundColor}}>
          <FlexKey text='4' backgroundColor='white' onPress={this.returnKeyValue(4)} />
          <FlexKey text='5' backgroundColor='white' onPress={this.returnKeyValue(5)} />
          <FlexKey text='6' backgroundColor='white' onPress={this.returnKeyValue(6)} />
          <FlexKey text='◾²' backgroundColor='lightyellow' onPress={this.returnKeyValue('²')} />
        </View>
        <View style={{flex:1, flexDirection:'row', borderWidth:0, borderColor:'black', backgroundColor:this.props.backgroundColor}}>
          <FlexKey text='7' backgroundColor='white' onPress={this.returnKeyValue(7)} />
          <FlexKey text='8' backgroundColor='white' onPress={this.returnKeyValue(8)} />
          <FlexKey text='9' backgroundColor='white' onPress={this.returnKeyValue(9)} />
          <FlexKey text='+' backgroundColor='lightyellow' onPress={this.returnKeyValue('+')} />
        </View>
        <View style={{flex:1, flexDirection:'row', borderWidth:0, borderColor:'black', backgroundColor:this.props.backgroundColor}}>
          <FlexKey text='Del' backgroundColor='indianred' onPress={this.returnKeyValue('Delete')} />
          <FlexKey text='0' backgroundColor='white' onPress={this.returnKeyValue(0)} />
          <FlexKey text='→' backgroundColor='palegreen' onPress={this.returnKeyValue('Next')} />
          <FlexKey text='−' backgroundColor='lightyellow' onPress={this.returnKeyValue('-')} />
        </View>
      </View>
    )
  }


}