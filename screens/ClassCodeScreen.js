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
  Picker,
  Slider,
} from 'react-native';

import { BigButton, SquareButton, FlexKey, MathButton } from '../components/Button';
import { MonoText } from '../components/StyledText';
import { getFactoredEquation } from '../logic/differenceOfSquares';
import DifficultyOverlay from '../screens/DifficultyOverlay'
import { getModeDifficultyKey, STREAK, MODE, DIFFICULTY, MISTAKE } from '../database/userDataDefinitions'
import { connect } from 'react-redux'
import { generateClassCode, joinClassCodeGroup, startClassCodeGroupListener } from '../actions/mainActions'

import * as firebase from 'firebase';

const mapStateToProps = (state, ownProps) => {
  return {
    keyPressed: state.keyboard.keyPressed,
    keyPressedAtTime: state.keyboard.keyPressedAtTime,
    classStatistics: state.classStatistics, //TODO:Remove hard-coded difficulty mode
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    generateClassCode: () => {
      dispatch(generateClassCode())
    },
    joinClassCodeGroup: (classCode) => {
      dispatch(joinClassCodeGroup(classCode))
    },
    startClassCodeGroupListener: (classCode, modeDifficultyKey) =>{
      dispatch(startClassCodeGroupListener(classCode, modeDifficultyKey))
    },
  }
}

export class ClassCodeScreenPresentation extends React.Component {

  //TODO: Cannot see header on this page
  static navigationOptions = {
    //header:null, //remove this line to display header
    headerTitle: 'Class Code Information',
  }

  constructor(props) {
    super(props)
    this.state = {
      equation: {equationString:'Placeholder'},
      keyValue:'',
      showOverlay:false,
      lastSelectedMode:'differenceOfSquares',
      lastSelectedTitle:'Simple',
      lastSelectedColor:'palegreen',
      text: '',
      difficulty: DIFFICULTY.EASY,
      mode: MODE.DIFFERENCE_OF_SQUARES,
      modeDifficultyKey: getModeDifficultyKey(MODE.DIFFERENCE_OF_SQUARES, DIFFICULTY.EASY),
    }

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }


  render() {
    return (

      <View style={{flex:1, flexDirection:'column', backgroundColor:'lightblue'}}>
      <ScrollView contentContainerStyle={{flexGrow:1, justifyContent:'center'}} >

        <View style={styles.buttonGroupContainer}>
          <MathButton
            backgroundColor='palegreen'
            textTop='Generate'
            textBottom='Class Code'
            width={250}
            flexShrink={1}
            onPress={() => this.props.generateClassCode()}
          />
        </View>

        <View style={styles.buttonGroupContainer}>
          <Text>Enter Class Code:</Text>

          <TextInput
            style={{height: 40, width: 100, marginLeft: 5, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            keyboardType='numeric'
          />
        </View>

        <View style={styles.buttonGroupContainer}>
          <MathButton
            backgroundColor='lightsalmon'
            textTop='Join Class'
            textBottom='Enter code, then press button'
            width={250}
            flexShrink={1}
            onPress={() => this.props.joinClassCodeGroup(this.state.text)}
          />
        </View>

        <Text>{this.state.modeDifficultyKey}</Text>
        <View style={{flexDirection:'row', flex:1}}>
        <Picker
          style={{borderWidth:10, width:175,}}
          prompt='test prompt'
          mode='dialog'
          selectedValue={this.state.mode}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({mode: itemValue})
            this.setState((prevState) => {return {modeDifficultyKey: getModeDifficultyKey(prevState.mode, prevState.difficulty)} })
          }}
        >
          <Picker.Item label="x^2+c" value={MODE.DIFFERENCE_OF_SQUARES} />
          <Picker.Item label="x^2+bx+c" value={MODE.TRINAOMIAL_A_IS_1} />
          <Picker.Item label="ax^2+bx+c" value={MODE.TRINAOMIAL_A_IS_NOT_1} />
        </Picker>
        <Picker
          style={{borderWidth:10, width:175,}}
          prompt='test prompt'
          mode='dialog'
          selectedValue={this.state.difficulty}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({difficulty: itemValue})
            this.setState((prevState) => {return {modeDifficultyKey: getModeDifficultyKey(prevState.mode, prevState.difficulty)} })
          }}
        >
          <Picker.Item label="Easy" value={DIFFICULTY.EASY} />
          <Picker.Item label="Normal" value={DIFFICULTY.NORMAL} />
          <Picker.Item label="Hard" value={DIFFICULTY.HARD} />
          <Picker.Item label="Insane" value={DIFFICULTY.INSANE} />
        </Picker>
        </View>

        <View style={styles.buttonGroupContainer}>
          <MathButton
            backgroundColor='lightcoral'
            textTop='View Class'
            textBottom='Statistics'
            width={250}
            flexShrink={1}
            onPress={() => this.props.startClassCodeGroupListener(this.state.text, this.state.modeDifficultyKey)}
          />
        </View>

        <Text>{JSON.stringify(this.props.classStatistics[this.state.modeDifficultyKey])}</Text>

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
    alignItems : 'center',
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

export const ClassCodeScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassCodeScreenPresentation)
