import io from 'socket.io-client'

const socket = io(window.location.href.indexOf('localhost')!==-1?'http://localhost:80':'')

const on = (channel, callback) => socket.on(channel,callback)

const removeAllListeners = channel => socket.removeAllListeners(channel)

const emit = (channel, ...value) => socket.emit(channel, ...value)

export default {on, removeAllListeners, emit}