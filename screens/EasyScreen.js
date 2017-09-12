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
      factorInputGroup: {
        activeBox:'firstSumLeftSummand',
        firstSumLeftSummand:    { text:'', acceptsVariable:true, acceptsNumeral:true },
        firstSumMiddleSign:     { text:'', acceptsSign:true },
        firstSumRightSummand:   { text:'', acceptsNumeral:true },
        secondSumLeftSummand:   { text:'', acceptsVariable:true, acceptsNumeral:true },
        secondSumMiddleSign:    { text:'', acceptsSign:true },
        secondSumRightSummand:  { text:'', acceptsNumeral:true },
        nextOrder: ['firstSumLeftSummand', 'firstSumMiddleSign', 'firstSumRightSummand', 'secondSumLeftSummand', 'secondSumMiddleSign', 'secondSumRightSummand'],
        acceptsSquaredVariables: true,
        enabled: true,
      },
      activeGroup : 'factorInputGroup',
    }
    this.maxNumberSize = 3 //the number of digits of the biggest number that can be entered in any box
    this.noSquaredVariables = true
  }

  tryWritingNumeral(activeBox, boxText, boxTextLastChar, keyValue){
    if( activeBox==='firstSumMiddleSign' || activeBox==='secondSumMiddleSign' ){
      //if sign box already has a value but still has focus, then write numeral to next box if it is empty
      if( boxText.length>0 && this.attemptToMoveFocus(activeBox) ){
        if(activeBox==='firstSumMiddleSign') this.writeKeyToBox('firstSumRightSummand', keyValue)
        if(activeBox==='secondSumMiddleSign') this.writeKeyToBox('secondSumRightSummand', keyValue)
      }
    }else if(boxTextLastChar==='x' || boxTextLastChar==='²'){
      //numbers cannot come immediately after a variable or squared variable
    }else if(boxText.length>=this.maxNumberSize){
      //I cannot imagine a scenario in which more than a 3 digit number would be needed
    }else if(boxText.length===0 && keyValue==0){
      //0 cannot be first numeral entered
    }else{
      this.writeKeyToBox(activeBox, keyValue)
    }

  }

  tryWritingVariable(activeBox, boxText, boxTextLastChar, keyValue, noSquaredVariables){
    if(activeBox==='firstSumMiddleSign' || activeBox==='secondSumMiddleSign'){
      //variable cannot go in sign boxes
    }else if(activeBox==='firstSumRightSummand' || activeBox==='secondSumRightSummand'){
      //variable cannot go in right boxes
    }else if(boxTextLastChar==='x' || boxTextLastChar==='²'){
      //cannot have two variables in a row
    }else{
        this.writeKeyToBox(activeBox, keyValue)
        if(noSquaredVariables) this.attemptToMoveFocus(activeBox)
    }
  }

  tryWritingSign(activeBox, nextBox, keyValue){
    let successful = false
    let updates = {}
    if(activeBox.attributes.acceptsSign){
      updates[activeBox.name] = {...activeBox.attributes, text: ''+keyValue}
      if(nextBox.isWrapped===false && nextBox.text=='') updates.activeBox=nextBox.name
      successful = true
    }else{
      if(nextBox.attributes.acceptsSign && nextBox.text=='' && activeBox.text!='' && nextBox.isWrapped===false){
        updates.activeBox=nextBox.name
        updates[activeBox.name] = {...nextBox.attributes, text: ''+keyValue}
        successful = true
      }
    }
    return {updates, successful}
  }

  attemptToMoveFocus(activeBox){
    if(activeBox==='firstSumMiddleSign' && (this.state.firstSumRightSummand).length===0){
      this.setactiveBox('firstSumRightSummand')
      return true
    }else if(activeBox==='secondSumMiddleSign' && (this.state.secondSumRightSummand).length===0){
      this.setactiveBox('secondSumRightSummand')
      return true
    }else if(activeBox==='firstSumLeftSummand' && (this.state.firstSumMiddleSign).length===0){
      this.setactiveBox('firstSumMiddleSign')
      return true
    }else if(activeBox==='secondSumLeftSummand' && (this.state.secondSumMiddleSign).length===0){
      this.setactiveBox('secondSumMiddleSign')
      return true
    }
    return false
  }

  tryWritingSquare(activeBox, boxText, boxTextLastChar, keyValue, noSquaredVariables){
    if( boxTextLastChar==='x' && !noSquaredVariables ){
      this.writeKeyToBox(activeBox, keyValue)
      this.attemptToMoveFocus(activeBox)
    }
  }

  writeKeyToBox(activeBox, keyValue, boxText, overwrite=false){
    //overwrite ? this.setState({factorInputGroup: { [activeBox]: { [display] : keyValue } } }) : this.setState({factorInputGroup: { [activeBox]: { [display] : boxText+''+keyValue } } })
  }

  respondToKeyPress(prevState, keyValue){
    let focusGroupName = 'factorInputGroup'
    let focusGroup = prevState[focusGroupName]

    let activeBox = (() => {
      let name = focusGroup['activeBox']
      let attributes = focusGroup[name]
      let text = attributes.text
      let textLastChar = text.slice(-1)
      return {name, attributes, text, textLastChar}
    })()

    let nextBox = (() => {
      let activeBoxIndex = focusGroup.nextOrder.indexOf(activeBox.name)
      if(activeBoxIndex===-1) console.error(''+activeBox.name+' is not included in the nextOrder array')
      let isWrapped = activeBoxIndex==(focusGroup.nextOrder.length-1) ? true : false
      let name = isWrapped===false ? focusGroup.nextOrder[activeBoxIndex+1] : focusGroup.nextOrder[0]
      let attributes = focusGroup[name]
      let text = attributes.text
      let textLastChar = text.slice(-1)
      return {isWrapped, name, attributes, text, textLastChar}
    })()

    let newFocusGroupObj = {
      updates: {},
      successful: false,
    }

    if(keyValue === 'Submit'){

    }else if(keyValue === 'No Solution'){

    }else if(keyValue === 'Next'){
      newFocusGroupObj = {updates: {activeBox: nextBox.name}, successful: true }
    }else if(keyValue === '+' || keyValue === '-'){
      if(keyValue==='-') keyValue='−'
      newFocusGroupObj = this.tryWritingSign(activeBox, nextBox, keyValue)
    }else if(keyValue === 'x'){
      //this.tryWritingVariable(activeBox, boxText, boxTextLastChar, keyValue, this.noSquaredVariables)
    }else if(keyValue === '²'){
      //this.tryWritingSquare(activeBox, boxText, boxTextLastChar, keyValue, this.noSquaredVariables)
    }else if([1,2,3,4,5,6,7,8,9,0].indexOf(keyValue)>-1){
      //this.tryWritingNumeral(activeBox, boxText, boxTextLastChar, keyValue)
    }else if(keyValue === 'Delete'){
      //this.setState({[activeBox] : boxText.slice(0,-1) })
    }

    return {
      [focusGroupName] : {
        ...focusGroup,
        ...newFocusGroupObj.updates,
      }
    }

  }

  componentWillReceiveProps(nextProps){
    let lastKeyPressedPropActuallyChanged = !(this.props.lastKeyPressed.time===nextProps.lastKeyPressed.time && this.props.lastKeyPressed.keyValue===nextProps.lastKeyPressed.keyValue) //if the time and keyvalue is the same in both props, key prop did not actually change
    if(lastKeyPressedPropActuallyChanged){
      let keyValue = nextProps.lastKeyPressed.keyValue
      this.setState( (prevState) => {return this.respondToKeyPress(prevState, keyValue)} )
      console.log(this.state)
    }
  }

  componentWillUpdate(nextProps, nextState){

  }

