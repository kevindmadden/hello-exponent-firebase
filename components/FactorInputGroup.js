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

import { respondToKeyPress, onPress } from '../components/RespondToKeyPress'
import { RectangularGlowingBorderButton, CircularGlowingBorderButton } from '../components/Button'

export class FactorInputGroup extends React.Component {

  //options: acceptsVariable, acceptsSquaredVariable, acceptsNumeral, acceptsSign, leadingSignBox (this is for when there is a sign box at the very front)
  getInitialState(){
    return {
        activeBox: 'firstSumLeftSummand',
        firstSumLeftSummand:    { text:'', acceptsVariable:true, acceptsNumeral:true },
        firstSumMiddleSign:     { text:'', acceptsSign:true },
        firstSumRightSummand:   { text:'', acceptsNumeral:true },
        secondSumLeftSummand:   { text:'', acceptsVariable:true, acceptsNumeral:true },
        secondSumMiddleSign:    { text:'', acceptsSign:true },
        secondSumRightSummand:  { text:'', acceptsNumeral:true },
        nextOrder: ['firstSumLeftSummand', 'firstSumMiddleSign', 'firstSumRightSummand', 'secondSumLeftSummand', 'secondSumMiddleSign', 'secondSumRightSummand'],
        maxNumberSize : 3,
    }
  }

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  restoreInitialState(){
    this.setState(this.getInitialState())
  }

  componentWillReceiveProps(nextProps){
    if(this.props.enabled && !nextProps.enabled){
      this.setState({activeBox:null}) //there is no default box in a group if you go back to that group after it has already been the enabled group
    }
    if(this.props.enabled) respondToKeyPress.call(this, nextProps, 'factorGroup')

    //reset to initial state if trigger changes
    if(this.props.restoreInitialStateTrigger!==nextProps.restoreInitialStateTrigger) this.restoreInitialState()
  }

  getName = (nameIndex) => this.state.nextOrder[nameIndex]
  getText = (nameIndex) => this.state[this.getName(nameIndex)]['text']
  getNameOfActiveButton = () => this.props.enabled ? this.state.activeBox : null

  render() {
    return (
      <View style = {{flexDirection:'row', justifyContent:'center', alignItems:'center', flex:1, backgroundColor:'darkturquoise',}}>
        <Text style={styles.parenthesis}>(</Text>

        <View style = {styles.leftParenthesisMargin}>
          <RectangularGlowingBorderButton
            name = {this.getName(0)}
            nameOfActiveButton = {this.getNameOfActiveButton()}
            text = {this.getText(0)}
            onPress = {onPress.bind(this)}
            rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
            rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
          />
        </View>
        <View style = {styles.middleMargin}>
          <CircularGlowingBorderButton
            name = {this.getName(1)}
            nameOfActiveButton = {this.getNameOfActiveButton()}
            text = {this.getText(1)}
            onPress = {onPress.bind(this)}
            rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
            rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
          />
        </View>
        <View style = {styles.rightParenthesisMargin}>
          <RectangularGlowingBorderButton
            name = {this.getName(2)}
            nameOfActiveButton = {this.getNameOfActiveButton()}
            text = {this.getText(2)}
            onPress = {onPress.bind(this)}
            rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
            rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
          />
        </View>

        <Text style={styles.parenthesis}>)(</Text>

        <View style = {styles.leftParenthesisMargin}>
          <RectangularGlowingBorderButton
            name = {this.getName(3)}
            nameOfActiveButton = {this.getNameOfActiveButton()}
            text = {this.getText(3)}
            onPress = {onPress.bind(this)}
            rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
            rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
          />
        </View>
        <View style = {styles.middleMargin}>
          <CircularGlowingBorderButton
            name = {this.getName(4)}
            nameOfActiveButton = {this.getNameOfActiveButton()}
            text = {this.getText(4)}
            onPress = {onPress.bind(this)}
            rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
            rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
          />
        </View>
        <View style = {styles.rightParenthesisMargin}>
          <RectangularGlowingBorderButton
            name = {this.getName(5)}
            nameOfActiveButton = {this.getNameOfActiveButton()}
            text = {this.getText(5)}
            onPress = {onPress.bind(this)}
            rgbaFadeColor = 'rgba(255, 128, 0, 0.0)'
            rgbaGlowColor = 'rgba(255, 128, 0, 0.8)'
          />
        </View>

        <Text style={styles.parenthesis}>)</Text>
      </View>
    )
  }


}

const styles = StyleSheet.create({
  parenthesis : {
    fontFamily : 'math-font-narrow',
    fontSize : 60,
    backgroundColor : 'transparent',
  },
  leftParenthesisMargin : {
    marginLeft : -6,
    marginRight : -2,
  },
  rightParenthesisMargin : {
    marginLeft : -2,
    marginRight : -6,
  },
  middleMargin : {
    marginLeft : -2,
    marginRight : -2,
  }
})
