import io from 'socket.io-client'
import {store,setPlayer} from './store'

const socket = io(window.location.href.indexOf('localhost')!==-1?'http://localhost:80':'')

let id = -1

socket.on('connect',()=>{
  id = socket.id
  store.dispatch(setPlayer({id}))
  console.log('socket id',id)
})

socket.on('alert',string=>window.alert(string))

const on = (channel, callback) => socket.on(channel,callback)

const removeAllListeners = channel => socket.removeAllListeners(channel)

const emit = (channel, ...value) => socket.emit(channel, ...value)

export default {on, removeAllListeners, emit, id}