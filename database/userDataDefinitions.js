import { getInitialFactorInputGroupLocalUIState } from '../components/FactorInputGroup'

//Increase version number if you want to add a new key to ensure that new keys are added to existing users
const newestVersion = 1.111111
export const getNewestVersion = () => newestVersion

//These are the default values that a new user would start with.
//add any new user data (e.g. email) within method addDefaultNewUserData()
const getDefaultNewUserData = (forFirebase=true) => {
  return {
    currentStreak : 0,
    maxStreak : 0,
    coolFactor: 1000,
    newFactor:10,
    mynewfactor:1000000,
    ...getModeDifficultyObjects(forFirebase),
  }
}

export const getDefaultNewUserDataForFirebase = () => getDefaultNewUserData(true)
export const getDefaultNewUserDataForLocalState = () => getDefaultNewUserData(false)

//Mode string definitions
export const MODE = {
  DIFFERENCE_OF_SQUARES : 'differenceOfSquares',
  TRINAOMIAL_A_IS_1 : 'trinomialAis1',
  TRINAOMIAL_A_IS_NOT_1 : 'trinomialAisNot1',
}

//Difficulty string definitions
export const DIFFICULTY = {
  EASY : 'easy',
  NORMAL : 'normal',
  HARD : 'hard',
  INSANE : 'insane',
}

export const getModeDifficultyKey = (mode, difficulty) =>{
  return mode+'_'+difficulty
}

export const STREAK = {
  CURRENT_STREAK : 'currentStreak',
  MAX_STREAK : 'maxStreak',
}

/*
 ModeDifficulty Objects currently look like...
 {differenceOfSquares_easy:{currentStreak:0, maxStreak:0}, ...}
*/
const getModeDifficultyObjects = (forFirebase) => {
  let newObj = {}
  for(const mode in MODE){
    for(const difficulty in DIFFICULTY){
      let modeDifficultyKey = getModeDifficultyKey(MODE[mode],DIFFICULTY[difficulty])
      newObj[modeDifficultyKey]={}

      //only local state needs to store ui state of factor group
      if(!forFirebase){
        newObj[modeDifficultyKey]['newFactorInputGroupLocalUIState'] = getInitialFactorInputGroupLocalUIState()
        newObj[modeDifficultyKey]['factorProblem'] = null
      }

      let modeDifficultyKeyUserAttempts = modeDifficultyKey+'_userAttemps'
      //newObj[modeDifficultyKeyUserAttempts]={}
      //newObj[modeDifficultyKeyUserAttempts]['mytestkey']=[1,2,3,4,5]

      newObj[modeDifficultyKey]['last50AttemptsWasCorrect']=true

      /*newObj[modeDifficultyKeyUserAttempts]['last50AttemptsWasCorrect'] = [null]
      newObj[modeDifficultyKeyUserAttempts]['last50AttemptsWasSkipped'] = [null]
      newObj[modeDifficultyKeyUserAttempts]['last20MissesErrorTypes'] = []
      newObj[modeDifficultyKeyUserAttempts]['last20MissesEquation'] = []
      newObj[modeDifficultyKeyUserAttempts]['last20MissesSubmissions'] = [] //shape: [[submissionForEqn1, submissionForEqn1], [submissionForEqn2, submissionForEqn2,...],...]
*/
      for(const streak in STREAK){
        //only the local state needs to store information about whether stuff is loading
        if(forFirebase){
          newObj[modeDifficultyKey][STREAK[streak]] = 0
        }else{
          newObj[modeDifficultyKey][STREAK[streak]] = {value:0, loading:true}
        }
      }
    }
  }
  return newObj
}