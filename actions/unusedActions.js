import * as firebase from 'firebase'
import { STREAK } from '../database/userDataDefinitions'

export function checkIfUserKeyExistsInDatabase(keyToCheck, keyLocation=''){
  return function(dispatch){
    dispatch(databaseOperationInProgress())
    let user = firebase.auth().currentUser
    let ref = firebase.database().ref('users/'+user.uid+'/'+keyLocation).orderByKey().equalTo(keyToCheck)
    return ref.once('value').then( (snapshot) => {
      dispatch(databaseOperationFinishedSuccess())
      return snapshot.exists()
    })
  }
}

//Example for future more general use
export function startUserDatabaseListener(dataPath, action){
  return async function(dispatch, getState){
    let ref = firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/'+dataPath)
    ref.on(
      'value',
      snapshot => {
        //if(snapshot.val()==null) dispatch(action(getState().userData[difficultyMode][STREAK.CURRENT_STREAK]['value']))
        dispatch(action(snapshot.val()))
      },
      error => {
        console.log(error)
        console.log('There was an error calling the on listener in startUserDatabaseListener thunk')
      }
    )
  }
}

//Example for future more general use
export function startUserCurrentStreakListener(difficultyMode){
  return async function(dispatch, getState){
    dispatch(startUserDatabaseListener(
      ''+difficultyMode+'/'+STREAK.CURRENT_STREAK,
      updateUserStreakInLocalState.bind(this, difficultyMode, STREAK.CURRENT_STREAK)
    ))
  }
}
//Example for future more general use
export function stopUserCurrentStreakListener(difficultyMode){
  return async function(dispatch, getState){
    dispatch(stopUserDatabaseListener(''+difficultyMode+'/'+STREAK.CURRENT_STREAK))
  }
}

//THUNK
export function readUserValue(dataPath) { //Still need to complete this!!
  return function(dispatch){
    let user = firebase.auth().currentUser
    let ref = firebase.database().ref('users/'+user.uid+'/'+dataPath)
    return ref.once('value').then( (dataValue) => {
      dispatch(databaseOperationFinishedSuccess())
      return dataValue.val()
    })
  }
}
