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
  const newRoom = {
    name: options.name || player.name,
    players: {[player.id]:player.name},
    created: Date.now()
  }
  if (newRoom.name in this.rooms) throw 'room already exists'
  this.io.emit('lobby',newRoom)
  return this.rooms[newRoom.name] = newRoom
}

const joinRoom = (player, roomName) => {
  if (roomName in this.rooms) {
    const room = this.rooms[roomName]
    room.players[player.id]=player.name
    this.io.emit('lobby',room)
    return room
  } else throw 'no such game room'
}

exports.log = ()=>console.log(this.text)
exports.init = init
module.exports = (...params)=>{
  init(...params)
  return this
}