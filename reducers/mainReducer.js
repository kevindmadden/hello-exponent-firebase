import { combineReducers } from 'redux'
import { counter } from './counter'
import { databaseOperationsInProgress } from './databaseOperationsInProgress'

export const mainReducer = combineReducers({
  counter,
  databaseOperationsInProgress,
  //visibilityFilter
})
