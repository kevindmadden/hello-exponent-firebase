import { getDefaultNewUserDataForLocalState } from '../database/userDataDefinitions'

export const userData = (state = getDefaultNewUserDataForLocalState(), action) => {
  switch (action.type) {
    case 'UPDATE_USER_STREAK_IN_LOCAL_STATE':
      return {
        ...state,
        [action.difficultyMode] : {
          ...state[action.difficultyMode],
          [action.streakType] : {
            value : action.newStreakValue,
            loading : action.loading,
          }
        }
      }
    case 'UPDATE_FACTOR_INPUT_GROUP_LOCAL_UI_STATE' :
      return {
        ...state,
        [action.difficultyMode] : {
          ...state[action.difficultyMode],
          newFactorInputGroupLocalUIState : action.newFactorInputGroupLocalUIState,
        }
      }
    case 'UPDATE_FACTOR_INPUT_GROUP_LOCAL_UI_ACTIVE_BOX' :
      return {
        ...state,
        [action.difficultyMode] : {
          ...state[action.difficultyMode],
          newFactorInputGroupLocalUIState : {
            ...state[action.difficultyMode]['newFactorInputGroupLocalUIState'],
            activeBox: action.activeBoxName,
          },
        }
      }
    case 'SET_NEW_FACTOR_PROBLEM' :
      return {
        ...state,
        [action.difficultyMode] : {
          ...state[action.difficultyMode],
          factorProblem : action.factorProblem,
        }
      }
    default:
      return state
  }
}
