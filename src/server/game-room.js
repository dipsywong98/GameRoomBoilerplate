class GameRoom{
  constructor(name){
    this.state = {name,created:Date.now(),players:{}}
    console.log(this.state)
    this.dataCache = {}
    this.subscritions = []
  }
  setState(newState){
    this.state = {...this.state,...newState}
    this.dataCache = this.data()
    console.log(this.dataCache)
    this.socketsEmit('room',this.dataCache)
  }
  addPlayer(player){
    this.state.players[player.state.id] = player
    this.setState(this.state.players)
    player.room = this
    this.socketsEmit('room',this.data())
    this.subscritions.forEach(({channel,callback})=>player.on(channel,callback))
  }
  removePlayer(player){
    this.state.players[player.state.name] = undefined
    this.setState(this.state.players)
    player.setState({room:undefined})
    player.emit('room',{})
    this.socketsEmit('room',this.data())
  }
  socketsOn(channel, callback){
    this.subscritions.push({channel, callback})
    Object.values(this.state.players).forEach(({socket})=>socket.on(channel,callback))
  }
  socketsEmit(channel,...params){
    Object.values(this.state.players).forEach(({socket})=>socket.emit(channel,...params))
  }
  socketsRemoveAllListeners = channel => {
    this.subscritions = this.subscritions.filter(({channel:ch})=>channel!=ch)
    Object.values(this.state.players).forEach(({socket})=>socket.removeAllListeners(channel))
  }
  data(){
    console.log('this.state.players',this.state.players)
    return{
    name:this.state.name,
    created:this.state.created,
    players:Object.values(this.state.players).map(player=>player.data())
  }}
}

module.exports = GameRoom