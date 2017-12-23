import React from 'react';
import Expo from 'expo'

import { connect } from 'react-redux'
import { databaseConnectionDisruptionDetected, databaseConnectionDisruptionFixed, databaseIsOnline, databaseIsOffline } from '../actions/mainActions'

import * as firebase from 'firebase';

const mapStateToProps = state => {
  return {
    databaseOperationsInProgress: state.database.operationsInProgress,
    tryingToReconnect: state.database.tryingToReconnect,
    isOnline: state.database.isOnline,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    databaseConnectionDisruptionDetected: () => {
      dispatch(databaseConnectionDisruptionDetected())
    },
    databaseConnectionDisruptionFixed: () => {
      dispatch(databaseConnectionDisruptionFixed())
    },
    databaseIsOnline: () => {
      dispatch(databaseIsOnline())
    },
    databaseIsOffline: () => {
      dispatch(databaseIsOffline())
    },
  }
}

class ListenForDatabaseOperationsPresentation extends React.Component {


  componentDidMount(){
    let connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', async (snap) => {
      if(snap.val() === true){ //user is online
        if(this.props.tryingToReconnect===true) this.props.databaseConnectionDisruptionFixed() //this is also called in componentWillReceiveProps as a safeguard
        this.props.databaseIsOnline()
        console.log('listener detected we are online')
      }else{ //user is offline
        this.props.databaseIsOffline()
        console.log('listener detected we are offline')
      }
    })
  }

  componentWillReceiveProps(nextProps){

    let opsLength = this.props.databaseOperationsInProgress.length
    let nextOpsLength = nextProps.databaseOperationsInProgress.length

    if(opsLength==0 && nextOpsLength>0){
      //firebase.database().goOnline()
      //console.log('firebase is now online!')
    }else if(opsLength>0 && nextOpsLength==0){
      //firebase.database().goOffline()
      //console.log('firebase is now offline!')
    }
    //the below checks if there is a database operation that needs to be done but the database cannot goOnline
    if(!nextProps.isOnline && nextOpsLength>0){
      this.checkIfDatabaseShouldBeOnline()
    }
    if(this.props.tryingToReconnect && !nextProps.tryingToReconnect) this.props.databaseConnectionDisruptionFixed()

  }

  async checkIfDatabaseShouldBeOnline(){
    const delay = ms => new Promise(r => setTimeout(r, ms))

    /*  It takes a small amount of time for firebase to go back online.
        If after the below delay, firebase still has not been able to successfully go back online,
        this indicates a connection disruption. Other components can read state.database.tryingToReconnect
        in order to determine if the user is unexpectedly offline.  */
    await delay(500)

    if(!this.props.isOnline && this.props.databaseOperationsInProgress.length>0){
      this.props.databaseConnectionDisruptionDetected()
      console.log('ERROR, FIREBASE IS OFFLINE BUT SHOULD STILL BE CONNECTED')
      while(!this.props.isOnline && this.props.databaseOperationsInProgress.length>0){
        firebase.database().goOnline()
        console.log('attempting to reconnect')
        await delay(500)
      }
    }
  }

  render () {
    return null
  }

}

export const ListenForDatabaseOperations = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListenForDatabaseOperationsPresentation)
