import { createStore } from 'redux'
import socket from './socket-client-helper'

const reducer = (state = { lang: 'en', player: {}, room: {} }, action) => {
  switch (action.type) {
    case 'CHANGE_LANG': return { ...state, lang: action.payload };
    case 'SET_PLAYER':
      const player = { ...state.player, ...action.payload }
      socket.emit('player', player)
      return { ...state, player }
    case 'SET_ROOM': return { ...state, room: {...state.room, ...action.payload} }
    default: return state;
  }
}

const setLang = newLang => ({ type: 'CHANGE_LANG', payload: newLang })
const setPlayer = player => ({ type: 'SET_PLAYER', payload: player })
const setRoom = room => ({ type: 'SET_ROOM', payload: room })

const store = createStore(reducer)

store.subscribe(() => console.log(store.getState()))

export {
  store,
  setLang,
  setPlayer,
  setRoom
}
