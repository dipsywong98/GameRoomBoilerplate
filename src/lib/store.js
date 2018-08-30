import { createStore } from 'redux'
import socket from './socket-client-helper'

const reducer = (state = { lang: 'en', player: { roomName: '' }, game: { started: false }, uiState: 0, lobby: {} }, action) => {
  switch (action.type) {
    case 'CHANGE_LANG': return { ...state, lang: action.payload };
    case 'SET_PLAYER':
      if(state.uiState === 1 && action.payload.roomName !== '')state.uiState = 2
      else if(state.uiState > 1 && action.payload.roomName === '')state.uiState = 1
      return { ...state, player: { ...state.player, ...action.payload } }
    case 'SET_GAME': return { ...state, game: { ...state.game, ...action.payload } }
    case 'SET_UI_STATE':
      const uiState = action.payload
      if (uiState === 1 || uiState === 2) {
        if (state.uiState !== 1 && state.uiState !== 2) {
          socket.on('lobby', data => store.dispatch(setLobby(data)))
        }
      } else {
        socket.removeAllListeners('lobby')
      }
      return { ...state, uiState }
    case 'SET_LOBBY':
      state.lobby[action.payload.name] = action.payload
      if (action.payload.deleted) delete state.lobby[action.payload.name]
      return state
    case 'INIT_LOBBY':
      return {...state,lobby:action.payload}
    default: return state;
  }
}

const setLang = newLang => ({ type: 'CHANGE_LANG', payload: newLang })
const setPlayer = player => ({ type: 'SET_PLAYER', payload: player })
const setGame = game => ({ type: 'SET_GAME', payload: game })
const setUiState = state => ({ type: 'SET_UI_STATE', payload: state })
const setLobby = lobby => ({ type: 'SET_LOBBY', payload: lobby })
const initLobby = lobby => ({ type: 'INIT_LOBBY', payload: lobby})

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

// store.subscribe(() => console.log(store.getState()))

socket.on('player', data => {
  store.dispatch(setPlayer(data))
  console.log('set player')
})
socket.on('game', data => {
  store.dispatch(setGame(data))
  console.log('set game')
})
socket.on('connect', () => socket.emit('player', store.getState().player))

export {
  store,
  setLang,
  setPlayer,
  setGame,
  setUiState,
  initLobby
}
