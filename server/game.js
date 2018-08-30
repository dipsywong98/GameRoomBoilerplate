const {getRoom, roomEmit} = require('./lobby')

const init = ()=>{
  this.games = {}
}

const startGame = roomName => {
  const newGame = {roomName,started:true,players:{}}
  const players = getRoom(roomName).players
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