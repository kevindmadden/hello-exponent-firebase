import { connect } from 'react-redux'
import { FactorQuizScreenPresentation } from '../screens/FactorQuizScreenPresentation'
import { incrementUserStreakValues, resetUserCurrentStreakValue,
startUserDifficultyListener, stopUserDifficultyListener } from '../actions/mainActions'
import { getModeDifficultyKey, STREAK } from '../database/userDataDefinitions'

const mapStateToProps = (state, ownProps) => {
  let difficultyMode = getModeDifficultyKey(ownProps.navigation.state.params.mode,ownProps.navigation.state.params.difficulty)
  return {
    currentStreak: state.userData[difficultyMode][STREAK.CURRENT_STREAK]['value'],
    maxStreak: state.userData[difficultyMode][STREAK.MAX_STREAK]['value'],
    tryingToReconnect: state.database.tryingToReconnect,
    isOnline: state.database.isOnline,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  let difficultyMode = getModeDifficultyKey(ownProps.navigation.state.params.mode,ownProps.navigation.state.params.difficulty)
  return {
    resetCurrentStreak: () => {
      dispatch(resetUserCurrentStreakValue(difficultyMode))
    },
    incrementStreakValues: () => {
      dispatch(incrementUserStreakValues(difficultyMode))
    },
    turnOnDatabaseListeners: () => {
      console.log('turning on listnerrs!!!!!!')
      dispatch(startUserDifficultyListener(difficultyMode))
    },
    turnOffDatabaseListeners: () => {
      console.log('turning OFF listnerrs!!!!!!')
      dispatch(stopUserDifficultyListener(difficultyMode))
    },
  }
}

export const FactorQuizScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(FactorQuizScreenPresentation)
