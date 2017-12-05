import * as firebase from 'firebase'

export const incrementCounter = () => {
  return {
    type: 'INCREMENT',
  }
}

export const decrementCounter = () => {
  return {
    type: 'DECREMENT',
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

//THUNK
export function incrementUserValue(dataPath) {
  return function(dispatch){
    dispatch(databaseOperationInProgress())
    let user = firebase.auth().currentUser
    let ref = firebase.database().ref('users/'+user.uid+'/'+dataPath)

    ref.transaction( (dataValue) => {
        return dataValue + 1 //TRY TO FIGURE OUT HOW TO DELAY DATABASE TRANSACTIONS TO TEST IF THIS FUNCTIONALITY WORKS
      },
    ).then(
      dispatch(databaseOperationFinishedSuccess())
    )
  }
}

//THUNK
export function decrementUserValue(dataPath) {
  return function(dispatch){
    dispatch(databaseOperationInProgress())
    let user = firebase.auth().currentUser
    let ref = firebase.database().ref('users/'+user.uid+''+dataPath)
    return(
      ref.transaction( (dataValue) => {
          return dataValue>0 ? dataValue - 1 : 0
      }).then(
          dispatch(databaseOperationFinishedSuccess())
    ))
  }
}
