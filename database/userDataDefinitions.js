//Increase version number if you want to add a new key to ensure that new keys are added to existing users
const newestVersion = 1.06
export const getNewestVersion = () => newestVersion

//These are the default values that a new user would start with.
//add any new user data (e.g. email) within method addDefaultNewUserData()
const getDefaultNewUserData = (forFirebase=true) => {
  return {
    currentStreak : 0,
    maxStreak : 0,
    coolFactor: 1000,
    newFactor:10,
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
