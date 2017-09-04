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
  Animated,
  Easing,
} from 'react-native'

import { MonoText } from '../components/StyledText'
import { getEquation } from '../logic/differenceOfSquares'
import { NumberKeyboard } from '../components/Keyboard'
import { RectangularGlowingBorderButton, CircularGlowingBorderButton } from '../components/Button'

export default class EasyScreen extends React.Component {

  static navigationOptions = {
    headerTitle: 'Easy',
  }

  constructor(props) {
    super(props)
    this.state = {lastKeyPressed:{keyValue:'blank', time:Date.now()}}
  }

  setKeyValue(keyValue) {
    this.setState({lastKeyPressed:{keyValue: keyValue, time:Date.now()}})
  }

  render() {
    return (

      <View style={{flex:1, flexDirection:'column',}}>
        <View style={{flexGrow:6, flexDirection:'column'}}>
          <ScrollView style={{flex:1}}>
            <FactorDisplay lastKeyPressed={this.state.lastKeyPressed}/>
          </ScrollView>
        </View>
        <View style={{minHeight:155, flexGrow:2, flexDirection:'column'}}>
          <NumberKeyboard onPress={this.setKeyValue.bind(this)} backgroundColor='lightgrey' />
        </View>
      </View>
    )
  }

}

class FactorDisplay extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      display:'',
      borderOpacityAnim: new Animated.Value(0),
      boxWithFocus:'',
      firstSumLeftSummand:'',
      firstSumMiddleSign:'',
      firstSumRightSummand:'',
      secondSumLeftSummand:'',
      secondSumMiddleSign:'',
      secondSumRightSummand:'',
    }
    this.maxNumberSize = 3 //the number of digits of the biggest number that can be entered in any box
    this.noSquaredVariables = true
  }

  componentDidMount(){
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          this.state.borderOpacityAnim, {
            toValue : 1,
            easing : Easing.exp,
            duration :700,
          }
        ),
        Animated.timing(
          this.state.borderOpacityAnim, {
            toValue : 0,
            easing : Easing.ease,
            duration : 1000,
          }
        )]
      )
    ).start()
  }

  tryWritingNumeral(boxWithFocus, boxText, boxTextLastChar, keyValue){
    if( boxWithFocus==='firstSumMiddleSign' || boxWithFocus==='secondSumMiddleSign' ){
      //if sign box already has a value but still has focus, then write numeral to next box if it is empty
      if( boxText.length>0 && this.attemptToMoveFocus(boxWithFocus) ){
        if(boxWithFocus==='firstSumMiddleSign') this.writeKeyToBox('firstSumRightSummand', keyValue)
        if(boxWithFocus==='secondSumMiddleSign') this.writeKeyToBox('secondSumRightSummand', keyValue)
      }
    }else if(boxTextLastChar==='x' || boxTextLastChar==='²'){
      //numbers cannot come immediately after a variable or squared variable
    }else if(boxText.length>=this.maxNumberSize){
      //I cannot imagine a scenario in which more than a 3 digit number would be needed
    }else if(boxText.length===0 && keyValue==0){
      //0 cannot be first numeral entered
    }else{
      this.writeKeyToBox(boxWithFocus, keyValue)
    }

  }

  tryWritingVariable(boxWithFocus, boxText, boxTextLastChar, keyValue, noSquaredVariables){
    if(boxWithFocus==='firstSumMiddleSign' || boxWithFocus==='secondSumMiddleSign'){
      //variable cannot go in sign boxes
    }else if(boxWithFocus==='firstSumRightSummand' || boxWithFocus==='secondSumRightSummand'){
      //variable cannot go in right boxes
    }else if(boxTextLastChar==='x' || boxTextLastChar==='²'){
      //cannot have two variables in a row
    }else{
        this.writeKeyToBox(boxWithFocus, keyValue)
        if(noSquaredVariables) this.attemptToMoveFocus(boxWithFocus)
    }
  }

  tryWritingSign(boxWithFocus, boxText, boxTextLastChar, keyValue){
    if(boxWithFocus==='firstSumMiddleSign' || boxWithFocus==='secondSumMiddleSign'){
      this.writeKeyToBox(boxWithFocus, keyValue, true)
      if(boxText.length===0) this.attemptToMoveFocus(boxWithFocus)
    }else if(boxWithFocus==='firstSumLeftSummand'){
      if(boxText.length>0 && this.attemptToMoveFocus(boxWithFocus)) this.writeKeyToBox('firstSumMiddleSign', keyValue, true)
    }else if(boxWithFocus==='secondSumLeftSummand'){
      if(boxText.length>0 && this.attemptToMoveFocus(boxWithFocus)) this.writeKeyToBox('secondSumMiddleSign', keyValue, true)
    }
  }

  attemptToMoveFocus(boxWithFocus){
    if(boxWithFocus==='firstSumMiddleSign' && (this.state.firstSumRightSummand).length===0){
      this.setBoxWithFocus('firstSumRightSummand')
      return true
    }else if(boxWithFocus==='secondSumMiddleSign' && (this.state.secondSumRightSummand).length===0){
      this.setBoxWithFocus('secondSumRightSummand')
      return true
    }else if(boxWithFocus==='firstSumLeftSummand' && (this.state.firstSumMiddleSign).length===0){
      this.setBoxWithFocus('firstSumMiddleSign')
      return true
    }else if(boxWithFocus==='secondSumLeftSummand' && (this.state.secondSumMiddleSign).length===0){
      this.setBoxWithFocus('secondSumMiddleSign')
      return true
    }
    return false
  }

  tryWritingSquare(boxWithFocus, boxText, boxTextLastChar, keyValue, noSquaredVariables){
    if( boxTextLastChar==='x' && !noSquaredVariables ){
      this.writeKeyToBox(boxWithFocus, keyValue)
      this.attemptToMoveFocus(boxWithFocus)
    }
  }


  writeKeyToBox(box, keyValue, overwrite=false){
    let boxText = this.state[box]
    overwrite ? this.setState({[box] : keyValue}) : this.setState({[box] : boxText+''+keyValue})
  }

  componentWillReceiveProps(nextProps){
    let lastKeyPressedPropActuallyChanged = !(this.props.lastKeyPressed.time===nextProps.lastKeyPressed.time && this.props.lastKeyPressed.keyValue===nextProps.lastKeyPressed.keyValue) //if the time and keyvalue is the same in both props, key prop did not actually change
    if(lastKeyPressedPropActuallyChanged){
      let keyValue = nextProps.lastKeyPressed.keyValue

      let boxWithFocus = this.state.boxWithFocus
      let boxText = this.state[boxWithFocus]
      let boxTextLastChar = boxText.slice(-1)

      if(keyValue === 'Submit'){

      }else if(keyValue === 'No Solution'){

      }else if(keyValue === 'Next'){

      }else if(keyValue === '+' || keyValue === '-'){
        if(keyValue==='-') keyValue='−'
        this.tryWritingSign(boxWithFocus, boxText, boxTextLastChar, keyValue)
      }else if(keyValue === 'x'){
        this.tryWritingVariable(boxWithFocus, boxText, boxTextLastChar, keyValue, this.noSquaredVariables)
      }else if(keyValue === '²'){
        this.tryWritingSquare(boxWithFocus, boxText, boxTextLastChar, keyValue, this.noSquaredVariables)
      }else if([1,2,3,4,5,6,7,8,9,0].indexOf(keyValue)>-1){
        this.tryWritingNumeral(boxWithFocus, boxText, boxTextLastChar, keyValue)
      }else if(keyValue === 'Delete'){
        this.setState({[boxWithFocus] : boxText.slice(0,-1) })
      }
    }
  }

  componentWillUpdate(nextProps, nextState){

  }

