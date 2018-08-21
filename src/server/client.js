class Client {
  constructor(socket, clients) {
    console.log('client.js', clients)
    this.socket = socket
    this.clients = clients
    this.id = socket.id
    socket.on('player', player => {
      console.log('player', player)
      this.name = player.name
      if (!player.room && !!this.room) this.room.removePlayer(this)
    })
    this.on('disconnect', this.onDisconnect.bind(this))
  }
  onDisconnect() {
    console.log("disconnect", this.id)
    if (this.room) {
      this.room.removePlayer(this)
    }
    this.clients.clients[this.id] = undefined
  }
  on(channel, action) {
    this.socket.on(channel, action)
  }
  emit(channel, signal) {
    this.socket.emit(channel, signal)
  }
  removeAllListeners(channel) {
    this.socket.removeAllListeners(channel)
  }
  data() {
    return {
      id: this.id,
      name: this.name
    }
  }
}

module.exports = Client