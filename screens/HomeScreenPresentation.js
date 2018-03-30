import React from 'react';
import Expo from 'expo'
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  StatusBar,
} from 'react-native';

import { MathButton, SquareMathButton, RectangleMathButton } from '../components/Button';
import DifficultyOverlay from '../screens/DifficultyOverlay'
import { MODE } from '../database/userDataDefinitions'
import { EnterClassCodePopup } from '../screens/EnterClassCodePopup'

import * as firebase from 'firebase';

export class HomeScreenPresentation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showOverlay:false,
      lastSelectedMode:'differenceOfSquares',
      lastSelectedTitle:'Simple',
      lastSelectedColor:'palegreen',
      joinClassPopupVisible:false,
    }
  }

  static navigationOptions = {
    header:null, //remove this line to display header
    headerTitle: 'Main Menu',
  }

  componentDidMount() {
    //BackHandler.addEventListener('hardwareBackPress', () => true)
  }

  componentWillUnmount() {
    //BackHandler.removeEventListener('hardwareBackPress', () => true)
  }

  showOverlay(mode, title, lastSelectedColor){
    this.setState({showOverlay:true, lastSelectedMode:mode, lastSelectedTitle:title, lastSelectedColor:lastSelectedColor})
  }

  hideOverlay(){
    this.setState({showOverlay:false})
  }

  logoutOfFirebase(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
    });
  }

  render() {
    return (

      <View style={{flex:1, flexDirection:'column', backgroundColor:'lightblue', paddingTop:Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}}>
      <ScrollView contentContainerStyle={{flexGrow:1, justifyContent:'center'}} >
      <View style={styles.container}>
        <EnterClassCodePopup
          onClose={()=>this.setState({joinClassPopupVisible: false})}
          visible={this.state.joinClassPopupVisible}
        />

        {this.state.showOverlay &&
          <DifficultyOverlay
            navigation={this.props.navigation}
            hideOverlay={()=>this.hideOverlay()}
            mode={this.state.lastSelectedMode}
            title={this.state.lastSelectedTitle}
            popupColor={this.state.lastSelectedColor}
          /> }

        <View style={{backgroundColor:'white', borderWidth:2, borderColor:'black', marginBottom:20, paddingTop:20, paddingRight:40, paddingLeft:40, paddingBottom:20, borderTopLeftRadius:40, borderBottomRightRadius:40, alignItems:'center', justifyContent:'center', }}>
        <Text style={{backgroundColor:'transparent', textAlign:'center',}}><Text style={{fontFamily:'math-font', fontSize:40,  textAlign:'center', backgroundColor:'transparent'}}>factor{'\n'}</Text>
        <Text style={{fontFamily:'math-font', fontSize:80, marginTop:-40, textAlign:'center', backgroundColor:'transparent'}}>(<Text style={{color:'crimson', backgroundColor:'transparent'}}>i</Text>t<Text style={{color:'crimson', backgroundColor:'transparent'}}>!</Text>)</Text></Text>
        </View>

        <View style={styles.factorItModes}>
          <SquareMathButton
            backgroundColor='palegreen'
            textTop='Simple'
            textMiddle='x²±c'
            sideLength={100}
            onPress={() => this.showOverlay(MODE.DIFFERENCE_OF_SQUARES, 'Simple', 'palegreen',)}
          />
          <SquareMathButton
            backgroundColor='lightsalmon'
            textTop='Moderate'
            textMiddle='x²±bx±c'
            sideLength={100}
            onPress={() => this.showOverlay(MODE.TRINAOMIAL_A_IS_1, 'Intermediate', 'lightsalmon',)}
          />
          <SquareMathButton
            backgroundColor='lightcoral'
            textTop='Complex'
            textMiddle='ax²±bx±c'
            sideLength={100}
            onPress={() => this.showOverlay(MODE.TRINAOMIAL_A_IS_NOT_1, 'Complex', 'lightcoral',)}
          />
        </View>

        <View style={styles.classroomOptionsButtons}>
          <RectangleMathButton
            backgroundColor='yellow'
            textTop={`Join Class`}
            textBottom='For Students'
            width={150}
            height={70}
            onPress={()=>this.setState({joinClassPopupVisible: true})}
          />
          <RectangleMathButton
            backgroundColor='white'
            textTop='Manage Classes'
            textBottom='For Teachers'
            width={150}
            height={70}
            onPress={() => this.props.navigation.navigate('ClassCodeScreen' )}
          />
        </View>

        <View style={styles.logoutButton}>
          <RectangleMathButton
            backgroundColor='lightgrey'
            textTop='Logout'
            textBottom=''
            width={300}
            height={40}
            flexShrink={1}
            onPress={()=>this.logoutOfFirebase()}
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
  classroomOptionsButtons : {
    flexDirection : 'row',
    marginTop : 20,
    marginBottom : 5,
    borderWidth:1,
  },
  logoutButton : {
    flexDirection : 'row',
    margin : 1,
    borderWidth:1,
  },
  factorItModes : {
    flexDirection : 'row',
    alignItems:'center',
  },
  factorItText : {
    fontSize : 40,
    color : 'white',
    textAlign : 'center',
    backgroundColor : 'black',
  }
})
