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
  TouchableWithoutFeedback,
  View,
  Animated,
  Easing,
} from 'react-native'

import { MonoText } from '../components/StyledText'
import { getEquation } from '../logic/differenceOfSquares'
import { NumberKeyboard } from '../components/Keyboard'
import { FactorInputGroup } from '../components/FactorInputGroup'
import { RectangularGlowingBorderButton, CircularGlowingBorderButton, BigButton, SquareButton } from '../components/Button'
import { getFactorProblem } from '../logic/differenceOfSquares'

export default class EasyScreen extends React.Component {

  static navigationOptions = {
    headerTitle: 'Easy',
  }

  getInitialState(){
    return {
      lastKeyPressed:{keyValue:'blank', time:Date.now()},
      keyboardMode:'Submit',
    }
  }
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  restoreInitialState(){
    this.setState(this.getInitialState())
  }

  setKeyValue(keyValue) {
    this.setState({lastKeyPressed:{keyValue: keyValue, time:Date.now()}})
  }

  onCorrectSubmission(){
    this.setState({keyboardMode:'Next'})
  }

  onNextProblem(){
    this.restoreInitialState()
  }

  render() {
    return (

      <View style={{flex:1, flexDirection:'column',}}>
        <View style={{flexGrow:6, flexDirection:'column'}}>
          <ScrollView style={{flex:1, flexDirection : 'column',}}>
            <FactorDisplay
              lastKeyPressed={this.state.lastKeyPressed}
              onCorrectSubmission={()=>this.onCorrectSubmission()}
              onNextProblem={()=>this.onNextProblem()} />
          </ScrollView>
        </View>
        <View style={{minHeight:155, flexGrow:2, flexDirection:'column'}}>
          <NumberKeyboard onPress={this.setKeyValue.bind(this)} backgroundColor='lightgrey' mode={this.state.keyboardMode} />
        </View>
      </View>
    )
  }

}

class FactorDisplay extends React.Component {

  getFactorProblem(){
    return getFactorProblem('differenceOfSquares', true, 1)
  }

  constructor(props) {
    super(props)
    let factorProblem = this.getFactorProblem()
    this.state = {
      activeGroup : 'factorInputGroup',
      nextOrder : ['factorInputGroup','factorInputGroup2'],
      factorProblem : factorProblem,
      correct : false,
      restoreInitialStateOfFactorGroup: null,
    }
    this.maxNumberSize = 3 //the number of digits of the biggest number that can be entered in any box
    this.noSquaredVariables = true
  }


  componentWillReceiveProps(nextProps){
    //respondToKeyPress.call(this, nextProps, 'group')
  }

  componentWillUpdate(nextProps, nextState){

  }

//onPress of a factor box...
// set focus on that box (which will start animation)
// determine in higher component which box was pressed

  onGroupPress(groupPressed){
    this.setState((prevState)=> {
      return{
        activeGroup: groupPressed
      }
    }, console.log(this.state))
  }

  onFactoredExpressionSubmit(submittedExpression){
    let actualText1 = this.state.factorProblem.factoredExpression.text1
    let actualText2 = this.state.factorProblem.factoredExpression.text2
    let submittedText1 = '('+submittedExpression.firstSumLeftSummand.text+submittedExpression.firstSumMiddleSign.text+submittedExpression.firstSumRightSummand.text+')'
    let submittedText2 = '('+submittedExpression.secondSumLeftSummand.text+submittedExpression.secondSumMiddleSign.text+submittedExpression.secondSumRightSummand.text+')'
    console.log('Submitted:'+submittedText1+submittedText2)
    console.log('Actual:'+actualText1+actualText2)
    if((submittedText1==actualText1 && submittedText2==actualText2) ||
      (submittedText1==actualText2 && submittedText2==actualText1)     ){
        this.setState({correct : true})
        this.props.onCorrectSubmission()
    }else{
      this.setState({correct : false})
    }
  }

  onMultipliedOutExpressionSubmit(){

  }

  render(){

    return (
      <View style={styles.container}>
          <Text style={styles.parenthesis}>{this.state.factorProblem.equation.text}</Text>
          <FactorInputGroup
            lastKeyPressed={this.props.lastKeyPressed}
            enabled={this.state.nextOrder[0]===this.state.activeGroup}
            onPress={this.onGroupPress.bind(this, this.state.nextOrder[0])}
            onSubmit={this.onFactoredExpressionSubmit.bind(this)}
            onNextProblem={()=>this.restoreInitialStateOfFactorGroup()}
            restoreInitialStateTrigger={this.state.restoreInitialStateOfFactorGroup} />
            <Text>{this.state.correct ? 'correct' : 'incorrect'}</Text>
      </View>

    )
  }

  restoreInitialStateOfFactorGroup(){
    this.props.onNextProblem()
    this.setState({
      restoreInitialStateOfFactorGroup: Date.now(),
      correct: false,
      factorProblem: this.getFactorProblem(),
    })
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
