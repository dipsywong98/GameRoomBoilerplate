function GameRoom(name) {
  this.name = name
  this.created = Date.now()
  this.players = {}
  this.addPlayer = function (player) {
    this.players[player.id] = player
    player.room = this
  }
  this.removePlayer = function (player) {
    this.players[player.name] = undefined
  }
  this.socketsOn = function (channel, callback) {
    Object.values(this.players).forEach(({ socket }) => socket.on(channel, callback))
  }
  this.socketsEmit = function (channel, ...params) {
    Object.values(this.players).forEach(({ socket }) => socket.emit(channel, ...params))
  }
  this.socketsRemoveAllListeners = channel => {
    Object.values(this.players).forEach(({ socket }) => socket.removeAllListeners(channel))
  }
  this.data = function () {
    return ({
      name: this.name,
      created: this.created,
      players: Object.values(this.players).map(player => player.data())
    })
  }
}

module.exports = GameRoom