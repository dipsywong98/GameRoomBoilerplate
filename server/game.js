const {getRoom, roomEmit, io} = require('./lobby')

const init = ()=>{
  this.games = {}
}

const startGame = roomName => {
  const newGame = {roomName,started:true,players:{}}
  const room = getRoom(roomName)
  const players = room.players
  room.started = Date.now()
  io.emit('lobby',room)
  Object.keys(players).forEach(id=>newGame.players[id]={})
  this.games[roomName] = newGame
  roomEmit(roomName,'game',newGame)
}

const endGame = (roomName) => {
  delete this.games[roomName]
  roomEmit(roomName,'game',{started:false})
}

exports.init = init
exports.startGame = startGame
exports.endGame = endGame