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

import * as firebase from 'firebase'

import { MonoText } from '../components/StyledText'
import { getEquation } from '../logic/differenceOfSquares'
import { NumberKeyboard } from '../components/Keyboard'
import { FactorInputGroup } from '../components/FactorInputGroup'
import { RectangularGlowingBorderButton, CircularGlowingBorderButton, BigButton, SquareButton } from '../components/Button'
import { getFactorProblem } from '../logic/differenceOfSquares'

export default class FactorQuizScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.title+': '+navigation.state.params.difficulty,
  })

  getInitialState( prevState={} ){
    let currentStreak = prevState.currentStreak ? prevState.currentStreak : 'loading...'
    let maxStreak = prevState.maxStreak ? prevState.maxStreak : 'loading...'
    return {
      lastKeyPressed : {keyValue:'blank', time:Date.now()},
      keyboardMode : 'Submit',
      currentStreak : currentStreak,
      maxStreak : maxStreak,
    }
  }
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  restoreInitialState(){
    this.setState( (prevState) => {
      return this.getInitialState(prevState)
    })
  }

  componentDidMount(){
    firebase.database().goOnline()
    let user = firebase.auth().currentUser
    this.userRef = firebase.database().ref('users/'+user.uid)

    this.currentStreakRef = firebase.database().ref('users/'+user.uid+'/currentStreak')
    this.maxStreakRef = firebase.database().ref('users/'+user.uid+'/maxStreak')

    this.currentStreakRef.on('value', (snapshot)=>{
      this.setState({currentStreak:snapshot.val()})
      this.userRef.update({ //for testing
        maxStreak: 'test'
      })
    })

    this.maxStreakRef.on('value', (snapshot)=>{
      this.setState({maxStreak:snapshot.val()})
    })
    //firebase.database().goOffline()
  }

  componentWillUnmount(){
    if(this.currentStreakRef) this.currentStreakRef.off()
    if(this.maxStreakRef) this.maxStreakRef.off()
  }

  setKeyValue(keyValue) {
    this.setState({lastKeyPressed:{keyValue: keyValue, time:Date.now()}})
  }

  onCorrectSubmission(){
    this.addCorrectResponseToDatabase()
    this.setState({keyboardMode:'Next'})
  }

  onIncorrectSubmission(){
    this.addIncorrectResponseToDatabase()
  }

  onNextProblem(){
    this.restoreInitialState()
  }

  addIncorrectResponseToDatabase(){
    this.userRef.update({
      currentStreak: 0
    })
  }

  addCorrectResponseToDatabase(){
    let currentStreak = this.state.currentStreak
    let maxStreak = this.state.maxStreak
    this.userRef.update({
      currentStreak: currentStreak+1,
      maxStreak: maxStreak > currentStreak+1 ? maxStreak : currentStreak+1,
    })
  }

  render() {
    console.log('Navigation PROPSOJOERHGO: '+this.props.navigation.state)
    return (
      <View style={{flex:1, flexDirection:'column', backgroundColor:'transparent'}}>
        <View style={{flexGrow:6, flexDirection:'column'}}>
          <ScrollView style={{flex:1, flexDirection : 'column',}}>
            <FactorDisplay
              lastKeyPressed={this.state.lastKeyPressed}
              onCorrectSubmission={()=>this.onCorrectSubmission()}
              onIncorrectSubmission={()=>this.onIncorrectSubmission()}
              onNextProblem={()=>this.onNextProblem()}
              mode={this.props.navigation.state.params.mode}
              difficulty={this.props.navigation.state.params.difficulty}
              userData={ {currentStreak:this.state.currentStreak, maxStreak:this.state.maxStreak} } />
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

  getFactorProblem(factorable){
    console.log('Passed mode and difficulty: '+this.props.mode+this.props.difficulty)
    return getFactorProblem(this.props.mode, factorable, this.props.difficulty)
  }

  decideIfFactorable(){
    let getRandomInt = (min, max)=> (Math.floor(Math.random() * (max - min + 1)) + min)
    return getRandomInt(0,1)===0 ? true : false
  }

  constructor(props) {
    super(props)
    let factorProblem = this.getFactorProblem(this.decideIfFactorable())
    this.state = {
      activeGroup : 'factorInputGroup',
      nextOrder : ['factorInputGroup','factorInputGroup2'],
      factorProblem : factorProblem,
      correct : false,
      restoreInitialStateOfFactorGroup: null,
      displaySubmissionFeedback: false,
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
    this.setState({displaySubmissionFeedback:true})
    if(!this.state.factorProblem.factorable || submittedExpression=='No Solution'){
      if(!this.state.factorProblem.factorable && submittedExpression=='No Solution'){
        this.onCorrectSubmission()
      }else{
        this.onIncorrectSubmission()
      }
    }else{
      let actualText1 = this.state.factorProblem.factoredExpression.text1
      let actualText2 = this.state.factorProblem.factoredExpression.text2
      let submittedText1 = '('+submittedExpression.firstSumLeftSummand.text+submittedExpression.firstSumMiddleSign.text+submittedExpression.firstSumRightSummand.text+')'
      let submittedText2 = '('+submittedExpression.secondSumLeftSummand.text+submittedExpression.secondSumMiddleSign.text+submittedExpression.secondSumRightSummand.text+')'
      if((submittedText1==actualText1 && submittedText2==actualText2) ||
        (submittedText1==actualText2 && submittedText2==actualText1)     ){
        this.onCorrectSubmission()
      }else{
        this.onIncorrectSubmission()
      }
    }

  }

  onCorrectSubmission(){
    this.setState({correct : true})
    this.props.onCorrectSubmission()
  }

  onIncorrectSubmission(){
    this.setState({correct : false})
    this.props.onIncorrectSubmission()
  }

  onMultipliedOutExpressionSubmit(){

  }

  componentWillReceiveProps(nextProps){
    console.log('Last logged key value:   '+nextProps.lastKeyPressed.keyValue)
    let lastKey = nextProps.lastKeyPressed.keyValue
    if(lastKey!='Submit' && lastKey!='No Solution') this.setState({displaySubmissionFeedback:false})
  }

  render(){
    console.log(this.state.factorProblem)
    return (
      <View style={styles.container}>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}><View style={styles.expressionView} >
            <Text style={styles.factorItFont}>Factor It!</Text>
            <Text style={styles.expressionMathFont}>{this.state.factorProblem.equation.text}</Text>
          </View></View>
          <FactorInputGroup
            lastKeyPressed={this.props.lastKeyPressed}
            enabled={this.state.nextOrder[0]===this.state.activeGroup}
            onPress={this.onGroupPress.bind(this, this.state.nextOrder[0])}
            onSubmit={this.onFactoredExpressionSubmit.bind(this)}
            onNextProblem={()=>this.restoreInitialStateOfFactorGroup()}
            restoreInitialStateTrigger={this.state.restoreInitialStateOfFactorGroup} />
            {this.state.displaySubmissionFeedback && <Text style={{fontFamily:'math-font', fontSize:50, textAlign:'center'}}>{this.state.correct ? 'Correct!' : 'Try Again'}</Text>}
            <Text style={{fontFamily:'math-font', fontSize:15,}}>{'Current Streak: '+this.props.userData.currentStreak+'.\nMax Streak: '+this.props.userData.maxStreak+'.'}</Text>
      </View>

    )
  }

  restoreInitialStateOfFactorGroup(){
    this.props.onNextProblem()
    this.setState({
      restoreInitialStateOfFactorGroup: Date.now(),
      correct: false,
      factorProblem: this.getFactorProblem(this.decideIfFactorable()),
    })
  }


}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection : 'column',
    justifyContent : 'center',
    backgroundColor:'transparent'
  },
  buttonGroupContainer : {
    flexDirection : 'row',
    margin : 10,
    justifyContent : 'center',
  },
  expressionMathFont: {
    fontFamily : 'math-font-narrow',
    fontSize : 60,
    color:'black',
  },
  factorItFont : {
    fontFamily : 'math-font',
    fontSize : 20,
    color : 'dodgerblue',
  },
  expressionView: {
    backgroundColor : 'white',
    alignSelf : 'center',
    paddingLeft:20,
    paddingRight:20,
    borderWidth:1,
    borderBottomRightRadius:20,
    borderTopLeftRadius:20,
    borderColor:'black',
    margin:10,
    minWidth:250,
    alignItems:'center',
    paddingTop:5,
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
