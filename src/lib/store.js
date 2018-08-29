import { createStore } from 'redux'
import socket from './socket-client-helper'

const reducer = (state = { lang: 'en', player: {roomName:''}, room: {} }, action) => {
  switch (action.type) {
    case 'CHANGE_LANG': return { ...state, lang: action.payload };
    case 'SET_PLAYER': return { ...state, player:{ ...state.player, ...action.payload } }
    case 'SET_ROOM': return { ...state, room: {...state.room, ...action.payload} }
    default: return state;
  }
}

const setLang = newLang => ({ type: 'CHANGE_LANG', payload: newLang })
const setPlayer = player => ({ type: 'SET_PLAYER', payload: player })
const setRoom = room => ({ type: 'SET_ROOM', payload: room })

const store = createStore(reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

store.subscribe(() => console.log(store.getState()))

socket.on('player',data=>{
  store.dispatch(setPlayer(data))
  console.log('set player')
})
socket.on('connect',()=>socket.emit('player',store.getState().player))

export {
  store,
  setLang,
  setPlayer,
  setRoom
}
