const {playerSocket} = require('./helpers')

const init = (app, io)=>{
  this.app = app
  this.io = io
  this.rooms = {}
  this.games = {}
  this.text = 'hello'
  app.get('/gamerooms', (req, res) => {
    res.send(this.rooms)
  })
  app.get('/gamerooms/:id', (req, res) => {
    const id = req.params.id
    if (id in this.rooms) {
      res.send(this.rooms[id])
    } else {
      res.status(404)
      res.send({ message: 'no such gameroom' })
    }
  })
  app.post('/gamerooms', (req, res) => {
    try {
      const room = createRoom(req.body.player, req.body.options)
      res.send(room)
    } catch (error) {
      res.status(409)
      res.send({ error })
    }
  })
  app.post('/gamerooms/:roomName', (req, res) => {
    console.log(req.params.roomName)
    try {
      res.send(joinRoom(req.body.player, req.params.roomName))
    } catch (error) {
      res.status(409)
      res.send({ error })
    }
  })
}

const createRoom = (player, options) => {
  const name = options.name || player.name
  if (name in this.rooms) throw 'room already exists'
  const newRoom = {
    name ,
    players: {},
    created: Date.now()
  }
  this.rooms[newRoom.name] = newRoom
  return joinRoom(player,name)
}

const joinRoom = (player, roomName) => {
  if (roomName in this.rooms) {
    const room = this.rooms[roomName]
    room.players[player.id]=player.name
    this.io.emit('lobby',room)
    playerSocket(this.io,player).on('disconnect',()=>leaveRoom(player,roomName))
    return room
  } else throw 'no such game room'
}

const leaveRoom = (player, roomName) => {
  const {players} = this.rooms[roomName]
  delete players[player.id]
  if(Object.keys(players).length === 0){
    removeRoom(roomName)
  }else{
    this.io.emit(this.rooms[roomName])
  }
}

const removeRoom = (roomName) => {
  delete this.rooms[roomName]
  this.io.emit({name:roomName,deleted:true})
}

exports.log = ()=>console.log(this.text)
exports.init = init
module.exports = (...params)=>{
  init(...params)
  return this
}