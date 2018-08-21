class Client{
  constructor(socket, clients){
    console.log('client.js',clients)
    this.state = {id:socket.id}
    this.socket = socket
    this.clients = clients
    socket.on('player',player=>{
      console.log('player',player)
      this.state = {...this.state, ...player}
      if(!player.room&&!!this.room)this.room.removePlayer(this)
    })
    this.on('disconnect',this.onDisconnect)
  }
  setState(newState){
    this.emit('player',newState)
    this.state = {...this.state,...newState}
  }
  onDisconnect = ()=>{
    console.log("disconnect",this.state.id)
    if(this.room){
      this.room.removePlayer(this)
    }
    this.clients.clients[this.id] = undefined
  }
  on = (channel, action) => {
    this.socket.on(channel,action)
  }
  emit = (channel, signal) => {
    this.socket.emit(channel, signal)
  }
  removeAllListeners = channel => {
    this.socket.removeAllListeners(channel)
  }
  data(){return{
    id:this.state.id,
    name:this.state.name
  }}
}

module.exports = Client