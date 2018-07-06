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
        let newKey = snapshot.key
        if(snapshot.val()!=null) dispatch(setNewFactorProblem(difficultyMode, {...snapshot.val(), attemptHistoryKey: snapshot.key} ))},
      error => {
        console.log(error)
      }
    )
  }
}

export const updateFactorProblemStatistics = (classID, difficultyMode, uid, numEventuallyCorrect, numCorrectOnFirstTry, numSkipped, numMistakes, numOfMistakeTypes, problemsCounter, identity='me') => {
  return {
    type: 'ADD_USER_TO_CLASS_STATISTICS',
    classID,
    difficultyMode,
    uid,
    numEventuallyCorrect,
    numCorrectOnFirstTry,
    numSkipped,
    numMistakes,
    numOfMistakeTypes,
    problemsCounter,
    identity,
  }
}

//TODO: make this a child_added event with a listener so that users will appear as they join
export function startClassCodeGroupListener(classID, difficultyMode){
  return async function(dispatch, getState){
    let classCodeMemberUIDs = {}
    let classCodeMembersRef = firebase.database().ref('classIDs/'+classID+'/members')
    await classCodeMembersRef.once(
      'value',
      snapshot => {
        if(snapshot.exists()){
          classCodeMemberUIDs = snapshot.val()
          for(const firebaseUID of Object.keys(classCodeMemberUIDs) ){
            let displayName = '?'
            firebase.database().ref('users/'+firebaseUID+'/name').once(
              'value',
              snapshot => { displayName=''+snapshot.val() },
              error => { console.log(error) }
            ).then( () => {
              dispatch(startFactorProblemStatisticsListener(classID, difficultyMode, firebaseUID, displayName))
            })

          }
        }
      },
      error => { console.log(error) }
    )
  }
}

