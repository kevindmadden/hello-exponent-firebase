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
export const databaseOperationsInProgress = (state = [], action) => {
  switch (action.type) {
    case 'DATABASE_OPERATION_IN_PROGRESS':
      return [...state, true]
    case 'DATABASE_OPERATION_FINISHED_SUCCESS':
      return state.length>0 ? state.slice(0,-1) : state
    default:
      return state
  }
}
