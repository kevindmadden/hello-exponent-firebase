import { combineReducers } from 'redux'
import { database } from './database'
import { userData } from './userData'
import { keyboard } from './keyboard'
import { classStatistics } from './classStatistics'

export const mainReducer = combineReducers({
  database,
  userData,
  keyboard,
  classStatistics,
})
