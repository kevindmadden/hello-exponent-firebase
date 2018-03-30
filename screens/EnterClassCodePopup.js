import React from 'react';
import Expo from 'expo'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons'
import Popup from '../screens/Popup'
import { connect } from 'react-redux'
import { joinClassCodeGroup} from '../actions/mainActions'

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    joinClassCodeGroup: (classCode) => {
      if(classCode.length===6){
        return dispatch(joinClassCodeGroup(classCode))
      }else if(classCode.length<6){
        return Promise.resolve('The code you entered is too short.')
      }else if(classCode.length>6){
        return Promise.resolve('The code you entered is too long.')
      }else{
        return Promise.resolve('The code you entered is invalid.')
      }
    },
  }
}

export class EnterClassCodePopupPresentation extends React.Component {

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState() {
    return {
      classCode:'',
      classCodeFeedback:'',
      classCodeSubmissionLoading:false,
    }
  }

  processClassCodeSubmission(classCode, wasManuallySubmitted=false){
    if(wasManuallySubmitted && (this.state.classCodeSubmissionLoading || this.state.classCodeFeedback=='success')){
      //do not resubmit because the submission has already been successfully made or it is in process or being submitted
    }else{
      this.setState({classCodeSubmissionLoading:true})
      this.props.joinClassCodeGroup(classCode)
        .then(rv => {
          //if(rv=='success') Keyboard.dismiss() NOTE: Do not automatically dismiss the keyboard; this increases the chance of a misclick that would accidentally hide the popup
          this.setState({classCodeSubmissionLoading:false, classCodeFeedback:rv})
        })
    }
  }

  onClose(){
    this.setState(this.getInitialState())
    this.props.onClose()
  }

  normalizeClassCode(classCode){
    let classCodeMinusLowercaseWhitespaceDashes = classCode.toUpperCase().replace(/\s/g, '').replace(/-/g, '')
    return classCodeMinusLowercaseWhitespaceDashes
  }

  onChangeText(classCode){
    if(this.state.classCodeFeedback!='') this.setState({classCodeFeedback:this.getInitialState().classCodeFeedback})
    this.setState({classCode: classCode})
    if(this.normalizeClassCode(classCode).length>=6){
        this.processClassCodeSubmission(classCode)
    }
  }

  render() {
    return (
      <Popup
        visible={this.props.visible}
        onClose={()=>this.onClose()}
        title='Class Setup'
        backgroundColor='lightyellow'
      >
          <Text style={{fontSize:20, margin:10}}>{`Enter Class Code:`}</Text>
          <TextInput
            style={{height: 80, width: 200, borderColor: 'gray', borderWidth: 1, fontSize:35, textAlign:'center', color:this.state.classCodeFeedback=='success' ? 'green' : 'black'}}
            onChangeText={(classCode) => this.onChangeText(classCode)}
            value={this.state.classCode}
            autoCapitalize='characters'
            returnKeyType='send'
            maxLength={8}
            autoFocus={true}
            onSubmitEditing={() => this.processClassCodeSubmission(this.state.classCode, true)}
          />
          <View style={{width:250, minHeight:70,justifyContent:'center', margin:10,}}>
            {this.state.classCodeSubmissionLoading && <ActivityIndicator size='small' />}
            {this.state.classCodeFeedback!='success' && this.state.classCodeFeedback!='' && this.getErrorComponent()}
            {this.state.classCodeFeedback=='success' && this.getSuccessComponent()}
            {this.state.classCodeFeedback!='success' && this.state.classCodeFeedback=='' && <Text>{this.state.classCodeFeedback}</Text>}
          </View>
      </Popup>
    )
  }

  getErrorComponent(){
    return (
      <View style={{flex:1, flexDirection:'row',justifyContent:'center',}}>
        <Feather name="x-circle" size={32} color="red" style={{marginLeft:20, marginRight:10}} />
        <View style={{flexDirection:'column', flex:1,}}>
          <Text style={{color:'red'}}>Error:</Text>
          <Text style={{color:'red'}}>{this.state.classCodeFeedback}</Text>
        </View>
      </View>
    )
  }

  getSuccessComponent(){
    return(
      <View style={{flex:1, flexDirection:'row',alignItems:'center',justifyContent:'center',}}>
        <Ionicons name="md-checkmark-circle" size={32} color="green" style={{marginRight:10}} />
        <Text style={{fontSize:18, color:'green'}}>Success!</Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({

})

export const EnterClassCodePopup = connect(
  mapStateToProps,
  mapDispatchToProps
)(EnterClassCodePopupPresentation)
