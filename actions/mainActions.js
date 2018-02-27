import * as firebase from 'firebase'
import { STREAK, MISTAKE } from '../database/userDataDefinitions'
import { getFactorProblem } from '../logic/differenceOfSquares'

export const setNewFactorProblem = (difficultyMode, newFactorProblem) => {
  return {
    type: 'SET_NEW_FACTOR_PROBLEM',
    difficultyMode: difficultyMode,
    factorProblem: newFactorProblem,
  }
}

export const keyboardKeyPressed = (keyPressed) => {
  return {
    type: 'KEYBOARD_KEY_PRESSED',
    keyPressed: keyPressed,
    keyPressedAtTime: Date.now()
  }
}

export const changeKeyboardModeToSubmit = () => {
  return {
    type: 'CHANGE_KEYBOARD_MODE',
    mode: 'Submit',
  }
}

export const changeKeyboardModeToNextProblem = () => {
  return {
    type: 'CHANGE_KEYBOARD_MODE',
    mode: 'Next Problem',
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

export function stopUserProblemListener(difficultyMode){
  return async function(dispatch, getState){
    dispatch(stopUserDatabaseListener(''+difficultyMode+'/attemptHistory'))
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

export function generateFactorProblem(isInitialLoad, difficultyMode, difficulty, mode, factorable){
  return async function(dispatch, getState){
    let mostRecentChildRef = firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/'+difficultyMode+'/attemptHistory/status').orderByKey().limitToLast(1)
    mostRecentChildRef.once(
      'value',
      snapshot => {
        let mostRecentStatus = () => snapshot.val()[Object.keys(snapshot.val())[0]]
        /* A new problem should be generated without restrictions when requested if it is not the initial load.
         If it is the initial load, a new problem should be generated only if there are no problems yet in attemptHistory
           or if the last problem the user attempted was correct or skipped (this is necessary becuase the user will not have a "next problem" button) */
        let shouldGenerateNewProblem = isInitialLoad==false ? true : (snapshot.val()==null || mostRecentStatus()['correct']==true || mostRecentStatus()['skipped']==true)
        if(shouldGenerateNewProblem){
          let attemptHistoryRef = firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/'+difficultyMode+'/attemptHistory')
          let newKey = firebase.database().ref().push().key
          attemptHistoryRef.update({ //NOTE: this is a multi-location update; full paths from the ref must be provided because data at each path will be overwritten
            ['status/'+newKey] : true,
            ['problems/'+newKey] : getFactorProblem(mode, factorable, difficulty),
          })
        }
      },
      error => {
        console.log(error)
        console.log('There was an error calling the on listener in startUserCurrentProblemListener thunk')
      }
    )
  }
}

//Update local state so that the user sees the most recent uncompleted problem to attempt
export function showLatestProblemListener(difficultyMode){
  return async function(dispatch, getState){
    let ref = firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/'+difficultyMode+'/attemptHistory/problems').orderByKey().limitToLast(1)
    ref.on(
      'child_added',
      snapshot => {
        console.log('inside showLatestProblemListener')
        console.log(snapshot.key)
        let newKey = snapshot.key
        if(snapshot.val()!=null) dispatch(setNewFactorProblem(difficultyMode, {...snapshot.val(), attemptHistoryKey: snapshot.key} ))},
      error => {
        console.log(error)
        console.log('There was an error calling the on listener in startUserCurrentProblemListener thunk')
      }
    )
  }
}

export const updateFactorProblemStatistics = (difficultyMode, uid, numCorrect, numSkipped, numMistakes, numOfMistakeTypes, problemsCounter, identity='me') => {
  return {
    type: 'ADD_USER_TO_CLASS_STATISTICS',
    difficultyMode,
    uid,
    numCorrect,
    numSkipped,
    numMistakes,
    numOfMistakeTypes,
    problemsCounter,
    identity,
  }
}

//TODO: make this a child_added event with a listener so that users will appear as they join
export function startClassCodeGroupListener(classCode, difficultyMode='differenceOfSquares_easy'){ //TODO: Remove hard-coded difficulty mode (if a default is needed, pull it from DIFFICULTY/MODE objects)
  return async function(dispatch, getState){
    let classCodeMemberUIDs = {}
    let classCodeMembersRef = firebase.database().ref('classCodes/'+classCode+'/members') //there is no need to download every member of the class to check existence
    await classCodeMembersRef.once(
      'value',
      snapshot => {
        if(snapshot.exists()){
          console.log(snapshot.val())
          classCodeMemberUIDs = snapshot.val()
          console.log(classCodeMemberUIDs)
          console.log(Object.keys(classCodeMemberUIDs))
          for(const firebaseUID of Object.keys(classCodeMemberUIDs) ){
              dispatch(startFactorProblemStatisticsListener(difficultyMode, firebaseUID))
          }
        }
      },
      error => { console.log(error) }
    )
  }
}

//TODO: Exapand to multiple users by running foreach userid in some list
//TODO: Remove listener(s) when finished with it/them
export function startFactorProblemStatisticsListener(difficultyMode, firebaseUID, pastXNumOfProblems=10){
  return async function(dispatch, getState){
    let ref = firebase.database().ref('users/'+firebaseUID+'/'+difficultyMode+'/attemptHistory/status').orderByKey().limitToLast(pastXNumOfProblems)
    ref.on(
      'value',
      snapshot => {
        if(snapshot.val()!=null){
          let numCorrect = 0
          let numSkipped = 0
          let numMistakes = 0
          let numOfMistakeTypes = {}
          for(let mistakeType in MISTAKE){
            numOfMistakeTypes[MISTAKE[mistakeType]] = 0
          }

          let problemsCounter = 0
          snapshot.forEach( (childSnap) => {
            problemsCounter++
            if(childSnap.child('skipped').exists()){
              numSkipped++
            }else if(childSnap.child('correct').exists()){
              numCorrect++
            }
            if(childSnap.child('mistake').exists()) numMistakes++
            for(let mistakeType in MISTAKE){
              if(childSnap.child(MISTAKE[mistakeType]).exists()) numOfMistakeTypes[MISTAKE[mistakeType]]++
            }
          })
          let uid = firebaseUID
          //TODO: Add identity feature back in
          //let identity = firebaseUID.displayName
          //TODO: update dispatch call so it has the variable for identity
          dispatch(updateFactorProblemStatistics(difficultyMode, uid, numCorrect, numSkipped, numMistakes, numOfMistakeTypes, problemsCounter, 'identity: someone'))
        }
      },
      error => {
        console.log(error)
        console.log('There was an error calling the on listener in startUserCurrentProblemListener thunk')
      }
    )
  }
}

//TODO: Add additional errors rather than overwriting previous errors
export function updateCurrentFactorProblem(difficultyMode, isCorrect, isSkipped=false, isMistake=false, mistakeDetails={} ) {

  let attemptHistoryAdditions = () => {
    let myObj = {}
    if(isSkipped){
      myObj.skipped = true
    }else if(isCorrect){
      myObj.correct = true
    }else if(isMistake){ //this should be the only remaining option
      myObj = {mistake:true, ...mistakeDetails}
    }
    return myObj
  }
  console.log('attempt history additions:')
  console.log(attemptHistoryAdditions())

  return async function(dispatch, getState){
    dispatch(databaseOperationInProgress())
    try{
      let ref = firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/'+difficultyMode+'/attemptHistory/status/'+(getState().userData[difficultyMode]['factorProblem']['attemptHistoryKey']))
      var {committed, snapshot} = await ref.transaction( (userData) => { //var is needed so that these variables are available outside try block
        if(userData==null){
          return 'loading'
        }else{
          return userData===true ? attemptHistoryAdditions() : {...userData, ...(attemptHistoryAdditions())}
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

export function generateClassCode() {
  return async function(dispatch){
    dispatch(databaseOperationInProgress())
    let classCode=9
    let nonDuplicateClassCodeFound = false
    try{
      let highestClassCodeRef = firebase.database().ref('classCodes').orderByKey().limitToLast(1)
      await highestClassCodeRef.once(
        'value',
        snapshot => {
          if(snapshot.exists()) classCode=parseInt(Object.keys(snapshot.val())[0],10) //convert number string to number
          console.log('highestClassCodeRef:')
          console.log(snapshot.val())
          console.log('classCode:')
          console.log(classCode)
        },
        error => {
          console.log(error)
          console.log('There was an error calling the on listener in startUserCurrentProblemListener thunk')
        }
      )
      while(!nonDuplicateClassCodeFound){
        classCode=classCode+1
        let ref = firebase.database().ref('classCodes/'+classCode)
        var {committed, snapshot} = await ref.transaction( snapshot => { //var is needed so that these variables are available outside try block
          if(snapshot==null){
            return { owner : {[firebase.auth().currentUser.uid] : true} }
          }else{
            return; //abort the transaction if this classcode already exists
          }
        })

        /* In transactions, you cannot distingish between whether 'null' means data doesn't exist and data hasn't been loaded yet.
        The below checks whether the class code for the user now exists; if it does, then break out of the loop and stop trying to create a code */
        let checkRef = firebase.database().ref('classCodes/'+classCode+'/owner/'+firebase.auth().currentUser.uid)
        await checkRef.once(
          'value',
          snapshot => {
            if(snapshot.exists()) nonDuplicateClassCodeFound = true
          },
          error => {
            console.log(error)
            console.log('There was an error checking whether the class code was successfully created')
          }
        )

        // If class code was successfully created, list the class code as belonging to user in user's data
        if(nonDuplicateClassCodeFound){
          let classCodeUserRef = firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/classCodesOwner/'+classCode)
          await classCodeUserRef.set(true)
        }
      }
    }catch(e){
      console.log(e)
      //database issue occurred
    }finally{
      dispatch(databaseOperationFinishedSuccess())
    }
  }
}

export function joinClassCodeGroup(classCode) {
  return async function(dispatch){
    dispatch(databaseOperationInProgress())
    try{
      let classCodeExists = false
      let classCodeRef = firebase.database().ref('classCodes/'+classCode+'/owner') //there is no need to download every member of the class to check existence
      await classCodeRef.once(
        'value',
        snapshot => {
          if(snapshot.exists()) classCodeExists = true
        },
        error => { console.log(error) }
      )
      if(classCodeExists){
        let classCodeMemberRef = firebase.database().ref('classCodes/'+classCode+'/members/'+firebase.auth().currentUser.uid)
        await classCodeMemberRef.set(true)
      }
    }catch(e){
      console.log(e)
    }finally{
      dispatch(databaseOperationFinishedSuccess())
    }
  }
}
