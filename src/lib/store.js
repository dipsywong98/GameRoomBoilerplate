import { createStore } from 'redux'
import socket from './socket-client-helper'
import request from 'request'
import root from './get-server-root'

const defaultModal = () => ({
  title: '',
  text: '',
  buttons: [{
    text: 'CLOSE',
    color: 'secondary',
    variant: null
  }],
  show: false
})

const reducer = (state = { lang: 'en', player: { roomName: '' }, game: { started: false }, uiState: 0, lobby: {}, modal: defaultModal() }, action) => {
  switch (action.type) {
    case 'CHANGE_LANG': return { ...state, lang: action.payload };
    case 'SET_PLAYER':
      if (state.uiState === 1 && action.payload.roomName !== '') state = reducer(state, setUiState(2))
      else if (state.uiState > 1 && action.payload.roomName === '') state = reducer(state, setUiState(1))
      return { ...state, player: { ...state.player, ...action.payload } }
    case 'SET_GAME':
      if (state.uiState === 2 && action.payload.started) state = reducer(state, setUiState(3))
      if (state.uiState === 3 && action.payload.result) state = reducer(state, setUiState(4))
      return { ...state, game: { ...state.game, ...action.payload } }
    case 'SET_UI_STATE':
      const uiState = action.payload
      if (uiState === 1 || uiState === 2) {
        if (state.uiState !== 1 && state.uiState !== 2) {
          request.get(root() + 'gamerooms', (err, httpResponse, body) => {
            console.log({ err, httpResponse, body })
            if (httpResponse.statusCode === 200) {
              store.dispatch(initLobby(JSON.parse(body)))
            } else {
              window.alert(body)
            }
          })
          socket.on('lobby', data => store.dispatch(setLobby(data)))
        }
      } else {
        socket.removeAllListeners('lobby')
      }
      return { ...state, uiState }
    case 'SET_LOBBY':
      console.log('set lobby', action.payload)
      let lobby = { ...state.lobby }
      lobby[action.payload.name] = action.payload
      if (action.payload.deleted) delete lobby[action.payload.name]
      return { ...state, lobby }
    case 'INIT_LOBBY':
      console.log('initlobby', action.playload)
      return { ...state, lobby: { ...action.payload } }
    case 'SET_MODAL':
      return { ...state, modal: { ...defaultModal(), ...action.payload } }
    default: return state;
  }
}

const setLang = newLang => ({ type: 'CHANGE_LANG', payload: newLang })
const setPlayer = player => ({ type: 'SET_PLAYER', payload: player })
const setGame = game => ({ type: 'SET_GAME', payload: game })
const setUiState = state => ({ type: 'SET_UI_STATE', payload: state })
const setLobby = lobby => ({ type: 'SET_LOBBY', payload: lobby })
const initLobby = lobby => ({ type: 'INIT_LOBBY', payload: lobby })
const setModal = modal => ({ type: 'SET_MODAL', payload: modal })

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
  initLobby,
  setModal
}
