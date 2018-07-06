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
import { FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import { MathButton, RectangleMathButton, } from '../components/Button'
import DifficultyOverlay from '../screens/DifficultyOverlay'
import Popup from '../screens/Popup'
import { getModeDifficultyKey, MODE, MODEDISPLAY, DIFFICULTY, DIFFICULTYDISPLAY, } from '../database/userDataDefinitions'
import { connect } from 'react-redux'
import { ColumnExplanationsPopup } from '../screens/ColumnExplanationsPopup'
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
      modeTextTop:'',
      modeTextBottom:'',
      difficultyText:'',
      visibleTab:'overview',
      columnExplanationsPopupVisible:false,
      columnExplanationsPopupDescriptors:'main',
    }
  }

  componentDidMount() { }

  componentWillUnmount() { }

  getChangeModeDifficultyText(){
    if(this.state.modeTextTop=='' || this.state.modeTextBottom=='' || this.state.difficultyText==''){
      if(!this.state.showChangeModeDifficulty){
        return <Text style={{fontSize:18,}}>{'Tap to Set Mode/Difficulty'}</Text>
      }
    }
    if(this.state.showChangeModeDifficulty){
      return(
        <View style={{flexDirection:'column'}}>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
            <Text style={{fontSize:25,fontFamily:'math-font',}}>{this.state.modeTextBottom+''}</Text>
            {this.state.modeTextBottom!='' && this.state.difficultyText!='' && <Text style={{fontSize:25,marginBottom:-10,marginTop:-10,marginLeft:5,marginRight:5,fontFamily:'math-font',}}>{'|'}</Text>}
            <Text style={{fontSize:25,fontFamily:'math-font',}}>{this.state.difficultyText}</Text>
          </View>
          <Text style={{fontSize:12,fontFamily:'math-font',}}>{'Tap to Hide'}</Text>
        </View>
      )
    }else{
      return(
        <View style={{flexDirection:'column'}}>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
            <Text style={{fontSize:25,fontFamily:'math-font',}}>{this.state.modeTextBottom+''}</Text>
            <Text style={{fontSize:25,marginBottom:-10,marginTop:-10,marginLeft:5,marginRight:5,fontFamily:'math-font',}}>{'|'}</Text>
            <Text style={{fontSize:25,fontFamily:'math-font',}}>{this.state.difficultyText}</Text>
          </View>
          <Text style={{fontSize:12,fontFamily:'math-font',}}>{'Tap to Change'}</Text>
        </View>
      )
    }
  }

  render() {
    return (

      <View style={{flex:1, flexDirection:'column', backgroundColor:'grey', borderWidth:0,}}>
        <ColumnExplanationsPopup
          onClose={()=>this.setState({columnExplanationsPopupVisible: false})}
          visible={this.state.columnExplanationsPopupVisible}
          screen={this.state.columnExplanationsPopupDescriptors}
        />
        <View style={{flexDirection:'row', height:70, borderBottomWidth:5, borderTopWidth:3, elevation:5, borderColor:'navy',}}>
          <RectangleSingleLineIconButton
            icon={<FontAwesome name="exchange" size={30} color="navy" style={{marginRight:20, marginLeft:10}} />}
            text={this.getChangeModeDifficultyText()}
            backgroundColor='lightyellow'
            height={60}
            width={'100%'}
            onPress={()=>this.setState((prevState) => { return{showChangeModeDifficulty: !prevState.showChangeModeDifficulty} })}
          />
        </View>
          {this.state.showChangeModeDifficulty && this.getChangeModeDifficultyComponent()}
        <View style={{flexGrow:1, flexDirection:'column',paddingBottom:0,}}>
          {this.getModeDifficultyKey()!=null && <View style={{flex:1,}}>{this.getClassStatisticsText(this.props.classStatistics, this.getModeDifficultyKey() )}</View>}
        </View>
        <View style={{flexDirection:'row',borderTopWidth:10, borderColor:'navy'}}>
          <View style={{borderRightWidth:1, flex:1,}}>
            <RectangleSingleLineIconButton
              text={<Text style={{alignSelf:'center'}}>Overview</Text>}
              backgroundColor={this.state.visibleTab=='overview' ? 'aqua' : 'white'}
              height={60}
              width={'100%'}
              onPress={()=>this.setState({visibleTab:'overview'})}
            />
          </View>
          <View style={{flex:1, borderRightWidth:1,}}>
            <RectangleSingleLineIconButton
              text={<Text style={{alignSelf:'center'}}>{`Error Details`}</Text>}
              backgroundColor={this.state.visibleTab=='errorDetails' ? 'aqua' : 'white'}
              height={60}
              width={'100%'}
              onPress={()=>this.setState({visibleTab:'errorDetails'})}
            />
          </View>
          <View style={{flex:1,}}>
            <RectangleSingleLineIconButton
              text={<Text style={{alignSelf:'center'}}>Class Summary</Text>}
              backgroundColor={this.state.visibleTab=='classSummary' ? 'aqua' : 'white'}
              height={60}
              width={'100%'}
              onPress={()=>this.setState({visibleTab:'classSummary'})}
            />
          </View>
        </View>
      </View>

    )
  }

  getModeDifficultyKey(){
    if(this.state.selectedMode=='' || this.state.selectedDifficulty=='') return null
    return getModeDifficultyKey(this.state.selectedMode, this.state.selectedDifficulty)
  }

  onChangeMode(mode){
    this.setState(
      {selectedMode: MODE[mode], modeTextTop: MODEDISPLAY[mode]['description'], modeTextBottom: MODEDISPLAY[mode]['equation'] },
      () => this.props.startClassCodeGroupListener(this.getModeDifficultyKey())
    )
  }

  onChangeDifficulty(difficulty){
    this.setState(
      {selectedDifficulty: DIFFICULTY[difficulty], difficultyText: DIFFICULTYDISPLAY[difficulty]},
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
            onPress={ () => this.onChangeMode('DIFFERENCE_OF_SQUARES') }
          />
          </View>
          <View style={{borderWidth:1, borderTopWidth:0, borderRightWidth:0,}}>
          <RectangleMathButton
            backgroundColor={this.state.selectedMode==MODE.TRINAOMIAL_A_IS_1 ? 'aqua' : 'white'}
            textTop='Moderate'
            textBottom='x²±bx±c'
            width={'100%'}
            height={60}
            onPress={ () => this.onChangeMode('TRINAOMIAL_A_IS_1') }
          />
          </View>
          <View style={{borderWidth:1, borderTopWidth:0, borderRightWidth:0,}}>
          <RectangleMathButton
            backgroundColor={this.state.selectedMode==MODE.TRINAOMIAL_A_IS_NOT_1 ? 'aqua' : 'white'}
            textTop='Complex'
            textBottom='ax²±bx±c'
            width={'100%'}
            height={60}
            onPress={ () => this.onChangeMode('TRINAOMIAL_A_IS_NOT_1') }
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
            onPress={ () => this.onChangeDifficulty('EASY') }
          />
          </View>
          <View style={{borderWidth:1, borderTopWidth:0,}}>
          <RectangleMathButton
            backgroundColor={this.state.selectedDifficulty==DIFFICULTY.NORMAL ? 'lightgreen' : 'white'}
            textTop='Normal'
            textBottom=''
            width={'100%'}
            height={60}
            onPress={ () => this.onChangeDifficulty('NORMAL') }
          />
          </View>
          <View style={{borderWidth:1, borderTopWidth:0,}}>
          <RectangleMathButton
            backgroundColor={this.state.selectedDifficulty==DIFFICULTY.HARD ? 'lightgreen' : 'white'}
            textTop='Hard'
            textBottom=''
            width={'100%'}
            height={60}
            onPress={ () => this.onChangeDifficulty('HARD') }
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
        let numEventuallyCorrect = statsObj[modeDifficultyKey][user]['numEventuallyCorrect']
        let numCorrectOnFirstTry = statsObj[modeDifficultyKey][user]['numCorrectOnFirstTry']
        let numIncorrect = statsObj[modeDifficultyKey][user]['numMistakes']

        let percentCorrectOnFirstAttempt = Math.round(numCorrectOnFirstTry/problemsCounter*100)
        let percentEventuallyCorrect = Math.round(numEventuallyCorrect/problemsCounter*100)
        let percentIncorrect = Math.round(numIncorrect/problemsCounter*100)

        let percentSkipped = Math.round(statsObj[modeDifficultyKey][user]['numSkipped']/problemsCounter*100)
        let percentSignMistake = Math.round(statsObj[modeDifficultyKey][user]['numOfMistakeTypes']['sign']/problemsCounter*100)
        let percentFProductMistake = Math.round(statsObj[modeDifficultyKey][user]['numOfMistakeTypes']['F_Product']/problemsCounter*100)
        let percentOIProductMistake = Math.round(statsObj[modeDifficultyKey][user]['numOfMistakeTypes']['OI_Product']/problemsCounter*100)
        let percentLProductMistake = Math.round(statsObj[modeDifficultyKey][user]['numOfMistakeTypes']['L_Product']/problemsCounter*100)
        let percentBadNoSolutionClaim = Math.round(statsObj[modeDifficultyKey][user]['numOfMistakeTypes']['badNoSolutionClaim']/problemsCounter*100)
        let percentBadSolutionClaim = Math.round(statsObj[modeDifficultyKey][user]['numOfMistakeTypes']['badSolutionClaim']/problemsCounter*100)
        let percentOtherMistake = Math.round(statsObj[modeDifficultyKey][user]['numOfMistakeTypes']['other']/problemsCounter*100)

        let color = index%2==1 ? 'lightblue' : 'lightyellow'

        if(this.state.visibleTab=='overview'){
          return(
            <View key={user} style={{backgroundColor:color, flexDirection:'row', alignItems:'stretch', height:50, marginLeft:5,marginRight:5,marginTop:3,borderBottomWidth:1,borderRightWidth:1,borderLeftWidth:1,borderBottomRightRadius:5,elevation:1,}}>
              <StatsRowName color={color} name={statsObj[modeDifficultyKey][user]['identity']} />
              <StatsRowNumber color={color} isPercent number={percentCorrectOnFirstAttempt} />
              <StatsRowNumber color={color} isPercent number={percentIncorrect} />
              <StatsRowNumber color={color} isPercent number={percentEventuallyCorrect} />
              <StatsRowNumber color={color} number={problemsCounter} />
            </View>
          )
        }else{
          return(
            <View key={user} style={{backgroundColor:color, flexDirection:'row', alignItems:'stretch', height:50, marginLeft:5,marginRight:5,marginTop:3,borderBottomWidth:1,borderRightWidth:1,borderLeftWidth:1,borderBottomRightRadius:5,elevation:1,}}>
              <StatsRowName color={color} name={statsObj[modeDifficultyKey][user]['identity']} />
              <StatsRowNumber color={color} isPercent number={percentSignMistake} />
              <StatsRowNumber color={color} isPercent number={percentFProductMistake} />
              <StatsRowNumber color={color} isPercent number={percentOIProductMistake} />
              <StatsRowNumber color={color} isPercent number={percentLProductMistake} />
              <StatsRowNumber color={color} isPercent number={percentBadNoSolutionClaim} />
              <StatsRowNumber color={color} isPercent number={percentBadSolutionClaim} />
            </View>
          )
        }
      })
    )

    let getStatsHeader = () => {
      let color='white'
      let columnBoxStyle = {flexDirection:'column',backgroundColor:'white',borderBottomWidth:1, borderRightWidth:1,marginLeft:5,marginRight:5,borderBottomRightRadius:5,}
      let columnStyle = {flexDirection:'row', alignItems:'flex-end',}

      let getShowColumnDescriptionsText = () => {
        return(
          <View style={{flexDirection:'row', paddingLeft:8,marginTop:25, marginBottom:10,}}>
            <FontAwesome name="question-circle-o" size={16} color="navy" style={{marginRight:5,}}/>
            <Text style={{fontSize:12,color:'navy'}}>{`Tap for column descriptions`}</Text>
          </View>
        )
      }

      if(this.state.visibleTab=='overview'){
        return(
          <TouchableWithoutFeedback onPress={() => this.setState({columnExplanationsPopupVisible: true, columnExplanationsPopupDescriptors:'main',})}>
            <View style={columnBoxStyle}>
              {getShowColumnDescriptionsText()}
              <View style={columnStyle}>
                <StatsRowName color={color} isHeader columnName='' />
                <StatsRowNumber color={color} isHeader columnName={<MaterialCommunityIcons name="checkbox-marked" size={30} color="darkgreen" />} />
                <StatsRowNumber color={color} isHeader columnName={<MaterialCommunityIcons name="close-box" size={30} color="red" />} />
                <StatsRowNumber color={color} isHeader columnName={<MaterialCommunityIcons name="checkbox-multiple-marked" size={30} color="navy" />} />
                <StatsRowNumber color={color} isHeader columnName={<MaterialCommunityIcons name="pound-box" size={30} color="black" />} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        )
      }else{
        return(
          <TouchableWithoutFeedback onPress={() => this.setState({columnExplanationsPopupVisible: true, columnExplanationsPopupDescriptors:'errors',})}>
            <View style={columnBoxStyle}>
              {getShowColumnDescriptionsText()}
              <View style={columnStyle}>
                <StatsRowName color={color} isHeader columnName='' />
                <StatsRowNumber color={color} isHeader columnName={<Text style={{fontSize:25,color:'red',}}>±</Text>} />
                <StatsRowNumber color={color} isHeader columnName={<Text style={{fontSize:25,color:'red',}}>F</Text>} />
                <StatsRowNumber color={color} isHeader columnName={<Text style={{fontSize:25,color:'red',}}>OI</Text>} />
                <StatsRowNumber color={color} isHeader columnName={<Text style={{fontSize:25,color:'red',}}>L</Text>} />
                <StatsRowNumber color={color} isHeader columnName={<Text style={{fontSize:25,color:'red',}}>∅</Text>} />
                <StatsRowNumber color={color} isHeader columnName={<MaterialCommunityIcons name="checkbox-marked" size={30} color="red" />} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        )
      }

    }

    return(
      <View style={{flex:1,}}>
      <ScrollView horizontal contentContainerStyle={{flexGrow:1}} onTouchStart={()=>this.setState({showChangeModeDifficulty:false})}>
        <View style={{flexDirection:'column', flex:1,}}>

              {getStatsHeader()}

            <ScrollView contentContainerStyle={{paddingBottom:20}}>
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
              {getStatsData()}
              {getStatsData()}
              {getStatsData()}
            </ScrollView>
        </View>
      </ScrollView>
      </View>
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
  let columnWidth = 80
  let viewStyle = {width:columnWidth, flexDirection:'row', alignItems:'center', justifyContent:'flex-start', backgroundColor:props.color}

  if(props.isHeader){
    return(
      <View style={viewStyle}>
        <Text>{props.columnName}</Text>
      </View>
    )
  }else{
    return(
      <View style={{...viewStyle, paddingLeft:8,}}>
        <Text>{props.name}</Text>
      </View>
    )
  }
}

StatsRowNumber = (props) => {
  let columnWidth = 50
  let viewStyle = {width:columnWidth, flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:props.color}

  if(props.isHeader){
    return(
      <View style={viewStyle}>
        {props.columnName}
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
