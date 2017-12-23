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
} from 'react-native';

import { BigButton, SquareButton, FlexKey, MathButton } from '../components/Button';
import { MonoText } from '../components/StyledText';
import { getFactoredEquation } from '../logic/differenceOfSquares';
import DifficultyOverlay from '../screens/DifficultyOverlay'
import { MODE } from '../database/userDataDefinitions'

import * as firebase from 'firebase';

export class HomeScreenPresentation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      equation: {equationString:'Placeholder'},
      keyValue:'',
      showOverlay:false,
      lastSelectedMode:'differenceOfSquares',
      lastSelectedTitle:'Simple',
      lastSelectedColor:'palegreen',
    }

  }

  static navigationOptions = {
    header:null, //remove this line to display header
    headerTitle: 'Main Menu',
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => true)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => true)
  }

  onLoginPress = async () => {
    //const result = await signInWithGoogleAsync()
    // if there is no result.error or result.cancelled, the user is logged in
    // do something with the result
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

        <View style={styles.buttonGroupContainer}>
          <MathButton
            backgroundColor='palegreen'
            textTop='Simple'
            textBottom='x²±c'
            width={250}
            flexShrink={1}
            onPress={() => this.showOverlay(MODE.DIFFERENCE_OF_SQUARES, 'Simple', 'palegreen',)}
          />
          <SquareButton text='?' backgroundColor='moccasin' style={{marginLeft:10}} onPress={()=>this.logoutOfFirebase()} />
        </View>

        <View style={styles.buttonGroupContainer}>
          <MathButton
            backgroundColor='lightsalmon'
            textTop='Intermediate'
            textBottom='x²±bx±c'
            width={250}
            flexShrink={1}
            onPress={() => this.showOverlay(MODE.TRINAOMIAL_A_IS_1, 'Intermediate', 'lightsalmon',)}
          />
          <SquareButton text={'increment cool counter'} backgroundColor='moccasin' style={{marginLeft:10}} onPress={()=>this.props.incrementUserValue('coolFactor')} />
        </View>

        <View style={styles.buttonGroupContainer}>
          <MathButton
            backgroundColor='lightcoral'
            textTop='Complex'
            textBottom='ax²±bx±c'
            width={250}
            flexShrink={1}
            onPress={() => this.showOverlay(MODE.TRINAOMIAL_A_IS_NOT_1, 'Complex', 'lightcoral',)}
          />
          {/*<SquareButton text='?' backgroundColor='moccasin' style={{marginLeft:10}} onPress={() => this.props.navigation.navigate('FactorQuizScreen')} />*/}
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
