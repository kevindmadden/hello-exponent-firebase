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
    default:
      return state
  }
}
