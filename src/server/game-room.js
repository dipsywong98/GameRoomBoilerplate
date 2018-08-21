class GameRoom{
  constructor(name){
    this.name = name
    this.created = Date.now()
    this.players = {}
    this.subscritions = []
  }
  addPlayer(player){
    this.players[player.id] = player
    player.room = this
    this.socketsEmit('room',this.data())
    this.subscritions.forEach(({channel,callback})=>player.on(channel,callback))
  }
  removePlayer(player){
    delete this.players[player.id]
    player.room = undefined
    player.emit('player',player.data())
    player.emit('room',undefined)
    console.log('removeplayer',this)
    this.socketsEmit('room',this.data())
  }
  socketsOn(channel, callback){
    this.subscritions.push({channel, callback})
    Object.values(this.players).forEach(({socket})=>socket.on(channel,callback))
  }
  socketsEmit(channel,...params){
    Object.values(this.players).forEach(({socket})=>socket.emit(channel,...params))
  }
  socketsRemoveAllListeners (channel) {
    this.subscritions = this.subscritions.filter(({channel:ch})=>channel!=ch)
    Object.values(this.players).forEach(({socket})=>socket.removeAllListeners(channel))
  }
  data(){
    console.log(this.players)
    return{
    name:this.name,
    created:this.created,
    players:Object.values(this.players).map(player=>player.data())
  }}
}

module.exports = GameRoom