import io from 'socket.io-client'
import {store,setPlayer} from './store'
import root from './get-server-root'

const socket = io(root())

let id = -1

socket.on('connect',()=>{
  id = socket.id
  store.dispatch(setPlayer({id}))
  console.log('socket id',id)
})

socket.on('forceRefresh',()=>window.location.href = window.location.href)

socket.on('alert',string=>window.alert(string))

const on = (channel, callback) => socket.on(channel,callback)

const removeAllListeners = channel => socket.removeAllListeners(channel)

const emit = (channel, ...value) => socket.emit(channel, ...value)

export default {on, removeAllListeners, emit, id}