//TODO: Remove listener(s) when finished with it/them
export function startFactorProblemStatisticsListener(classID, difficultyMode, firebaseUID, displayName, pastXNumOfProblems=10){
  return async function(dispatch, getState){
    //query for pastXNumOfProblems+1; this is necessary because a student will not necessarily have submitted a response to the most recently generated problem
    let ref = firebase.database().ref('users/'+firebaseUID+'/'+difficultyMode+'/attemptHistory/status').orderByKey().limitToLast(pastXNumOfProblems+1)
    ref.on(
      'value',
      snapshot => {
        if(snapshot.val()!=null){
          let numEventuallyCorrect = 0
          let numCorrectOnFirstTry = 0
          let numSkipped = 0
          let numMistakes = 0
          let numOfMistakeTypes = {}
          for(let mistakeType in MISTAKE){
            numOfMistakeTypes[MISTAKE[mistakeType]] = 0
          }

          let problemsCounter = 0
          let forEachIndex = -1
          let attemptMadeOnMostRecentlyGeneratedProblem = true
          snapshot.forEach( (childSnap) => {
            forEachIndex++
            if(forEachIndex==0 && !childSnap.child('correct').exists() && !childSnap.child('mistake').exists() && !childSnap.child('skipped').exists()){
              //the student has only generated the next problem and not submitted any sort of response yet; do not use this problem in statistics
              attemptMadeOnMostRecentlyGeneratedProblem = false
            }else if(attemptMadeOnMostRecentlyGeneratedProblem && forEachIndex==pastXNumOfProblems){
              //the student has submitted some sort of response to the most recently generated problem; hence, we do not need to take the
              // final problem in the snapshot into account in order to have accurate stats for the pastXNumOfProblems
            }else{
              if(childSnap.child('skipped').exists()) numSkipped++
              if(childSnap.child('correct').exists()){
                numEventuallyCorrect++
                if(!childSnap.child('mistake').exists()) numCorrectOnFirstTry++
              }
              if(childSnap.child('mistake').exists()) numMistakes++
              if(childSnap.child('correct').exists() || childSnap.child('mistake').exists() || childSnap.child('skipped').exists()) problemsCounter++
              for(let mistakeType in MISTAKE){
                if(childSnap.child(MISTAKE[mistakeType]).exists()) numOfMistakeTypes[MISTAKE[mistakeType]]++
              }
            }
          })
          let uid = firebaseUID
          //TODO: Add identity feature back in
          //let identity = firebaseUID.displayName
          //TODO: update dispatch call so it has the variable for identity
          dispatch(updateFactorProblemStatistics(classID, difficultyMode, uid, numEventuallyCorrect, numCorrectOnFirstTry, numSkipped, numMistakes, numOfMistakeTypes, problemsCounter, displayName))
        }
      },
      error => {
        console.log(error)
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

export const updateClassIDsOwner = (classIDsOwnerList=[]) => {
  return {
    type: 'UPDATE_CLASS_CODE_OWNER_ID_LIST',
    classIDsOwnerList,
  }
}

export const addClassIDToOwnerList = (classID, className) => {
  return {
    type: 'ADD_CLASS_ID_TO_OWNER_LIST',
    classID,
    className,
  }
}

export function startUpdateClassIDsOwnerListener(){
  return async function(dispatch){

    let classIDsOwnerRef = firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/classIDsOwner')
    classIDsOwnerRef.on(
      'child_added',
      snapshot => {
        if(snapshot.val()!=null){
          let classID = snapshot.key
          firebase.database().ref('classIDs/'+classID+'/name').once(
            'value',
            snapshotName => {
              if(snapshotName.exists()) dispatch(addClassIDToOwnerList(classID, snapshotName.val()))
            },
            error => { console.log(error) }
          )
        }
      }
    )

  }
}

export function createNewClass(className) {
  return async function(dispatch, getState){


    let classNameAlreadyExists = () => {
      const ownedClassIDs = getState().classStatistics.classIDsOwnerList
      for(let classID in ownedClassIDs){
        if(ownedClassIDs[classID]['className']==className) return true
      }
      return false
    }

    if(classNameAlreadyExists()) return 'You already have a class with this name. Please pick a different name or change/delete the name of the existing class.'

    dispatch(databaseOperationInProgress())
    try{
      let newClassIDKey = firebase.database().ref().push().key
      await firebase.database().ref().update({ //NOTE: this is a multi-location update; full paths from the ref must be provided because data at each path will be overwritten
        ['classIDs/'+newClassIDKey] : {
          owners : {[firebase.auth().currentUser.uid] : true},
          timeCreated: firebase.database.ServerValue.TIMESTAMP,
          name: className,
        },
        ['users/'+firebase.auth().currentUser.uid+'/classIDsOwner/'+newClassIDKey] : true,
      })
      return 'success'
    }catch(e){
      return 'Error: '+e
    }finally{
      dispatch(databaseOperationFinishedSuccess())
    }
  }
}

export const updateCurrentClassCodeforClassID = (classID, currentClassCode=null) => {
  return {
    type: 'UPDATE_CURRENT_CLASS_CODE_FOR_CLASS_ID',
    classID,
    currentClassCode,
  }
}

export function getClassCode(classID, refreshRequested=false) {
  return async function(dispatch){
    //if(refreshRequested) dispatch(updateCurrentClassCodeforClassID(classID, ''))
    let classCode
    try{
      let currentClassCodeRef = firebase.database().ref('classIDs/'+classID+'/currentClassCode')
      let classCodeSnapshot = await currentClassCodeRef.once('value')
      if(classCodeSnapshot.exists() && !refreshRequested){
        classCode = classCodeSnapshot.val()
        return {
          classCode,
          isError: false,
          error: '',
        }
      }else{ //generate a new class code if one does not exist or user requested a refresh
        if(refreshRequested && classCodeSnapshot.exists()){ //delete existing class code if it exists
            classCode = classCodeSnapshot.val()
            await firebase.database().ref().update({
              ['classCodes/'+classCode] : null,
              ['classIDs/'+classID+'/currentClassCode'] : null,
            })
        }
        await dispatch(generateClassCode(classID))
        let generatedClassCodeSnapshot = await currentClassCodeRef.once('value')
        if(generatedClassCodeSnapshot.exists()){
          classCode = generatedClassCodeSnapshot.val()
          return {
            classCode,
            isError: false,
            error: '',
          }
        }else{
          return {
            classCode: '',
            isError: true,
            error: 'Failed to generate a class code. Please try again and ensure you are running the latest version of this app.',
          }
        }
      }
      //dispatch(updateCurrentClassCodeforClassID(classID, classCode))
    }catch(e){
      return {
        classCode: '',
        isError: true,
        error: e,
      }
    }

  }
}

export function generateClassCode(classID) {
  return async function(dispatch){

    const getRandomString = (length, chars='23456789ABCDEFGHJKLMNPQRSTUVWXYZ') => {
      let result = ''
      for (const i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result
    }

    dispatch(databaseOperationInProgress())

    let nonDuplicateClassCodeFound = false
    try{
      //TODO: Change this so that it tries a maximum of a certain number of times so that there is no risk of an infinite loop
      while(!nonDuplicateClassCodeFound){
        let classCode=getRandomString(6)
        //A transaction is used here to ensure a classCode just generated is not accidentally overwritten by somone who happens to generate the same exact classcode by change moments later
        let classCodeRef = firebase.database().ref('classCodes/'+classCode)
        let {committed, snapshot} = await classCodeRef.transaction( snapshot => { //var is needed so that these variables are available outside try block
          if(snapshot==null){
            return {
              classID : classID,
              timeCreated: firebase.database.ServerValue.TIMESTAMP,
            }
          }else{
            return; //abort the transaction if this classcode already exists
          }
        })

        /* In transactions, you cannot distingish between whether 'null' means data doesn't exist and data hasn't been loaded yet.
        The below checks whether the class code for the user now exists; if it does, then break out of the loop and stop trying to create a code */
        let checkRef = firebase.database().ref('classCodes/'+classCode+'/classID')
        let snapshot2 = await checkRef.once('value')
        if(snapshot2.exists()) nonDuplicateClassCodeFound = true

        // If class code was successfully created, list the class code as the active class code under the classID
        if(nonDuplicateClassCodeFound){
          await firebase.database().ref('classIDs/'+classID).update({
            ['currentClassCode'] : classCode,
          })
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

//TODO: Make it so uppercase class code can be entred
export function joinClassCodeGroup(classCode) {
  return async function(dispatch){
    dispatch(databaseOperationInProgress())
    try{
      let classCodeRef = firebase.database().ref('classCodes/'+classCode+'/classID') //there is no need to download every member of the class to check existence
      let snapshot = await classCodeRef.once('value')
      let classCodeExists = snapshot.exists()
      if(classCodeExists){
        let correspondingClassID = snapshot.val()
        let classCodeMemberRef = firebase.database().ref('classIDs/'+correspondingClassID+'/members/'+firebase.auth().currentUser.uid)
        await classCodeMemberRef.set(true)
        return 'success'
      }
      return 'The class code you entered does not exist. Try entering again. Check with your teacher to ensure the code is correct.' //class code does not exist
    }catch(e){
      return 'Error!: '+e
    }finally{
      dispatch(databaseOperationFinishedSuccess())
    }
  }
}
