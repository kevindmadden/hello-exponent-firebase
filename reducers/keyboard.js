export const keyboard = (state = {keyPressed: null, keyPressedAtTime: null, mode:'Submit' }, action) => {
  switch (action.type) {
    case 'KEYBOARD_KEY_PRESSED':
      return {
        ...state,
        keyPressed : action.keyPressed,
        keyPressedAtTime : action.keyPressedAtTime
      }
    case 'CHANGE_KEYBOARD_MODE':
      return {
        ...state,
        mode : action.mode,
      }
    default:
      return state
  }
}
