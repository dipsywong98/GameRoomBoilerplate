const { playerSocket } = require('./helpers')

const init = (app, io) => {
  this.app = app
  this.io = io
  this.rooms = {}
  this.games = {}
  this.text = 'hello'
  app.get('/gamerooms', (req, res) => {
    res.send(this.rooms)
  })
}

const createRoom = (player, options) => {
  const name = options.name || player.name
  if (name in this.rooms) throw 'room already exists'
  const newRoom = {
    name,
    players: {},
    created: Date.now()
  }
  this.rooms[newRoom.name] = newRoom
  return joinRoom(player, name)
}

const joinRoom = (player, roomName) => {
  if (roomName in this.rooms) {
    const room = this.rooms[roomName]
    room.players[player.id] = player.name
    this.io.emit('lobby', room)
    playerSocket(this.io, player).on('disconnect', () => leaveRoom(player, roomName))
    return room
  } else throw 'no such game room'
}

const leaveRoom = (player, roomName) => {
  const { players } = this.rooms[roomName]
  delete players[player.id]
  if (Object.keys(players).length === 0) {
    removeRoom(roomName)
  } else {
    this.io.emit(this.rooms[roomName])
  }
}

const removeRoom = (roomName) => {
  delete this.rooms[roomName]
  this.io.emit({ name: roomName, deleted: true })
}

exports.log = () => console.log(this.text)
exports.joinRoom = joinRoom
exports.createRoom = createRoom
exports.leaveRoom = leaveRoom
exports.removeRoom = removeRoom
exports.init = init
// module.exports = (...params) => {
//   init(...params)
//   return this
// }