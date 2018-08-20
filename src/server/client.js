class Client{
  constructor(socket, clients){
    this.socket = socket
    this.clients = clients
    this.id = socket.id
    socket.on('player',player=>{
      console.log('player',player)
      this.name=player.name
      if(!player.room&&!!this.room)this.leaveRoom(this.room)
      this.room=player.room
    })
  }
  joinRoom(room){
    try{
      room.addPlayer(this)
      this.on('disconnect',this.leaveRoom)
    }catch(e){
      this.emit('alert',e)
    }
  }
  leaveRoom(room){
    room.players[this.id]=undefined
    this.removeAllListeners('disconnect')
  }
  on = (channel, action) => {
    this.socket.on(channel,action)
  }
  emit = (channel, signal) => {
    this.socket.emit(channel, signel)
  }
  removeAllListeners = channel => {
    this.socket.removeAllListeners(channel)
  }
  data(){return{
    id:this.id,
    name:this.name,
    // room:this.room
  }}
}

module.exports = Client