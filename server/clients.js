const {createRoom,joinRoom,leaveRoom} = require('./lobby')

const init = ()=>{
  this.clients = {}
}

const onCreateRoom = (id,data)=>{
  console.log(`id ${id} call create room with data ${JSON.stringify(data)}`)
  const client = this.clients[id]
  try{
    createRoom(client,data)
    client.emit('player',{roomName:data.name})
  }catch(e){
    console.log(e)
  }
}

const onPlayer = (id, data)=>{
  console.log(`id ${id} call player with data ${JSON.stringify(data)}`)
  const client = this.clients[id]
  this.clients[id] = {...client, ...data}
  //some actions on the client

  if(client.roomName != data.roomName){
    if(client.roomName === '' && !!data.roomName){
      try{
        joinRoom(client,data.roomName)
        client.emit('player',{roomName})
      }catch(e){
        client.emit('alert',e)
      }
    }else if(!!client.roomName && data.roomName===''){
      try{
        leaveRoom(client)
        client.emit('player',{roomName:''})
      }catch(e){
        client.emit('alert',e)
      }
    }
    client.roomName = data.roomName
  }
  this.clients[id] = {...client, ...data}
}

const onDisconnect = (id, data)=>{
  const client = this.clients[id]
  console.log(id+'disconnected')
  delete this.clients[id] 
}

exports.newClient = (socket)=>{
  const {id} = socket
  this.clients[id] = {id,socket,roomName:''}
  this.clients[id].emit = function(...params){return socket.emit(...params)}
  socket.on('player',data=>onPlayer(id, data))
  socket.on('disconnect',data=>onDisconnect(id,data))
  socket.on('createRoom',data=>onCreateRoom(id,data))
  console.log('id '+id+' connected')
}

module.exports = (...params)=>{
  init(...params)
  return this
}