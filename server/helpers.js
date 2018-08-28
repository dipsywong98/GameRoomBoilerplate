// exports.init = (io)=>{
//   this.io = io
// }
exports.playerSocket = (io,{id})=>{
  return io.sockets.connected[id]
}

// module.exports = (...params)=>{
//   init(...params)
//   return this
// }