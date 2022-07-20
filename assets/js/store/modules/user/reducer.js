export default function clinic(state = {
  dentists: [],
  recepcionists: []
}, action) {
  switch (action.type) {
    case "INDEX_DENTIST":
      return { ...state, dentists: action.payload }
    case "INDEX_RECEPCIONIST":
      return { ...state, recepcionists: action.payload }
    default:
      return state;
  }
}
