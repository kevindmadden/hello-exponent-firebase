import { getDefaultClassStatisticsState } from '../database/userDataDefinitions'

export const classStatistics = (state = getDefaultClassStatisticsState(), action) => {
  switch (action.type) {
    case 'ADD_USER_TO_CLASS_STATISTICS':
      return {
        ...state,
        [action.classID] : {
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
      }
    case 'UPDATE_CLASS_CODE_OWNER_ID_LIST':
      return {
        ...state,
        classIDsOwnerList: action.classIDsOwnerList,
      }
    case 'ADD_CLASS_ID_TO_OWNER_LIST':
      return {
        ...state,
        classIDsOwnerList: {
          ...state.classIDsOwnerList,
          [action.classID]: {
            ...state.classIDsOwnerList[action.classID],
            className: action.className,
          },
        }
      }
    case 'UPDATE_CURRENT_CLASS_CODE_FOR_CLASS_ID':
      return {
          ...state,
          classIDsOwnerList: {
            ...state.classIDsOwnerList,
            [action.classID] : {
              ...state.classIDsOwnerList[action.classID],
              currentClassCode: action.currentClassCode,
            }
          }
      }
    default:
      return state
  }
}