//onPress of a factor box...
// set focus on that box (which will start animation)
// determine in higher component which box was pressed



  render(){
    let marginWidth = -2
    let marginParenthesisWidth = -6
    let nameOfActiveButton = this.state[this.state.activeGroup]['activeBox']
    let getName = (nameIndex) => this.state.factorInputGroup.nextOrder[nameIndex]
    let getText = (nameIndex) => this.state.factorInputGroup[getName(nameIndex)]['text']
    return (
      <View style={styles.container}>

        <View style = {{flexDirection:'row', justifyContent:'center', alignItems:'center', flex:1, backgroundColor:'lightblue',}}>
          <Text style={styles.parenthesis}>(</Text>
          <View style = {{marginLeft:marginParenthesisWidth, marginRight:marginWidth}}>
            <RectangularGlowingBorderButton
              name = {getName(0)}
              nameOfActiveButton = {nameOfActiveButton}
              text = {getText(0)}
              onPress = {this.setactiveBox.bind(this)}
              rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
              rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
            />
          </View>
          <View style = {{marginLeft:marginWidth, marginRight:marginWidth}}>
            <CircularGlowingBorderButton
              name = {getName(1)}
              nameOfActiveButton = {nameOfActiveButton}
              text = {getText(1)}
              onPress = {this.setactiveBox.bind(this)}
              rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
              rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
            />
          </View>
          <View style = {{marginLeft:marginWidth, marginRight:marginParenthesisWidth}}>
            <RectangularGlowingBorderButton
              name = {getName(2)}
              nameOfActiveButton = {nameOfActiveButton}
              text = {getText(2)}
              onPress = {this.setactiveBox.bind(this)}
              rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
              rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
            />
          </View>

          <Text style={styles.parenthesis}>)(</Text>

          <View style = {{marginLeft:marginParenthesisWidth, marginRight:marginWidth}}>
            <RectangularGlowingBorderButton
              name = {getName(3)}
              nameOfActiveButton = {nameOfActiveButton}
              text = {getText(3)}
              onPress = {this.setactiveBox.bind(this)}
              rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
              rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
            />
          </View>
          <View style = {{marginLeft:marginWidth, marginRight:marginWidth}}>
            <CircularGlowingBorderButton
              name = {getName(4)}
              nameOfActiveButton = {nameOfActiveButton}
              text = {getText(4)}
              onPress = {this.setactiveBox.bind(this)}
              rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
              rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
            />
          </View>
          <View style = {{marginLeft:marginWidth, marginRight:marginParenthesisWidth}}>
            <RectangularGlowingBorderButton
              name = {getName(5)}
              nameOfActiveButton = {nameOfActiveButton}
              text = {getText(5)}
              onPress = {this.setactiveBox.bind(this)}
              rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
              rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
            />
          </View>
          <Text style={styles.parenthesis}>)</Text>
        </View>




      </View>
    )
  }

  setactiveBox(box){
    this.setState((prevState) => {return{factorInputGroup:{...prevState.factorInputGroup, activeBox: box}}})
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
