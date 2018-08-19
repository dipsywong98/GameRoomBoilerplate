class GameRooms {
  constructor(app, io) {
    this.app = app
    this.io = io
    this.rooms = {}
    app.get('/gamerooms', (req, res) => {
      res.send(this.rooms)
    })
    app.get('/gamerooms/:id', (req, res) => {
      const id = req.params.id
      if (id in this.rooms) {
        res.send(this.rooms[id])
      } else {
        res.send({ message: 'no such gameroom' })
        res.status(404)
      }
    })
    app.post('/gamerooms', (req, res) => {
      console.log(req.body)
      if (!req.body.player) {
        res.status(409)
        res.send({ error: 'player is a required field' })
      } else {
        try {
          const room = this.createRoom(req.body.player, req.body.options)
          res.send(room)
        } catch (error) {
          res.status(409)
          res.send({ error })
        }
      }
    })
    app.post('/gamerooms/:roomName', (req, res) => {
      console.log(req.params.roomName)
      try {
        res.send(this.joinRoom(req.body.player, req.params.roomName))
      } catch (error) {
        res.status(409)
        res.send({ error })
      }
    })
  }
  createRoom(player, options = {}) {
    const newRoom = {
      name: options.name || player.name,
      players: [player],
      created: Date.now()
    }
    if (newRoom.name in this.rooms) throw 'room already exists'
    return this.rooms[newRoom.name] = newRoom
  }
  joinRoom(player, roomName) {
    if (roomName in this.rooms) {
      const room = this.rooms[roomName]
      room.players.push(player)
      return room
    } else throw 'no such game room'
  }
}

const init = (app, io) => new GameRooms(app, io)

module.exports = init