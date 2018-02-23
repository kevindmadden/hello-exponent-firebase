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
import { incrementUserStreakValues, resetUserCurrentStreakValue,
startUserDifficultyListener, stopUserDifficultyListener, stopUserProblemListener, generateNewProblemListener, showLatestProblemListener,
updateCurrentFactorProblem,
changeKeyboardModeToSubmit, changeKeyboardModeToNextProblem, setNewFactorProblem } from '../actions/mainActions'
import { getModeDifficultyKey, STREAK } from '../database/userDataDefinitions'
import { connect } from 'react-redux'

export class FactorQuizScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.title+': '+navigation.state.params.difficulty,
  })

  render() {
    return (
      <View style={{flex:1, flexDirection:'column', backgroundColor:'transparent'}}>
        <View style={{flexGrow:6, flexDirection:'column'}}>
          <ScrollView style={{flex:1, flexDirection : 'column',}}>
            <FactorDisplay
              mode={this.props.navigation.state.params.mode}
              difficulty={this.props.navigation.state.params.difficulty}
            />
          </ScrollView>
        </View>
        <View style={{minHeight:155, flexGrow:2, flexDirection:'column'}}>
          <NumberKeyboard backgroundColor='lightgrey' />
        </View>
      </View>
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  let difficultyMode = getModeDifficultyKey(ownProps.mode,ownProps.difficulty)
  return {
    keyPressed: state.keyboard.keyPressed,
    keyPressedAtTime: state.keyboard.keyPressedAtTime,
    currentStreak: state.userData[difficultyMode][STREAK.CURRENT_STREAK]['value'],
    maxStreak: state.userData[difficultyMode][STREAK.MAX_STREAK]['value'],
    tryingToReconnect: state.database.tryingToReconnect,
    isOnline: state.database.isOnline,
    boxes: state.userData[difficultyMode]['newFactorInputGroupLocalUIState'],
    factorProblem: state.userData[difficultyMode]['factorProblem'],
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  let difficultyMode = getModeDifficultyKey(ownProps.mode,ownProps.difficulty)
  return {
    resetCurrentStreak: () => {
      dispatch(resetUserCurrentStreakValue(difficultyMode))
    },
    incrementStreakValues: () => {
      dispatch(incrementUserStreakValues(difficultyMode))
    },
    turnOnDatabaseListeners: (factorable) => {
      console.log('turning on listnerrs!!!!!!')
      dispatch(startUserDifficultyListener(difficultyMode))
      dispatch(generateNewProblemListener(difficultyMode, ownProps.difficulty, ownProps.mode, factorable))
      dispatch(showLatestProblemListener(difficultyMode))
    },
    turnOffDatabaseListeners: () => {
      console.log('turning OFF listnerrs!!!!!!')
      dispatch(stopUserDifficultyListener(difficultyMode))
      dispatch(stopUserProblemListener(difficultyMode))
    },
    changeKeyboardModeToSubmit: () => {
      dispatch(changeKeyboardModeToSubmit())
    },
    changeKeyboardModeToNextProblem: () => {
      dispatch(changeKeyboardModeToNextProblem())
    },
    setNewFactorProblem: (newFactorProblem) => {
      dispatch(setNewFactorProblem(difficultyMode, newFactorProblem))
    },
    factorProblemIsCorrect: () => {
      dispatch(updateCurrentFactorProblem(difficultyMode, true))
    },
  }
}

class FactorDisplayPresentation extends React.Component {

  componentDidMount(){
    this.props.turnOnDatabaseListeners(this.decideIfFactorable())
    //if(!this.props.factorProblem) this.props.setNewFactorProblem(this.getFactorProblem(this.decideIfFactorable()))
  }

  componentWillUnmount(){
    this.props.turnOffDatabaseListeners()
  }

  getFactorProblem(factorable){
    return getFactorProblem(this.props.mode, factorable, this.props.difficulty)
  }

  decideIfFactorable(){
    let getRandomInt = (min, max)=> (Math.floor(Math.random() * (max - min + 1)) + min)
    return getRandomInt(0,1)===0 ? true : false
  }

  constructor(props) {
    super(props)
    //let factorProblem = this.getFactorProblem(this.decideIfFactorable())
    this.state = {
      activeGroup : 'factorInputGroup',
      nextOrder : ['factorInputGroup','factorInputGroup2'],
      //factorProblem : factorProblem,
      correct : false,
      displaySubmissionFeedback: false,
      submissionFeedback: '',
    }
    this.maxNumberSize = 3 //the number of digits of the biggest number that can be entered in any box
    this.noSquaredVariables = true
  }

  onGroupPress(groupPressed){
    this.setState((prevState)=> {
      return{
        activeGroup: groupPressed
      }
    })
  }

  onFactoredExpressionSubmit(submissionType, submittedExpression){
    this.setState({displaySubmissionFeedback:true})
    if(submissionType=='No Solution'){
      if(!this.props.factorProblem.factorable){
        this.setState({submissionFeedback: 'Correct!'})
        this.onCorrectSubmission()
      }else{
        this.setState({submissionFeedback: 'Try again! There is a solution.'})
        this.onIncorrectSubmission()
      }
    }else{ //if the user submitted a solution

      //Determine if the user left any fields blank that are necessary to fill in order to submit a solution
      let blankValuesDetected = false
      if(submittedExpression.firstSumLeftSummand.text=='' || submittedExpression.firstSumMiddleSign.text=='' ||
         submittedExpression.firstSumRightSummand.text=='' || submittedExpression.secondSumLeftSummand.text=='' ||
         submittedExpression.secondSumMiddleSign.text=='' || submittedExpression.secondSumRightSummand.text==''){
           blankValuesDetected = true }

      //Strings containting the correct solution for each parenthesis: (actualText1)(actualText2)
      let actualText1 = this.props.factorProblem.factoredExpression.text1
      let actualText2 = this.props.factorProblem.factoredExpression.text2
      //Strings containing the solution that user submitted for each parenthesis: (submittedText1))(submittedText2)
      let submittedText1 = '('+submittedExpression.firstSumLeftSummand.text+submittedExpression.firstSumMiddleSign.text+submittedExpression.firstSumRightSummand.text+')'
      let submittedText2 = '('+submittedExpression.secondSumLeftSummand.text+submittedExpression.secondSumMiddleSign.text+submittedExpression.secondSumRightSummand.text+')'

      if(blankValuesDetected){ //Do not penalize the user for accidentally submitting an incomplete solution: just give a warning
        this.setState({submissionFeedback: 'Input Error: You cannot submit an answer with blank boxes.'})
      }else if((submittedText1==actualText1 && submittedText2==actualText2) ||
        (submittedText1==actualText2 && submittedText2==actualText1)     ){ //The user's solution matches the actual solution! (Note that the parenthesis order does not matter.)
        this.setState({submissionFeedback: 'Correct!'})
        this.onCorrectSubmission()
      }else{ //The user submitted a properly formatted solution, but the solution is not correct

        //Check to see if the user made a sign error
        let submittedText1WithPlus = '('+submittedExpression.firstSumLeftSummand.text+'+'+submittedExpression.firstSumRightSummand.text+')'
        let submittedText1WithMinus = '('+submittedExpression.firstSumLeftSummand.text+'-'+submittedExpression.firstSumRightSummand.text+')'
        let submittedText2WithPlus = '('+submittedExpression.secondSumLeftSummand.text+'+'+submittedExpression.secondSumRightSummand.text+')'
        let submittedText2WithMinus = '('+submittedExpression.secondSumLeftSummand.text+'-'+submittedExpression.secondSumRightSummand.text+')'
        if((submittedText1WithPlus==actualText1 && submittedText2WithPlus==actualText2) ||
                 (submittedText1WithPlus==actualText1 && submittedText2WithMinus==actualText2) ||
                 (submittedText1WithMinus==actualText1 && submittedText2WithPlus==actualText2) ||
                 (submittedText1WithMinus==actualText1 && submittedText2WithPlus==actualText2) ){
          this.setState({submissionFeedback: 'Close...! Check your signs.'})
          this.onIncorrectSubmission()
        //Check to see what specific factoring errors were made or if user forgot to include x's in leftSummands
        }else{
          //user will receive input-error prompt if variable is missing; this flag indicates whether this prompt needs to be shown
          let variableMissingFromALeftSummand = false
          //extract number from left summand (this is neccessary beacuse the input field ends in eitehr 'x' or 'x²')
          let convertSubmittedLeftSummand = (fullText) => {
            let numberText
            if(fullText.slice(-1)=='x'){
              numberText=fullText.slice(0,-1)
              numberText= numberText=='' ? '1' : numberText //if user simply enters 'x', there is an implied '1' in front of it (i.e. 1*x)
            }else if(fullText.slice(-1)=='²' && fullText.slice(-2,-1)=='x'){
              numberText=fullText.slice(0,-2)
              numberText= numberText=='' ? '1' : numberText //if user simply enters 'x', there is an implied '1' in front of it (i.e. 1*x)
            }else{
              variableMissingFromALeftSummand = true
              numberText=null //
            }
            return parseInt(numberText,10)
          }
          //extract number from right summand (this is neccesary because the '+' sign can be a part of the submitted string; negative should be kept with the string)
          let convertSubmittedSignedRightSummand = (fullText) => {
            return parseInt(fullText,10)
          }

          //note that convertSubmittedLeftSummand needs to be evaluated prior to checking variableMissingFromALeftSummand flag
          let aVar=this.props.factorProblem.equation.a
          let bVar=this.props.factorProblem.equation.b
          let cVar=this.props.factorProblem.equation.c
          let submittedSum1LeftSummand=convertSubmittedLeftSummand(submittedExpression.firstSumLeftSummand.text)
          let submittedSum1SignedRightSummand=convertSubmittedSignedRightSummand(submittedExpression.firstSumMiddleSign.text+submittedExpression.firstSumRightSummand.text)
          let submittedSum2LeftSummand=convertSubmittedLeftSummand(submittedExpression.secondSumLeftSummand.text)
          let submittedSum2SignedRightSummand=convertSubmittedSignedRightSummand(submittedExpression.secondSumMiddleSign.text+submittedExpression.secondSumRightSummand.text)

          //check if variable is missing from left summand inputs
          if(variableMissingFromALeftSummand){
            this.setState({submissionFeedback: 'Input error: Please include a variable in the left box of each parenthesis.'})
          }else{ //final check for specific types of
            let F_product_error = false
            let OI_product_error = false
            let L_product_error = false
            if((submittedSum1LeftSummand*submittedSum2LeftSummand)!=aVar) F_product_error=true
            if((submittedSum1LeftSummand*submittedSum2SignedRightSummand+submittedSum1SignedRightSummand*submittedSum2LeftSummand)!=bVar) OI_product_error=true
            if((submittedSum1SignedRightSummand*submittedSum2SignedRightSummand)!=cVar) L_product_error=true

            let submissionFeedback = ''
            if(F_product_error){
              submissionFeedback+='F-Product Error, '
            }
            if(OI_product_error){
              submissionFeedback+='OI-Product Error, '
            }
            if(L_product_error){
              submissionFeedback+='L-Product Error, '
            }
            if(!this.props.factorProblem.factorable){
              submissionFeedback+='Tried to solve unsolvable problem'
            }
            submissionFeedback=='' ? 'Try again!' : submissionFeedback
            this.setState({submissionFeedback: submissionFeedback})
            this.onIncorrectSubmission()
          }

        }

      }
    }

  }

  onCorrectSubmission(){
    this.props.factorProblemIsCorrect()
    this.setState({correct : true})
    this.props.incrementStreakValues()
    this.props.changeKeyboardModeToNextProblem()
  }

  onIncorrectSubmission(){
    this.setState({correct : false})
    this.props.resetCurrentStreak()
  }

  componentWillReceiveProps(nextProps){
    let lastKeyPressedPropActuallyChanged = !(this.props.keyPressedAtTime===nextProps.keyPressedAtTime && this.props.keyPressed===nextProps.keyPressed)
    if(lastKeyPressedPropActuallyChanged){
      if(nextProps.keyPressed=='Next Problem'){
        this.getNextProblemAndResetComponent()
        this.props.changeKeyboardModeToSubmit()
      }

      if(nextProps.keyPressed!='Submit' && nextProps.keyPressed!='No Solution'){
        this.setState({displaySubmissionFeedback:false})
      }

      if(nextProps.keyPressed=='Submit') this.onFactoredExpressionSubmit('Submit', this.props.boxes)
      if(nextProps.keyPressed=='No Solution') this.onFactoredExpressionSubmit('No Solution', this.props.boxes)

    }

  }

  /*<Text>Is online: {this.props.isOnline.toString()}</Text>
  <Text>Trying to reconnect: {this.props.tryingToReconnect.toString()}</Text>*/

  render(){
    console.log(this.state.factorProblem)
    return (
      <View style={styles.container}>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}><View style={styles.expressionView} >
          <Text style={styles.factorItFont}>Factor It!</Text>
          {this.props.factorProblem && <Text style={styles.expressionMathFont}>{this.props.factorProblem.equation.text}</Text>}
        </View></View>
        <FactorInputGroup
          enabled={this.state.nextOrder[0]===this.state.activeGroup}
          onPress={this.onGroupPress.bind(this, this.state.nextOrder[0])}
          onSubmit={this.onFactoredExpressionSubmit.bind(this)}
          difficultyMode={getModeDifficultyKey(this.props.mode,this.props.difficulty)} />
        {this.state.displaySubmissionFeedback && <Text style={{fontFamily:'math-font', fontSize:20, textAlign:'center'}}>{this.state.submissionFeedback}</Text>}
        <Text style={{fontFamily:'math-font', fontSize:15,}}>{'Current Streak: '+this.props.currentStreak+'.\nMax Streak: '+this.props.maxStreak+'.'}</Text>
      </View>
    )
  }

  getNextProblemAndResetComponent(){
    //this.props.setNewFactorProblem(this.getFactorProblem(this.decideIfFactorable()))
    this.setState({
      correct: false,
      displaySubmissionFeedback:false,
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

export const FactorDisplay = connect(
  mapStateToProps,
  mapDispatchToProps
)(FactorDisplayPresentation)
