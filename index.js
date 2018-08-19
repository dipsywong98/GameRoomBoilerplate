var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });
const gamerooms = require('./src/server/game-rooms')(app,io)

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
 socket.on('chatRoom/lobby', function (data) {
   console.log(data)
    //boardcast the data to all clients(io.sockets) through client channel
   io.sockets.emit('chatRoom', data)
 })
})

console.log('listening on port '+port)