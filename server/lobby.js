const {socketById} = require('./helpers')

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
  console.log(player.id+' createdroom '+name)
  return joinRoom(player, name)
}

const joinRoom = (player, roomName) => {
  if (roomName in this.rooms) {
    const room = this.rooms[roomName]
    room.players[player.id] = player.name
    this.io.emit('lobby', room)
    console.log(player.id+' joinroom '+roomName)
    return room
  } else createRoom(player,{name:roomName})//throw 'no such game room'
}

const leaveRoom = (player) => {
  let roomName = ''
  if(!('roomName' in player)||((roomName = player.roomName)===''))return console.log('player dont belongs to room')
  if(!(roomName in this.rooms))return console.log('room '+roomName+' does not exist')
  const { players } = this.rooms[roomName]
  delete players[player.id]
  if (Object.keys(players).length === 0) {
    removeRoom(roomName)
  } else {
    this.io.emit('lobby',this.rooms[roomName])
  }
}

const removeRoom = (roomName) => {
  delete this.rooms[roomName]
  this.io.emit('lobby',{ name: roomName, deleted: true })
}

const getRoom = roomName => this.rooms[roomName]
const roomEmit = (roomName, channel, ...data) => {
  if(roomName in this.rooms){
    Object.keys(this.rooms[roomName].players).forEach(socketid=>socketById(this.io,socketid).emit(channel, ...data))
  } else {
    console.log(`publish: roomName ${roomName} not exist`)
  }
}

exports.log = () => console.log(this.text)
exports.getRoom = getRoom
exports.joinRoom = joinRoom
exports.createRoom = createRoom
exports.leaveRoom = leaveRoom
exports.removeRoom = removeRoom
exports.roomEmit = roomEmit
exports.init = init
// module.exports = (...params) => {
//   init(...params)
//   return this
// }