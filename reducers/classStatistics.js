import { getDefaultClassStatisticsState } from '../database/userDataDefinitions'

export const classStatistics = (state = getDefaultClassStatisticsState(), action) => {
  switch (action.type) {
    case 'ADD_USER_TO_CLASS_STATISTICS':
      return {
        ...state,
        [action.difficultyMode] : {
          ...state[action.difficultyMode],
          [action.uid] : {
            numCorrect: action.numCorrect,
            numSkipped: action.numSkipped,
            numMistakes: action.numMistakes,
            numOfMistakeTypes: action.numOfMistakeTypes,
            problemsCounter: action.problemsCounter,
            identity: action.identity,
          }
        }
      }
    default:
      return state
  }
}
