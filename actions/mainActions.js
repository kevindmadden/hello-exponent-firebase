import * as firebase from 'firebase'
import { STREAK } from '../database/userDataDefinitions'

export const keyboardKeyPressed = (keyPressed) => {
  return {
    type: 'KEYBOARD_KEY_PRESSED',
    keyPressed: keyPressed,
    keyPressedAtTime: Date.now()
  }
}

export const databaseOperationInProgress = () => {
  return {
    type: 'DATABASE_OPERATION_IN_PROGRESS'
  }
}

export const databaseOperationFinishedSuccess = () => {
  return {
    type: 'DATABASE_OPERATION_FINISHED_SUCCESS'
  }
}

export const databaseConnectionDisruptionDetected = () => {
  return {
    type: 'DATABASE_CONNECTION_DISRUPTION_DETECTED'
  }
}

export const databaseConnectionDisruptionFixed = () => {
  return {
    type: 'DATABASE_CONNECTION_DISRUPTION_FIXED'
  }
}

export const databaseIsOnline = () => {
  return {
    type: 'DATABASE_IS_ONLINE'
  }
}

export const databaseIsOffline = () => {
  return {
    type: 'DATABASE_IS_OFFLINE'
  }
}

export const updateUserStreakInLocalState = (difficultyMode, streakType, newStreakValue, loading=false) => {
  return {
    type: 'UPDATE_USER_STREAK_IN_LOCAL_STATE',
    difficultyMode: difficultyMode,
    streakType: streakType,
    newStreakValue: newStreakValue,
    loading: loading,
  }
}

export function stopUserDifficultyListener(difficultyMode){
  return async function(dispatch, getState){
    dispatch(stopUserDatabaseListener(''+difficultyMode))
  }
}

//Currently used
export function stopUserDatabaseListener(dataPath){
  return async function(dispatch, getState){
    let ref = firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/'+dataPath)
    ref.off()
  }
}

/*  The more general difficulty listener is important to use here because the transaction that updates the streak values is
run off of a ref to the difficulty node (not the individual streak nodes). Firebase does not seem to cache data locally
if more specific listeners are use (which results in the user seeing null values when offline... */
export function startUserDifficultyListener(difficultyMode){
  return async function(dispatch, getState){
    let ref = firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/'+difficultyMode)
    ref.on(
      'value',
      snapshot => {
        //if(snapshot.val()==null) dispatch(action(getState().userData[difficultyMode][STREAK.CURRENT_STREAK]['value']))
        dispatch(updateUserStreakInLocalState(difficultyMode, STREAK.CURRENT_STREAK, snapshot.val()[STREAK.CURRENT_STREAK]))
        dispatch(updateUserStreakInLocalState(difficultyMode, STREAK.MAX_STREAK, snapshot.val()[STREAK.MAX_STREAK]))
      },
      error => {
        console.log(error)
        console.log('There was an error calling the on listener in startUserMaxStreakListener thunk')
      }
    )
  }
}

//THUNK
//example transaction; this function contains comments explaining why this patterns is followed
export function incrementUserStreakValues(difficultyMode) {

  const getNewCurrentStreak = (currentStreak) => currentStreak + 1
  const getNewMaxStreak = (maxStreak, currentStreak) => currentStreak+1 > maxStreak ? currentStreak+1 : maxStreak

  return async function(dispatch, getState){
    dispatch(databaseOperationInProgress())
    try{
      let ref = firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/'+difficultyMode)
      var {committed, snapshot} = await ref.transaction( (userData) => { //var is needed so that these variables are available outside try block
        if(userData==null){
          return 'loading'
        }else{
          return {
            ...userData,
            [STREAK.CURRENT_STREAK]: getNewCurrentStreak(userData[STREAK.CURRENT_STREAK]),
            [STREAK.MAX_STREAK]: getNewMaxStreak(userData[STREAK.MAX_STREAK], userData[STREAK.CURRENT_STREAK]),
          }
        }
      })
    }catch(e){
      console.log(e)
      //database issue occurred
    }finally{
      dispatch(databaseOperationFinishedSuccess())
    }
    if(committed){
      return snapshot.val() //.val() MUST be included; if it isn't, it returns an object that looks like a number??
    }
  }
}

export function resetUserCurrentStreakValue(difficultyMode) {
  return async function(dispatch){
    dispatch(databaseOperationInProgress())
    try{
      let ref = firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/'+difficultyMode+'/'+STREAK.CURRENT_STREAK)
      var {committed, snapshot} = await ref.transaction( currentStreakValue => 0 )
    }catch(e){
      console.log(e)
      //database issue occurred
    }finally{
      dispatch(databaseOperationFinishedSuccess())
    }
    if(committed){
      return snapshot.val()
    }
  }
}
