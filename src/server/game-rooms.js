const GameRoom = require('./game-room')
const Clients = require('./clients')

class GameRooms {
  constructor(app, io, clients) {
    this.app = app
    this.io = io
    this.rooms = {}
    console.log(clients)
    app.get('/gamerooms', (req, res) => {
      res.send(Object.values(this.rooms).reduce((obj,room)=>({...obj,[room.name]:room.data()}),{}))
    })
    app.get('/gamerooms/:id', (req, res) => {
      const id = req.params.id
      if (id in this.rooms) {
        res.send(this.rooms[id].data())
      } else {
        res.status(404)
        res.send({ message: 'no such gameroom' })
      }
    })
    app.post('/gamerooms', (req, res) => {
      console.log(req.body)
      if (!req.body.player) {
        res.status(409)
        res.send({ error: 'player is a required field' })
      } else {
        try {
          const player = clients.clients[req.body.player.id]
          const room = this.createRoom(player, req.body.options)
          res.send(room.data())
        } catch (error) {
          console.log(error)
          res.status(409)
          res.send({ error })
        }
      }
    })
    app.post('/gamerooms/:roomName', (req, res) => {
      console.log(req.params.roomName)
      try {
        const player = clients.clients[req.body.player.id]
        res.send(this.joinRoom(player, req.params.roomName).data())
      } catch (error) {
        console.log(error)
        res.status(409)
        res.send({ error })
      }
    })
  }
  createRoom(player, options = {}) {
    const newRoom = new GameRoom(options.name || player.state.name)
    if (newRoom.name in this.rooms) throw 'room already exists'
    newRoom.addPlayer(player)
    this.io.emit('lobby',newRoom.data())
    return this.rooms[newRoom.state.name] = newRoom
  }
  joinRoom(player, roomName) {
    if (roomName in this.rooms) {
      const room = this.rooms[roomName]
      room.addPlayer(player)
      this.io.emit('lobby',room.data())
      return room
    } else throw 'no such game room'
  }
}

const init = (app, io, clients) => new GameRooms(app, io, clients)

module.exports = init