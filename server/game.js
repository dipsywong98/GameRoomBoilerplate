const {getRoom, roomEmit, io} = require('./lobby')
const socketById = id => require('./helpers').socketById(io,id)

const init = ()=>{
  this.games = {}
}

const initialState = ()=> ({
  winner: null,
  currentPlayer: 0,
  boxes: [[null,null,null],[null,null,null],[null,null,null]],
  symbol: ['O','X']
})

const startGame = roomName => {
  const newGame = {roomName,started:true,players_map:{},players:{},...initialState()}
  const room = getRoom(roomName)
  const players = room.players
  room.started = Date.now()
  io.emit('lobby',room)
  Object.keys(players).forEach((id,k)=>{
    newGame.players_map[id]=k
    newGame.players_map[k]=id
    newGame.players[id] = {name:players[id]}
    newGame.players[id].symbol = newGame.symbol[k]
  })
  //initialization of game
  newGame.currentPlayer = Math.floor(Math.random())

  //publish to everyone in game
  this.games[roomName] = newGame
  // console.log(roomName)
  roomEmit(roomName,'game',newGame)
}

const endGame = (roomName) => {
  delete this.games[roomName]
  roomEmit(roomName,'game',{started:false})
}

const onGame = (roomName, player_id, data)=>{
  const game = this.games[roomName]
  const index = game.players_map[player_id]
  if(!!game.winner)return
  if('place' in data && index === game.currentPlayer){
    const {place} = data
    const {boxes} = game
    if(boxes[place[0]][place[1]] === null){
      boxes[place[0]][place[1]] = game.symbol[index]
      game.currentPlayer = 1-game.currentPlayer
      roomEmit(roomName,'game',{boxes,currentPlayer:game.currentPlayer})
    }else{
      socketById(player_id).emit('alert','this box is already occupied')
    }
  }
  let symbol
  if((symbol = checkWinning(game))!==null){
    const winner_index = game.symbol.indexOf(symbol)
    const winner = game.players[game.players_map[winner_index]]
    roomEmit(roomName,'game',{winner})
    game.winner = winner
  }
}

const checkWinning = game => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  const squares = game.boxes.reduce((acc, val) => acc.concat(val))
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null
}

exports.init = init
exports.startGame = startGame
exports.endGame = endGame
exports.onGame = onGame