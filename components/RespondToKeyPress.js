import { getInitialFactorInputGroupLocalUIState } from '../components/FactorInputGroup'

export const updateFactorInputGroupLocalUIState = (difficultyMode, newObj) => {
  return {
    type: 'UPDATE_FACTOR_INPUT_GROUP_LOCAL_UI_STATE',
    difficultyMode : difficultyMode,
    newFactorInputGroupLocalUIState : newObj
  }
}

export const updateFactorInputGroupLocalUIActiveBox = (difficultyMode, activeBoxName) => {
  return {
    type: 'UPDATE_FACTOR_INPUT_GROUP_LOCAL_UI_ACTIVE_BOX',
    difficultyMode: difficultyMode,
    activeBoxName: activeBoxName,
  }
}

export function updateInputUIState(keyValue, groupType, difficultyMode){
  return async function(dispatch, getState){
    if(groupType=='factorGroup'){
      if(keyValue=='Next Problem'){
        dispatch(updateFactorInputGroupLocalUIState(difficultyMode, getInitialFactorInputGroupLocalUIState()))
      }else{
        dispatch(updateFactorInputGroupLocalUIState(difficultyMode, respondToKeyPressFactorGroup(getState(), keyValue, groupType, difficultyMode)))
      }
    }
  }
}

function respondToKeyPressFactorGroup(state, keyValue, groupType, difficultyMode){
  let activeGroup = state.userData[difficultyMode]['newFactorInputGroupLocalUIState']

  let activeBox = (() => {
    let name = activeGroup['activeBox']
    let attributes = activeGroup[name]
    let text = attributes.text
    let textLastChar = text.slice(-1)
    let index = activeGroup.nextOrder.indexOf(name)
    return {name, attributes, text, textLastChar, index}
  })()

  let nextBox = (() => {
    if(activeBox.index===-1) console.error(''+activeBox.name+' is not included in the nextOrder array')
    let isWrapped = activeBox.index==(activeGroup.nextOrder.length-1) ? true : false
    let name = isWrapped===false ? activeGroup.nextOrder[activeBox.index+1] : activeGroup.nextOrder[0]
    let attributes = activeGroup[name]
    let text = attributes.text
    let textLastChar = text.slice(-1)
    return {isWrapped, name, attributes, text, textLastChar}
  })()

  let newActiveGroupObj = {
    updates: {},
    successful: false,
  }

  if(keyValue === 'Next'){
    newActiveGroupObj = {updates: {activeBox: nextBox.name}, successful: true }
  }else if(keyValue === '+' || keyValue === '-'){
    if(keyValue==='-') keyValue='-' //bad not actual minus sign: −
    newActiveGroupObj = tryWritingSign(activeBox, nextBox, keyValue)
  }else if(keyValue === 'x'){
    newActiveGroupObj = tryWritingVariable(activeBox, nextBox, keyValue)
  }else if(keyValue === '²'){
    //this.tryWritingSquare(activeBox, boxText, boxTextLastChar, keyValue, this.noSquaredVariables)
  }else if([1,2,3,4,5,6,7,8,9,0].indexOf(keyValue)>-1){
    newActiveGroupObj = tryWritingNumeral(activeBox, nextBox, activeGroup.maxNumberSize, keyValue)
  }else if(keyValue === 'Delete'){
    newActiveGroupObj = {updates: {[activeBox.name] : {...activeBox.attributes, text: activeBox.text.slice(0,-1)}}} //this.setState({[activeBox] : boxText.slice(0,-1) })
  }

  return {
    ...activeGroup,
    ...newActiveGroupObj.updates,
  }

}

export function onPress(boxName){
  this.props.onPress()
  this.props.updateInputUIStateActiveBox(boxName)
}

function tryWritingNumeral(activeBox, nextBox, maxNumberSize, keyValue){
  let successful = false
  let updates = {}
  if(activeBox.attributes.acceptsNumeral){
    if(activeBox.textLastChar==='x' || activeBox.textLastChar==='²'){
      //numbers cannot come immediately after a variable or squared variable
    }else if(activeBox.text.length>=maxNumberSize){
      //do not allow number to be entered greater than max size
    }else if(keyValue==0 && activeBox.text.length==0){
      //0 cannot be first numeral entered
    }else{
      updates[activeBox.name] = {...activeBox.attributes, text:activeBox.text+''+keyValue}
      successful = true
    }
  }
  //if number is entered when focus is on leading sign box, move focus to next number box and enter value
  //this is handy if the leading value is positive and the sign box needs to be blank
  if(activeBox.attributes.acceptsSign && nextBox.attributes.acceptsNumeral){
    if(nextBox.text.length==0 && keyValue!=0){ //if there is nothing in the numeral box and key value is not 0
      if(activeBox.text.length>0 || (activeBox.attributes.leadingSignBox)){
      //^if sign has already been filled in or if it can be empty due to the box being a leading sign box
        updates.activeBox=nextBox.name
        updates[nextBox.name] = {...nextBox.attributes, text:''+keyValue}
        successful = true
      }
    }
  }
  return {updates, successful}
}

function tryWritingVariable(activeBox, nextBox, keyValue){
  let successful = false
  let updates = {}
  if(activeBox.attributes.acceptsVariable){
    if(activeBox.textLastChar==='x' || activeBox.textLastChar==='²'){
      //cannot have two variables in a row
    }else{
      updates[activeBox.name] = {...activeBox.attributes, text:activeBox.text+''+keyValue}
      if(!activeBox.attributes.acceptsSquaredVariable) updates.activeBox=nextBox.name //move focus if variable cannot be squared
      successful = true
    }
  }
  return {updates, successful}
}

function tryWritingSign(activeBox, nextBox, keyValue){
  let successful = false
  let updates = {}
  if(activeBox.attributes.acceptsSign){
    updates[activeBox.name] = {...activeBox.attributes, text: ''+keyValue}
    if(nextBox.isWrapped===false && nextBox.text=='') updates.activeBox=nextBox.name
    successful = true
  }else{
    if(nextBox.attributes.acceptsSign && nextBox.text=='' && activeBox.text!='' && nextBox.isWrapped===false){
      updates.activeBox=nextBox.name
      updates[nextBox.name] = {...nextBox.attributes, text: ''+keyValue}
      successful = true
    }
  }
  return {updates, successful}
}

function tryWritingSquare(activeBox, boxText, boxTextLastChar, keyValue, noSquaredVariables){
  /*if( boxTextLastChar==='x' && !noSquaredVariables ){
    this.writeKeyToBox(activeBox, keyValue)
    this.attemptToMoveFocus(activeBox)
  }*/
}
