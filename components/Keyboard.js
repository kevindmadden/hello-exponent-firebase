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
import { connect } from 'react-redux'
import { keyboardKeyPressed } from '../actions/mainActions'

//could use this for mode in the future
const mapStateToProps = state => {
  return {
    mode: state.keyboard.mode,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    keyboardKeyPressed: (keyPressed) => {
      dispatch(keyboardKeyPressed(keyPressed))
    },
  }
}


class NumberKeyboardPresentation extends React.PureComponent {

  returnKeyValue(keyValue){
    return ()=>this.props.keyboardKeyPressed(keyValue)
    //return this.props.onPress.bind(this, keyValue)
  }

  getTopKeys(){
    if(this.props.mode=='Submit'){
        return(
          <View style={{flex:1, flexDirection:'row', borderWidth:0, borderColor:'black', backgroundColor:this.props.backgroundColor}}>
            <FlexKey text='No Solution Ø' backgroundColor='red' onPress={this.returnKeyValue('No Solution')} />
            <FlexKey text='✓ Submit' backgroundColor='lawngreen' onPress={this.returnKeyValue('Submit')} />
          </View>
        )
    }else{
      return(
        <View style={{flex:1, flexDirection:'row', borderWidth:0, borderColor:'black', backgroundColor:this.props.backgroundColor}}>
          <FlexKey text='Next Problem ⇨' backgroundColor='yellow' onPress={this.returnKeyValue('Next Problem')} />
        </View>
      )
    }

  }

  render () {
    return(
      <View style={{flex:1, flexDirection:'column',}}>


          {this.getTopKeys()}
          {/*<FlexKey text='✓ Submit' backgroundColor='lawngreen' onPress={this.returnKeyValue('Submit')} />*/}

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

export const NumberKeyboard = connect(
  mapStateToProps,
  mapDispatchToProps
)(NumberKeyboardPresentation)
