import React from 'react';
import Expo from 'expo'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';

import { MathButton, } from '../components/Button'
import DifficultyOverlay from '../screens/DifficultyOverlay'
import Popup from '../screens/Popup'
import { connect } from 'react-redux'
import { GetClassCodePopup, } from '../screens/GetClassCodePopup'

const mapStateToProps = (state, ownProps) => {
  return {
    classStatistics: state.classStatistics, //TODO:Remove hard-coded difficulty mode
    classIDsOwnerList: state.classStatistics.classIDsOwnerList,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return { }
}

export class SingleClassMainScreenPresentation extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Class Information: '+navigation.state.params.classID
  })

  constructor(props) {
    super(props)
    this.state = {
      classCodePopupVisible: false,
    }
  }

  componentDidMount() { }

  componentWillUnmount() { }

  render() {
    return (
      <View style={{flex:1, flexDirection:'column', backgroundColor:'lightblue'}}>
      <ScrollView contentContainerStyle={{flexGrow:1, justifyContent:'center'}} >

        <GetClassCodePopup
          onClose={()=>this.setState({classCodePopupVisible: false})}
          visible={this.state.classCodePopupVisible}
          classID={this.props.navigation.state.params.classID}
        />

        <View style={styles.buttonGroupContainer}>
          <MathButton
            backgroundColor='palegreen'
            textTop='Get'
            textBottom='Class Code'
            width={250}
            flexShrink={1}
            onPress={() => this.setState({classCodePopupVisible: true}) }
          />
        </View>

        <View style={styles.buttonGroupContainer}>
          <MathButton
            backgroundColor='lightyellow'
            textTop='View Class'
            textBottom='Statistics'
            width={250}
            flexShrink={1}
            onPress={()=>{this.props.navigation.navigate('StatisticsScreen', {classID: this.props.navigation.state.params.classID} )}}
          />
        </View>

      </ScrollView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  buttonGroupContainer : {
    flexDirection : 'row',
    margin : 10,
  },
})

export const SingleClassMainScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleClassMainScreenPresentation)
