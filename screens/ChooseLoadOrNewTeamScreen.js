import React from 'react';
import Expo from 'expo'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Picker,
  FlatList,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { MathButton, RectangleSingleLineIconButton, } from '../components/Button';
import { getModeDifficultyKey, STREAK, MODE, DIFFICULTY, MISTAKE } from '../database/userDataDefinitions'
import { connect } from 'react-redux'
import { startClassCodeGroupListener,
  startUpdateClassIDsOwnerListener, createNewClass, } from '../actions/mainActions'
import { CreateNewClassPopup } from '../screens/CreateNewClassPopup'

const mapStateToProps = (state, ownProps) => {
  return {
    classStatistics: state.classStatistics,
    classIDsOwnerList: state.classStatistics.classIDsOwnerList,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    startClassCodeGroupListener: (classCode, modeDifficultyKey) => {
      dispatch(startClassCodeGroupListener(classCode, modeDifficultyKey))
    },
    startMountListeners: () => {
      dispatch(startUpdateClassIDsOwnerListener())
    }
  }
}

export class ChooseLoadOrNewTeamScreenPresentation extends React.Component {

  //TODO: Cannot see header on this page
  static navigationOptions = {
    //header:null, //remove this line to display header
    headerTitle: 'Start Game: Choose Class',
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
      classCode: '',
      newClassName: '',
      difficulty: DIFFICULTY.EASY,
      mode: MODE.DIFFERENCE_OF_SQUARES,
      modeDifficultyKey: getModeDifficultyKey(MODE.DIFFERENCE_OF_SQUARES, DIFFICULTY.EASY),
      createNewClassPopupVisible: false,
    }

  }

  componentDidMount() {
    //this.props.startMountListeners()
  }

  componentWillUnmount() {

  }

  render() {
    return (

      <View style={{flex:1, flexDirection:'column', backgroundColor:'lightblue'}}>
      <ScrollView contentContainerStyle={{flexGrow:1, justifyContent:'center'}} >
      <View style={styles.container}>

      <Text>You do not have any existing saved team configurations. Tap the button below to create team.</Text>
      {/* This will need to be a FlatList of existing saved team configurations */}
      {/*<View style={{flex:1, flexDirection:'row', backgroundColor:'lightblue'}}>
      <FlatList
        data={Object.keys(this.props.classIDsOwnerList).map(objKey => {return {key: objKey, className: this.props.classIDsOwnerList[objKey]['className']}})}
        renderItem={ ({item,index}) =>
        <View style={{borderBottomWidth:1, borderTopWidth:0,}}>
          <RectangleSingleLineIconButton
            icon={<Ionicons name="ios-stats" size={30} color="darkgreen" style={{marginRight:25, marginLeft:15}} />}
            text={<Text style={{fontSize:18,}}>{item.className}</Text>}
            backgroundColor={index%2==0 ? 'white' : 'beige'}
            height={70}
            width={'100%'}
            onPress={()=>{}}
          />
        </View>
        }
      />
      </View>*/}

      <View style={{flex:1,flexDirection:'row', borderBottomWidth:1, borderTopWidth:0,}}>
        <RectangleSingleLineIconButton
          icon={<MaterialIcons name="add-box" size={30} color="darkgreen" style={{marginRight:20, marginLeft:10}} />}
          text={<Text style={{fontSize:18,}}>Pick New Teams</Text>}
          backgroundColor='lightgreen'
          height={70}
          width={'100%'}
          onPress={()=>{}}
        />
      </View>

      </View>
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
})

export const ChooseLoadOrNewTeamScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseLoadOrNewTeamScreenPresentation)
