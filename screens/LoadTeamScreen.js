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

export class LoadTeamScreenPresentation extends React.Component {

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
        <CreateNewClassPopup
          onClose={()=>this.setState({createNewClassPopupVisible: false})}
          visible={this.state.createNewClassPopupVisible}
        />

      <View style={{flex:1,flexDirection:'row', borderBottomWidth:1, borderTopWidth:0,}}>
        <RectangleSingleLineIconButton
          icon={<MaterialIcons name="add-box" size={30} color="darkgreen" style={{marginRight:20, marginLeft:10}} />}
          text={<Text style={{fontSize:18,}}>New Class</Text>}
          backgroundColor='lightgreen'
          height={70}
          width={'100%'}
          onPress={()=>this.setState({createNewClassPopupVisible: true})}
        />
      </View>

      {/* FlatList must receive data in the form of an array (hence the need for the below gibberish) */}
      <View style={{flex:1, flexDirection:'row', backgroundColor:'lightblue'}}>
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
            onPress={()=>{this.props.navigation.navigate('ChooseLoadOrNewTeamScreen', {classID: item.key} )}}
          />
        </View>
        }
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

export const LoadTeamScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadTeamScreenPresentation)
