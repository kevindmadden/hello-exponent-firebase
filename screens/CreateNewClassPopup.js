import React from 'react';
import Expo from 'expo'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons'
import Popup from '../screens/Popup'
import { connect } from 'react-redux'
import { createNewClass } from '../actions/mainActions'
import { RectangleSingleLineIconButton, } from '../components/Button'

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createNewClass: (newClassName) => {
      if(newClassName.length>50){
        return Promise.resolve('The class name you entered is too long. Please submit a shorter class name.')
      }else if((newClassName.replace(/\s/g, '')).length==0){ //remove spaces with regex; if the resulting string has a length of 0, give user the below message
        return Promise.resolve('You must enter a class name to create a new class.')
      }else{
        return dispatch(createNewClass(newClassName))
      }
    },
  }
}

export class CreateNewClassPopupPresentation extends React.Component {

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState() {
    return {
      newClassName:'',
      createClassFeedback:'',
      createClassSubmissionLoading:false,
    }
  }

  processClassNameSubmission(newClassName, wasManuallySubmitted=false){
    this.setState({createClassSubmissionLoading:true})
    this.props.createNewClass(newClassName)
      .then(rv => {
        this.setState({createClassSubmissionLoading:false, createClassFeedback:rv})
      })
  }

  onClose(){
    this.setState(this.getInitialState())
    this.props.onClose()
  }

  onChangeText(newClassName){
    if(this.state.createClassFeedback!='') this.setState({createClassFeedback:this.getInitialState().createClassFeedback}) //if feedback is shown to user and the user changes the entered text, remove the feedback
    this.setState({newClassName: newClassName})
  }

  render() {
    return (

      <Popup
        visible={this.props.visible}
        onClose={()=>this.onClose()}
        title='Class Setup'
        backgroundColor='lightyellow'
      >
          <Text style={{fontSize:20, margin:10, textAlign:'center',}}>{`Enter the name\nof your new class:`}</Text>
          <TextInput
            style={{backgroundColor:'white',height: 70, width: 200, borderColor: 'gray', borderWidth: 1, textAlign:'center',fontSize:20, color:this.state.createClassFeedback=='success' ? 'green' : 'black'}}
            onChangeText={(newClassName) => this.onChangeText(newClassName)}
            value={this.state.newClassName}
            autoCapitalize='words'
            autoFocus={true}
            onSubmitEditing={() => this.processClassNameSubmission(this.state.newClassName)}
          />
          <View style={{width:250, minHeight:70,justifyContent:'center', alignItems:'center', margin:10,}}>
            {!this.state.createClassSubmissionLoading && this.state.createClassFeedback=='' && this.getSubmitButton()}
            {this.state.createClassSubmissionLoading && <ActivityIndicator size='small' />}
            {this.state.createClassFeedback!='success' && this.state.createClassFeedback!='' && this.getErrorComponent()}
            {this.state.createClassFeedback=='success' && this.getSuccessComponent()}
            {this.state.createClassFeedback!='success' && this.state.createClassFeedback=='' && <Text>{this.state.createClassFeedback}</Text>}
          </View>
      </Popup>

    )
  }

  getSubmitButton(){
    return (
      <View style={{borderWidth:1, flexDirection:'row', justifyContent:'center', alignItems:'center',}}>
        <RectangleSingleLineIconButton
          icon={<MaterialIcons name="send" size={25} color="darkgreen" style={{marginLeft:15, marginRight:15}} />}
          text={<Text style={{fontSize:20, }}>Submit</Text>}
          backgroundColor='lightgreen'
          height={55}
          width={150}
          onPress={() => this.processClassNameSubmission(this.state.newClassName)}
        />
      </View>
    )
  }

  getErrorComponent(){
    return (
      <View style={{flex:1, flexDirection:'row',justifyContent:'center',}}>
        <Feather name="x-circle" size={32} color="red" style={{marginLeft:20, marginRight:10}} />
        <View style={{flexDirection:'column', flex:1,}}>
          <Text style={{color:'red'}}>Error:</Text>
          <Text style={{color:'red'}}>{this.state.createClassFeedback}</Text>
        </View>
      </View>
    )
  }

  getSuccessComponent(){
    return(
      <View style={{flex:1, flexDirection:'row',alignItems:'center',justifyContent:'center',}}>
        <Ionicons name="md-checkmark-circle" size={32} color="green" style={{marginRight:10}} />
        <Text style={{fontSize:18, color:'green'}}>Class created!</Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({

})

export const CreateNewClassPopup = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewClassPopupPresentation)
