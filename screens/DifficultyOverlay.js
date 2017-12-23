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
  TouchableWithoutFeedback,
  View,
  BackHandler,
  Webview,
  TextInput,
  StatusBar,
  Modal,
} from 'react-native'
import { DIFFICULTY } from '../database/userDataDefinitions'
import { BigButton, SquareButton, FlexKey } from '../components/Button'

export default class DifficultyOverlay extends React.Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  navigateAndClose(screen, navigationProps){
    this.props.navigation.navigate(screen, navigationProps )
    this.props.hideOverlay()
  }

  //animationType can also be 'fade'
  render(){
    let trans = 'rgba(0,0,0,0.5)'
    let animationType='fade'
    if(__DEV__) animationType='none'
    return(
      <Modal
        animationType={animationType}
        transparent={true}
        visible={true}
        onRequestClose={() => this.props.hideOverlay()}
        style={{flex:1, flexDirection:'column',}}
        >
        <View style={{flex:1, alignItems:'center', backgroundColor:trans,}}>
          <TouchableWithoutFeedback style={{flex:1, flexDirection:'column'}} onPress={()=>this.props.hideOverlay()}>
            <View style={{flex:1, alignSelf:'stretch', backgroundColor:'transparent'}}/>
          </TouchableWithoutFeedback>

          <View style={{flex:3, flexDirection:'row'}}>

            <TouchableWithoutFeedback style={{flex:1, flexDirection:'column'}} onPress={()=>this.props.hideOverlay()}>
              <View style={{flexGrow:1, alignSelf:'stretch', backgroundColor:'transparent'}}/>
            </TouchableWithoutFeedback>

            <View style={{flexGrow:1, width:250, flexDirection:'column', borderWidth:2, borderColor:'black',}}>
              <View style={{height:25, borderWidth:1,backgroundColor:'black'}}>
                <Text style={{marginTop:1,fontFamily:'math-font', fontSize:15,color:'white',alignSelf:'center'}}>{this.props.title}</Text>
              </View>
              <ScrollView style={{backgroundColor:this.props.popupColor,}} contentContainerStyle={{alignSelf:'center', justifyContent:'center', alignItems:'center'}} >
                <Text style={{marginTop:5,fontFamily:'math-font', fontSize:25}}>Pick Difficulty:</Text>
                <BigButton
                  text='Easy'
                  backgroundColor='beige'
                  onPress={() => this.navigateAndClose('FactorQuizScreen', {mode: this.props.mode, difficulty:DIFFICULTY.EASY, title:this.props.title,} )}
                />
                <BigButton
                  text='Normal'
                  backgroundColor='beige'
                  onPress={() => this.navigateAndClose('FactorQuizScreen', {mode: this.props.mode, difficulty:DIFFICULTY.NORMAL, title:this.props.title,} )}
                />
                <BigButton
                  text='Hard'
                  backgroundColor='beige'
                  onPress={() => this.navigateAndClose('FactorQuizScreen', {mode: this.props.mode, difficulty:DIFFICULTY.HARD, title:this.props.title,} )}
                />
                <BigButton
                  text='Insane'
                  backgroundColor='beige'
                  onPress={() => this.navigateAndClose('FactorQuizScreen', {mode: this.props.mode, difficulty:DIFFICULTY.INSANE, title:this.props.title,} )}
                />
              </ScrollView>
            </View>

            <TouchableWithoutFeedback style={{flex:1, flexDirection:'column'}} onPress={()=>this.props.hideOverlay()}>
              <View style={{flexGrow:1, alignSelf:'stretch', backgroundColor:'transparent'}}/>
            </TouchableWithoutFeedback>

          </View>

          <TouchableWithoutFeedback style={{flex:1, flexDirection:'column'}} onPress={()=>this.props.hideOverlay()}>
            <View style={{flex:1, alignSelf:'stretch', backgroundColor:'transparent'}}/>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    )
  }

}
