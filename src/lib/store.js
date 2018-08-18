import { createStore } from 'redux'

const reducer = (state = { lang: 'en', player:{}}, action) => {
  switch (action.type) {
    case 'CHANGE_LANG': return { ...state, lang: action.payload };
    case 'SET_PLAYER': return { ...state, player:{...state.player,...action.payload}}
    default: return state;
  }
}

const setLang = newLang => ({ type: 'CHANGE_LANG', payload:newLang })
const setPlayer = player => ({ type: 'SET_PLAYER', payload:player })

const store = createStore(reducer)

store.subscribe(() => console.log(store.getState()))

export {
  store,
  setLang,
  setPlayer
}
