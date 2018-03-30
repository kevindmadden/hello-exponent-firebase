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

export default class Popup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  hideOverlay(){
    this.props.onClose()
  }

  //animationType can also be 'fade'
  render(){
    let animationType='fade'
    if(__DEV__) animationType='none'
    if(this.props.visible===false){
      return (null)
    }else{
      return(
        <Modal
          animationType={animationType}
          transparent={true}
          visible={true}
          onRequestClose={() => this.hideOverlay()}
          style={{flex:1, flexDirection:'column',}}
          >
          {this.getPopupWindow()}
        </Modal>
      )
    }

  }

  /* Note on KeyboardAvoidingView: iOS does not automatically resize the app's screen when the keyboard appears;
  hence, the KeyboardAvoidingView is needed in order to account for this; Android works fine without this (so the behaviour passed is just null)*/
  getPopupWindow = () => {
    let trans = 'rgba(0,0,0,0.5)'
    return (
      <KeyboardAvoidingView behavior={Platform.OS==='ios' ? 'padding' : null} style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:trans,}}>
        <TouchableWithoutFeedback style={{flexGrow:1, flexDirection:'column'}} onPress={()=>this.hideOverlay()}>
          <View style={{flex:1, alignSelf:'stretch', minHeight:'5%', backgroundColor:'transparent'}}/>
        </TouchableWithoutFeedback>

        <View style={{flex:-1,flexDirection:'row'}}>

          <TouchableWithoutFeedback style={{flex:1, flexDirection:'column'}} onPress={()=>this.hideOverlay()}>
            <View style={{flexGrow:1, alignSelf:'stretch', backgroundColor:'transparent'}}/>
          </TouchableWithoutFeedback>

          <View style={{flexGrow:1, width:250, flexDirection:'column', borderWidth:2, borderColor:'black',}}>
            <View style={{height:25, borderWidth:1,backgroundColor:'black'}}>
              <Text style={{marginTop:1,fontFamily:'math-font', fontSize:15,color:'white',alignSelf:'center'}}>{this.props.title}</Text>
            </View>
            <ScrollView style={{backgroundColor:this.props.backgroundColor,}} contentContainerStyle={{alignSelf:'center', justifyContent:'center', alignItems:'center'}} >
              {this.props.children}
            </ScrollView>
          </View>

          <TouchableWithoutFeedback style={{flex:1, flexDirection:'column'}} onPress={()=>this.hideOverlay()}>
            <View style={{flexGrow:1, alignSelf:'stretch', backgroundColor:'transparent'}}/>
          </TouchableWithoutFeedback>

        </View>

        <TouchableWithoutFeedback style={{flexGrow:1, flexDirection:'column'}} onPress={()=>this.hideOverlay()}>
          <View style={{flex:1, alignSelf:'stretch', minHeight:'5%', backgroundColor:'transparent'}}/>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  }

}
