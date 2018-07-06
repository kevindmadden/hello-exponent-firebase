import React from 'react';
import {
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
  BackHandler,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'

export default class TurfGameScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  //create grid object in reduc state
  onComponentDidMount(){
    //call initial load of grid box coloring
    //sibscribe to listen to firebase changes to the grid
  }

  //animationType can also be 'fade'
  render(){
    return(
      grid.map((row,rowIndex) =>
        row.map((cell,colIndex) =>
          <GridBox key=([rowIndex,colIndex]).toString() owner={cell.owner} attackers={cell.attackers} />
        )
      )
    )
  }

}

class GridBox extends React.Component {
  render(){
    return(

    )
  }

}
