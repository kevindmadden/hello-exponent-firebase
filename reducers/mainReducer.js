import { combineReducers } from 'redux'
import { database } from './database'
import { userData } from './userData'
import { keyboard } from './keyboard'

export const mainReducer = combineReducers({
  database,
  userData,
  keyboard,
})
