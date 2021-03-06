var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Content-Type: application/json; charset=utf-8')
  next();
});

const lobby = require('./server/lobby')
lobby.init(app,io)
lobby.log()

const clients = require('./server/clients')(lobby)
const game = require('./server/game')
game.init()

const port = process.env.PORT || 80

server.listen(port);


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/build/index.html');
});

app.get('*.*', function (req, res) {
  res.sendFile(__dirname + '/build/' + req.url);
})

io.sockets.on('connection', function (socket) {
  clients.newClient(socket)
  socket.on('chatRoom', function (data) {
    console.log(data)
    io.sockets.emit('chatRoom', data)
  })
})

setTimeout(()=>io.emit('forceRefresh',0),500)

console.log('listening on port ' + port)