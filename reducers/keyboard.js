export const keyboard = (state = {keyPressed: null, keyPressedAtTime: null }, action) => {
  switch (action.type) {
    case 'KEYBOARD_KEY_PRESSED':
      return {
        ...state,
        keyPressed : action.keyPressed,
        keyPressedAtTime : action.keyPressedAtTime
      }
    default:
      return state
  }
}
