const Client = require('./client')

class Clients{
  constructor(){
    this.clients = {}
  }
  newClient(socket){
    this.clients[socket.id] = new Client(socket,this)
  }
  data(){
    return this.clients.map(client=>client.data())
  }
}

const init = ()=>new Clients()

module.exports = init