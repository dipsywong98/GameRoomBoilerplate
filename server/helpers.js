exports.socketById = (io,id)=>{
  return io.sockets.connected[id]
}