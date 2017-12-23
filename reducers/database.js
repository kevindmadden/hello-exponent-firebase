/*
An element (true) is added to databaseOperationsInProgress array right before any write/update/read
to the database. An element is removed from the databaseOperationsInProgress array immediately after
a successful operation on the database.
There should be a listener attached elsewhere to observe the databaseOperationsInProgress array.
If there are no elements in the databaseOperationsInProgress array, then the listener should
call firebase method to go offline: firebase.database().goOffline(). If there are elements in the
array, the listener should call firebase.database().goOnline()
This process ensures that goOffline is only called
*/
export const database = (state = {operationsInProgress:[], tryingToReconnect:false, isOnline:false}, action) => {
  switch (action.type) {
    case 'DATABASE_OPERATION_IN_PROGRESS':
      return{
        ...state,
        operationsInProgress: [...state.operationsInProgress, true],
      }
    case 'DATABASE_OPERATION_FINISHED_SUCCESS':
      return{
        ...state,
        operationsInProgress: state.operationsInProgress.length>0 ? state.operationsInProgress.slice(0,-1) : state.operationsInProgress,
      }
    case 'DATABASE_CONNECTION_DISRUPTION_DETECTED':
      return{
        ...state,
        tryingToReconnect:true,
      }
    case 'DATABASE_CONNECTION_DISRUPTION_FIXED':
      return{
        ...state,
        tryingToReconnect:false,
      }
    case 'DATABASE_IS_ONLINE':
      return{
        ...state,
        isOnline:true,
      }
    case 'DATABASE_IS_OFFLINE':
      return{
        ...state,
        isOnline:false,
      }
    default:
      return state
  }
}
