import React from 'react';
import Expo from 'expo'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { FontAwesome, } from '@expo/vector-icons';
import { MathButton, RectangleMathButton, } from '../components/Button'
import DifficultyOverlay from '../screens/DifficultyOverlay'
import Popup from '../screens/Popup'
import { getModeDifficultyKey, MODE, DIFFICULTY, } from '../database/userDataDefinitions'
import { connect } from 'react-redux'
import { GetClassCodePopup, } from '../screens/GetClassCodePopup'
import { RectangleSingleLineIconButton, } from '../components/Button';
import { startClassCodeGroupListener, } from '../actions/mainActions'

const mapStateToProps = (state, ownProps) => {
  return {
    classStatistics: state.classStatistics[ownProps.navigation.state.params.classID], //TODO:Remove hard-coded difficulty mode
    classIDsOwnerList: state.classStatistics.classIDsOwnerList,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    startClassCodeGroupListener: (modeDifficultyKey) => {
      if(modeDifficultyKey!=null) dispatch(startClassCodeGroupListener(ownProps.navigation.state.params.classID, modeDifficultyKey))
    },
  }
}

export class StatisticsScreenPresentation extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Statistics'
  })

  constructor(props) {
    super(props)
    this.state = {
      showChangeModeDifficulty: false,
      selectedMode:'',
      selectedDifficulty:'',
    }
  }

  componentDidMount() { }

  componentWillUnmount() { }

  render() {
    return (
      <TouchableWithoutFeedback onPress={()=>this.setState({showChangeModeDifficulty:false})}>
      <View style={{flex:1, flexDirection:'column', backgroundColor:'lightblue'}}>
      <ScrollView contentContainerStyle={{flexGrow:1, }} >
        <View style={{flexDirection:'row', borderBottomWidth:1, borderTopWidth:1,}}>
          <RectangleSingleLineIconButton
            icon={<FontAwesome name="exchange" size={30} color="navy" style={{marginRight:20, marginLeft:10}} />}
            text={<Text style={{fontSize:18,}}>{'Tap To Change Mode/Difficulty'}</Text>}
            backgroundColor='lightyellow'
            height={60}
            width={'100%'}
            onPress={()=>this.setState({showChangeModeDifficulty: true})}
          />
        </View>
          {this.state.showChangeModeDifficulty && this.getChangeModeDifficultyComponent()}
        <Text>{this.state.selectedMode+', '+this.state.selectedDifficulty}</Text>
        {this.getModeDifficultyKey()!=null && <View>{this.getClassStatisticsText(this.props.classStatistics, this.getModeDifficultyKey() )}</View>}
      </ScrollView>
      </View>
      </TouchableWithoutFeedback>
    )
  }

  getModeDifficultyKey(){
    if(this.state.selectedMode=='' || this.state.selectedDifficulty=='') return null
    return getModeDifficultyKey(this.state.selectedMode, this.state.selectedDifficulty)
  }

  onChangeMode(mode){
    this.setState(
      {selectedMode: mode},
      () => this.props.startClassCodeGroupListener(this.getModeDifficultyKey())
    )
  }

  onChangeDifficulty(difficulty){
    this.setState(
      {selectedDifficulty: difficulty},
      () => this.props.startClassCodeGroupListener(this.getModeDifficultyKey())
    )
  }

  getChangeModeDifficultyComponent(){
    return (
      <View style={{flexDirection:'row'}}>

        <View style={{flex:0}} />
        <View style={styles.factorItModes}>
          <View style={{borderWidth:1, borderTopWidth:0, borderRightWidth:0,}}>
          <RectangleMathButton
            backgroundColor={this.state.selectedMode==MODE.DIFFERENCE_OF_SQUARES ? 'aqua' : 'white'}
            textTop='Simple'
            textBottom='x²±c'
            width={'100%'}
            height={60}
            onPress={ () => this.onChangeMode(MODE.DIFFERENCE_OF_SQUARES) }
          />
          </View>
          <View style={{borderWidth:1, borderTopWidth:0, borderRightWidth:0,}}>
          <RectangleMathButton
            backgroundColor={this.state.selectedMode==MODE.TRINAOMIAL_A_IS_1 ? 'aqua' : 'white'}
            textTop='Moderate'
            textBottom='x²±bx±c'
            width={'100%'}
            height={60}
            onPress={ () => this.onChangeMode(MODE.TRINAOMIAL_A_IS_1) }
          />
          </View>
          <View style={{borderWidth:1, borderTopWidth:0, borderRightWidth:0,}}>
          <RectangleMathButton
            backgroundColor={this.state.selectedMode==MODE.TRINAOMIAL_A_IS_NOT_1 ? 'aqua' : 'white'}
            textTop='Complex'
            textBottom='ax²±bx±c'
            width={'100%'}
            height={60}
            onPress={ () => this.onChangeMode(MODE.TRINAOMIAL_A_IS_NOT_1) }
          />
          </View>
        </View>
        <View style={styles.factorItModes}>
          <View style={{borderWidth:1, borderTopWidth:0,}}>
          <RectangleMathButton
            backgroundColor={this.state.selectedDifficulty==DIFFICULTY.EASY ? 'lightgreen' : 'white'}
            textTop='Easy'
            textBottom=''
            width={'100%'}
            height={60}
            onPress={ () => this.onChangeDifficulty(DIFFICULTY.EASY) }
          />
          </View>
          <View style={{borderWidth:1, borderTopWidth:0,}}>
          <RectangleMathButton
            backgroundColor={this.state.selectedDifficulty==DIFFICULTY.NORMAL ? 'lightgreen' : 'white'}
            textTop='Normal'
            textBottom=''
            width={'100%'}
            height={60}
            onPress={ () => this.onChangeDifficulty(DIFFICULTY.NORMAL) }
          />
          </View>
          <View style={{borderWidth:1, borderTopWidth:0,}}>
          <RectangleMathButton
            backgroundColor={this.state.selectedDifficulty==DIFFICULTY.HARD ? 'lightgreen' : 'white'}
            textTop='Hard'
            textBottom=''
            width={'100%'}
            height={60}
            onPress={ () => this.onChangeDifficulty(DIFFICULTY.HARD) }
          />
          </View>
        </View>
        <View style={{flex:0}} />
      </View>
    )
  }

  //Previously used instead: <Text>{JSON.stringify(this.props.classStatistics[this.state.modeDifficultyKey])}</Text>
  getClassStatisticsText(statsObj, modeDifficultyKey){
    if(statsObj == null || statsObj[modeDifficultyKey] == null) return <Text>{''}</Text>

    let getStatsData = () => (
      Object.keys(statsObj[modeDifficultyKey]).map( (user, index) => {

        let problemsCounter = statsObj[modeDifficultyKey][user]['problemsCounter']
        let numEventuallyCorrect = statsObj[modeDifficultyKey][user]['numCorrect']
        let numIncorrect = statsObj[modeDifficultyKey][user]['numMistakes']

        let percentCorrectOnFirstAttempt = (numEventuallyCorrect-numIncorrect)/problemsCounter*100
        let percentEventuallyCorrect = numEventuallyCorrect/problemsCounter*100
        let percentIncorrect = numIncorrect/problemsCounter*100

        return(
          <View style={{flexDirection:'row', alignItems:'stretch', height:50,}}>
            <StatsRowName name={statsObj[modeDifficultyKey][user]['identity']} />
            <StatsRowNumber isPercent number={percentCorrectOnFirstAttempt} />
            <StatsRowNumber isPercent number={percentEventuallyCorrect} />
            <StatsRowNumber isPercent number={percentIncorrect} />
            <StatsRowNumber number={problemsCounter} />

          </View>
        )
      })
    )

    let getStatsHeader = () => (
      <View style={{flexDirection:'row', alignItems:'stretch', height:50, borderBottomWidth:1,}}>
        <StatsRowName isHeader columnName='Name' />
        <StatsRowNumber isHeader columnName='Correct On First Try' />
        <StatsRowNumber isHeader columnName='Eventually Correct' />
        <StatsRowNumber isHeader columnName='Wrong' />
        <StatsRowNumber isHeader columnName='Problems Attempted' />
      </View>
    )

    return(
      <ScrollView horizontal>
        <View>
        {getStatsHeader()}
        {getStatsData()}
        {getStatsData()}
        {getStatsData()}
        {getStatsData()}
        {getStatsData()}
        {getStatsData()}
        {getStatsData()}
        {getStatsData()}
        {getStatsData()}
        {getStatsData()}
        {getStatsData()}
        {getStatsData()}
        </View>
      </ScrollView>
    )

    let statsString = ''
    for(const user in statsObj[modeDifficultyKey]){
      statsString+=('User: '+statsObj[modeDifficultyKey][user]['identity']+'\n')
      for(const statItem in statsObj[modeDifficultyKey][user]){
        if(statItem=='identity'){
          //skip: this is already shown at the very top of each user instead of the firebaseuid
        }else if(statItem=='numOfMistakeTypes'){
          statsString+='Mistake Types: \n'
          for(const statItem2 in statsObj[modeDifficultyKey][user][statItem]){
            statsString+=('   '+statItem2+': '+statsObj[modeDifficultyKey][user][statItem][statItem2]+'\n')
          }
        }else{
          statsString+=(statItem+': '+statsObj[modeDifficultyKey][user][statItem]+'\n')
        }
      }
      statsString+='\n'
    }
    return statsString
  }

}

StatsRowName = (props) => {
  let columnWidth = 140
  let viewStyle = {width:columnWidth, flexDirection:'row', alignItems:'center', justifyContent:'flex-start', backgroundColor:'lightsalmon'}

  if(props.isHeader){
    return(
      <View style={viewStyle}>
        <Text>{props.columnName}</Text>
      </View>
    )
  }else{
    return(
      <View style={viewStyle}>
        <Text>{props.name}</Text>
      </View>
    )
  }
}

StatsRowNumber = (props) => {
  let columnWidth = 80
  let viewStyle = {borderRightWidth:1, width:columnWidth, flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:'lightyellow'}

  if(props.isHeader){
    return(
      <View style={viewStyle}>
        <Text>{props.columnName}</Text>
      </View>
    )
  }else{
    return(
      <View style={viewStyle}>
        <Text>{props.isPercent ? props.number+'%' : props.number}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonGroupContainer : {
    flexDirection : 'row',
    margin : 10,
  },
  factorItModes : {
    flexDirection : 'column',
    flex:1,
  },
})

export const StatisticsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(StatisticsScreenPresentation)
