const socketById = id => require('./helpers').socketById(this.io, id)

const roomSettings = ()=>({
  canPassword: true,
  playerRange: [2,2]  //-1 means no limit
})

const init = (app, io) => {
  this.app = app
  this.io = io
  this.rooms = {}
  this.games = {}
  this.text = 'hello'
  app.get('/gamerooms', (req, res) => {
    res.send(this.rooms)
  })
  app.get('/roomSettings', (req, res) => {
    res.send(roomSettings())
  })
  exports.io = this.io
}

const createRoom = (player, options) => {
  const name = options.name || player.name
  if (name in this.rooms) throw 'room already exists'
  const newRoom = {
    name,
    players: {},
    created: Date.now(),
    started: null,
    master: player.id,
    password: options.password || '',
    upperLimit: Math.min(options.upperLimit, roomSettings().playerRange[1])
  }
  this.rooms[newRoom.name] = newRoom
  console.log(player.id+' createdroom '+name)
  return joinRoom(player, name, options.password)
}

const joinRoom = (player, roomName, password) => {
  if (roomName in this.rooms) {
    const room = this.rooms[roomName]
    if(Object.keys(room.players).length >= room.upperLimit)throw `room ${roomName} is already full`
    if(room.password !== '' && password !== room.password)throw 'incorrect password'
    room.players[player.id] = {name:player.name, ready: false}
    this.io.emit('lobby', room)
    console.log(player.id+' joinroom '+roomName)
    return room
  } else throw 'no such game room'
}

const leaveRoom = (player) => {
  let roomName = ''
  if(!('roomName' in player)||((roomName = player.roomName)===''))return console.log('player dont belongs to room')
  if(!(roomName in this.rooms))return console.log('room '+roomName+' does not exist')
  const room = this.rooms[roomName]
  const { players } = room
  delete players[player.id]
  if (Object.keys(players).length === 0) {
    removeRoom(roomName)
  } else {
    if(player.id == room.master)room.master = Object.keys(room.players)[0]
    this.io.emit('lobby',this.rooms[roomName])
  }
}

const removeRoom = (roomName) => {
  console.log('remove room',roomName)
  delete this.rooms[roomName]
  this.io.emit('lobby',{ name: roomName, deleted: true })
  require('./game').endGame(roomName)
}

const kick = (roomName, id, kickedPlayer) => {
  const room = this.rooms[roomName]
  if(!room)return
  if(id!=room.master)return

  kickedPlayer.emit('player',{roomName: ''})
  leaveRoom(kickedPlayer)
  setTimeout(()=>kickedPlayer.emit('alert','you are kicked by room master'),100)
}

const getRoom = roomName => this.rooms[roomName]

const roomEmit = (roomName, channel, ...data) => {
  if(roomName in this.rooms){
    Object.keys(this.rooms[roomName].players).forEach(socketid=>socketById(socketid).emit(channel, ...data))
  } else {
    console.log(`publish: roomName ${roomName} not exist`)
  }
}

exports.log = () => console.log(this.text)
exports.kick = kick
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