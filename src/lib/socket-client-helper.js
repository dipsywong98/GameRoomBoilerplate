import io from 'socket.io-client'

const socket = io('http://localhost:80')

const subscribe = (channel, callback) => socket.on(channel,callback)

const unsubscribe = channel => socket.removeAllListeners(channel)

const emit = (channel, ...value)=>socket.emit(channel, ...value)

export {subscribe,unsubscribe, emit}