//onPress of a factor box...
// set focus on that box (which will start animation)
// determine in higher component which box was pressed

  render(){
    var color = this.state.borderOpacityAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(15, 255, 247, 0)', 'rgba(15, 255, 247, 0.8)']
    })
    let marginWidth = -2
    let marginParenthesisWidth = -6
    return (
      <View style={styles.container}>

        <View style = {{flexDirection:'row', justifyContent:'center', alignItems:'center', flex:1, backgroundColor:'lightblue',}}>
          <Text style={styles.parenthesis}>(</Text>
          <View style = {{marginLeft:marginParenthesisWidth, marginRight:marginWidth}}>
            <RectangularGlowingBorderButton
              name = 'firstSumLeftSummand'
              nameOfActiveButton = {this.state.boxWithFocus}
              text = {this.state.firstSumLeftSummand}
              onPress = {this.setBoxWithFocus.bind(this)}
              rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
              rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
            />
          </View>
          <View style = {{marginLeft:marginWidth, marginRight:marginWidth}}>
            <CircularGlowingBorderButton
              name = 'firstSumMiddleSign'
              nameOfActiveButton = {this.state.boxWithFocus}
              text = {this.state.firstSumMiddleSign}
              onPress = {this.setBoxWithFocus.bind(this)}
              rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
              rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
            />
          </View>
          <View style = {{marginLeft:marginWidth, marginRight:marginParenthesisWidth}}>
            <RectangularGlowingBorderButton
              name = 'firstSumRightSummand'
              nameOfActiveButton = {this.state.boxWithFocus}
              text = {this.state.firstSumRightSummand}
              onPress = {this.setBoxWithFocus.bind(this)}
              rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
              rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
            />
          </View>

          <Text style={styles.parenthesis}>)(</Text>

          <View style = {{marginLeft:marginParenthesisWidth, marginRight:marginWidth}}>
            <RectangularGlowingBorderButton
              name = 'secondSumLeftSummand'
              nameOfActiveButton = {this.state.boxWithFocus}
              text = {this.state.secondSumLeftSummand}
              onPress = {this.setBoxWithFocus.bind(this)}
              rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
              rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
            />
          </View>
          <View style = {{marginLeft:marginWidth, marginRight:marginWidth}}>
            <CircularGlowingBorderButton
              name = 'secondSumMiddleSign'
              nameOfActiveButton = {this.state.boxWithFocus}
              text = {this.state.secondSumMiddleSign}
              onPress = {this.setBoxWithFocus.bind(this)}
              rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
              rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
            />
          </View>
          <View style = {{marginLeft:marginWidth, marginRight:marginParenthesisWidth}}>
            <RectangularGlowingBorderButton
              name = 'secondSumRightSummand'
              nameOfActiveButton = {this.state.boxWithFocus}
              text = {this.state.secondSumRightSummand}
              onPress = {this.setBoxWithFocus.bind(this)}
              rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
              rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
            />
          </View>
          <Text style={styles.parenthesis}>)</Text>
        </View>




      </View>
    )
  }

  setBoxWithFocus(box){
    this.setState({boxWithFocus: box})
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection : 'column',
    justifyContent : 'center',
  },
  parenthesis: {
    fontFamily : 'math-font-narrow',
    fontSize : 60,
    backgroundColor : 'transparent',
  },
  plusOrMinusText : {
    borderRadius: 45,
    minWidth: 90,
    minHeight : 90, lineHeight : 80,
    fontSize : 40,
    color : 'black',
    textAlign : 'center',
    padding : 10,
    borderColor : 'black',
    borderWidth : 2,
    backgroundColor : 'white',
    overflow: 'hidden',

  }
})
