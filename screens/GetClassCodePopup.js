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
import { Ionicons, Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons'
import Popup from '../screens/Popup'
import { connect } from 'react-redux'
import { getClassCode } from '../actions/mainActions'
import { RectangleSingleLineIconButton, } from '../components/Button'

const mapStateToProps = (state, ownProps) => {
  return {
    classStatistics: state.classStatistics, //TODO:Remove hard-coded difficulty mode
    classIDsOwnerList: state.classStatistics.classIDsOwnerList,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getClassCode: (refreshRequested) => {
      return dispatch(getClassCode(ownProps.classID, refreshRequested))
    },
  }
}

export class GetClassCodePopupPresentation extends React.Component {

  constructor(props) {
    super(props)
    this.refreshButtonDisabled = true
    this.state = this.getInitialState()
  }

  getInitialState() {
    return {
      classCode:'',
      classCodeLoading:true,
      isError:false,
      error:'',
      refreshRequested:false,
    }
  }

  requestClassCode(refreshRequested=false){
    this.refreshButtonDisabled = true
    this.setState({...this.getInitialState(), refreshRequested})
    this.props.getClassCode(refreshRequested)
      .then( rv => {
        this.setState({...rv, classCodeLoading:false})
        this.refreshButtonDisabled = false
      })
  }

  //this.requestClassCode() should not be called in onComponentDidMount;
  //Remember that the popup is mounted when its originating screen is mounted;
  //The class code does not need to be retrieved until the user actually makes this popup component visible
  componentDidMount(){ }

  componentWillReceiveProps(nextProps){
    if(!this.props.visible && nextProps.visible){
      this.requestClassCode()
    }
  }

  refreshClassCode(){
    if(!this.refreshButtonDisabled){
      this.requestClassCode(true)
    }
  }

  onClose(){
    this.props.onClose()
  }

  render() {
    return (

      <Popup
        visible={this.props.visible}
        onClose={()=>this.onClose()}
        title='View Class Code'
        backgroundColor='lightyellow'
      >
          <Text style={{fontSize:20, margin:10, textAlign:'center',}}>{`Your class code is:`}</Text>

          <View style={{width:250, minHeight:70,justifyContent:'center', alignItems:'center', margin:10,}}>
            {!this.state.classCodeLoading && !this.state.isError && this.getSuccessComponent()}
            {!this.state.classCodeLoading && this.state.isError && this.getErrorComponent()}
            {this.state.classCodeLoading && <ActivityIndicator size='large' color='navy' style={{width:40, marginLeft:20, marginRight:20}}/> }
          </View>
          <View style={{width:250, minHeight:90,justifyContent:'center', alignItems:'center', margin:10,}}>
            {this.getRefreshButton()}
          </View>
      </Popup>

    )
  }

  getRefreshButton(){
    getIcon = () => {
      if(this.state.classCodeLoading && this.state.refreshRequested){
        return (<ActivityIndicator size='small' color='navy' style={{width:40, marginLeft:20, marginRight:20}}/>)
      }else{
        return (<FontAwesome name="refresh" size={40} color="navy" style={{width:40, marginLeft:20, marginRight:20}} />)
      }
    }

    return (
      <View style={{borderWidth:1, flexDirection:'row', justifyContent:'center', alignItems:'center',}}>
        <RectangleSingleLineIconButton
          icon={getIcon()}
          text={<Text style={{fontSize:20, }}>Generate New Code</Text>}
          backgroundColor='white'
          height={70}
          width={195}
          onPress={() => this.refreshClassCode()}
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
          <Text style={{color:'red'}}>{this.state.error}</Text>
        </View>
      </View>
    )
  }

  getSuccessComponent(){
    return(
      <View style={{flex:1, flexDirection:'row',alignItems:'center',justifyContent:'center',}}>
        <Text style={{fontSize:50, color:'green'}}>{this.state.classCode}</Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({

})

export const GetClassCodePopup = connect(
  mapStateToProps,
  mapDispatchToProps
)(GetClassCodePopupPresentation)
