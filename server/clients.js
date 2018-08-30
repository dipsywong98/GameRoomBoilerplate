const {createRoom,joinRoom,leaveRoom} = require('./lobby')
const {startGame} = require('./game')

const init = ()=>{
  this.clients = {}
}

const onCreateRoom = (id,data)=>{
  console.log(`id ${id} call create room with data ${JSON.stringify(data)}`)
  const client = this.clients[id]
  try{
    const room = createRoom(client,data)
    client.emit('player',{roomName:room.name})
    client.roomName = room.name
  }catch(e){
    console.log(e)
    client.emit('alert',e)
  }
}

const onPlayer = (id, data)=>{
  console.log(`id ${id} call player with data ${JSON.stringify(data)}`)
  const client = this.clients[id]
  this.clients[id] = {...client, ...data}
  //some actions on the client
  if('name' in data){
    client.name = data.name
  }

  if('roomName' in data){
    if(data.roomName !== ''){
      try{
        console.log(id+' joinroom')
        leaveRoom(client)
        joinRoom(client,data.roomName)
        client.emit('player',{roomName:data.roomName})
        client.roomName = data.roomName
      }catch(e){
        console.log(e)
        client.emit('alert',e)
      }
    }
    if(data.roomName===''){
      try{
        console.log(id+' leaveroom',client.roomName)
        leaveRoom(client)
        client.emit('player',{roomName:''})
        client.roomName = ''
      }catch(e){
        console.log(e)
        client.emit('alert',e)
      }
    }
  }

  if('startGame' in data){
    startGame(client.roomName)
  }
  // this.clients[id] = {...client, ...data}
}

const onDisconnect = (id, data)=>{
  const client = this.clients[id]
  console.log(id+' disconnected and leave room')
  leaveRoom(client)
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