var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const port = process.env.PORT || 80

server.listen(port);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/build/index.html');
});

app.get('*.*',function(req,res){
  res.sendFile(__dirname + '/build/'+req.url);
})

io.sockets.on('connection', function (socket) {
  //socket is the newly connected client, say hello to him through 'server' channel
 socket.emit('server', 'welcome to simple chat room')
  //when the new client emit data through client 
 socket.on('chatRoom', function (data) {
   console.log(data)
    //boardcast the data to all clients(io.sockets) through client channel
   io.sockets.emit('chatRoom', data)
 })
})

console.log('listening on port '+port)