# GameRoom Boilderplate
A boidlerplate to kickstart a web gameroom backend and frontend in single server, where node modules and script can be shared between frontend and backend.
Base on that, a game with gameroom can be easily created.

## What is inside
### Server Side
1. expressjs
2. socket.io

### Client Side
1. react
2. react-redux
3. socket.io-client
4. react-ga (google-analytics)
5. @material-ui/core

## How to Use

### Development
The development of server side and client side is separated into two servers, since react-script do not generate a real bundle file during development and I am too lazy to solve it, which means **the static files that server linked are not updated. Only uses the client server to access the client stuffs during development.** Anyway this kind of development server is actually more convenient to use since it has hot reload (yeah).

#### Server Side Development

program entry point at `./index.js`

```bash
npm run server
```
Server will be started at localhost:80

#### Client Side Development

program entry point at `./src/index.js`

```bash
npm run client
```
Client will be start at localhost:3001

static stuffs should be put inside `./public/`

### Deloy
You may directly uses two server to host client and server, which is totally fine.
If you want to keep it one, you need to bundle the client side by:
```bash
npm run build
```
Then you can access the client side through the server
```bash
npm start
```

