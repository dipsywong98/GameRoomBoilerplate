import React, { Component } from 'react'
import { Typography, Grid, Button, TextField, Card } from '@material-ui/core/index'
import request from 'request'
import socket from '../lib/socket-client-helper'
import withPlayer from '../lib/with-player'
import withGame from '../lib/with-game'
import ChatRoom from './chatroom'
import root from '../lib/get-server-root'
import { withi18n } from '../lib/i18n'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    textAlign: 'center',

    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    height: '100vh'

  },
  placeHolder: {
    marginTop: theme.spacing.unit * 16,
  },
  relative: {
    position: 'relative'
  },
  absolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  card: {
    maxWidth: 200,
    padding: 10,
    margin: 'auto'
  }
});

class Lobby extends Component {
  state = {
    roomName: '',
    rooms: {}
  }
  constructor(props) {
    super(props)
    request.get(root() + '/gamerooms', (err, httpResponse, body) => {
      console.log({ err, httpResponse, body })
      if (httpResponse.statusCode === 200) {
        this.setState({ rooms: JSON.parse(body) })
      } else {
        window.alert(body)
      }
    })
    socket.on('lobby', (room) => {
      const { rooms } = this.state
      rooms[room.name] = room
      if (room.deleted) {
        delete rooms[room.name]
      }
      this.setState({ rooms })
    })
  }
  componentWillUnmount() {
    socket.removeAllListeners('lobby')
  }
  requestCreateRoom = () => {
    const { roomName: name } = this.state
    const { player } = this.props
    socket.emit('createRoom', { name })
  }
  requestJoinRoom = (room) => {
    const { player } = this.props
    socket.emit('player', { roomName: room.name })
  }
  leaveRoom = () => {
    socket.emit('player', { roomName: '' })
  }
  callStartGame = () => {
    socket.emit('player',{startGame: true})
  }
  renderLobby() {
    console.log(this.state.rooms)
    const { i18n: { ui }, classes } = this.props
    return (
      <div className={classes.root}>
        <Grid item style={{ margin: 'auto' }}>
          <Grid>
            <Typography variant="display3">{ui.lobby}</Typography>
          </Grid>
          <Grid item style={{ margin: "8px" }}>
            <TextField
              label={ui.enterRoomName}
              onChange={({ target: { value: roomName } }) => this.setState({ roomName })} />
          </Grid>
          <Grid container spacing={8} alignItems='baseline' justify='center'>
            <Grid item style={{ margin: "8px" }}>
              <Button
                variant="raised"
                color='secondary'
                onClick={() => this.props.changeState(0)}>{ui.back}</Button>
            </Grid>
            {/* <Grid item>
              <Button
                onClick={this.requestCreateRoom}
                color='secondary'
                variant="raised">{ui.search}</Button>
            </Grid> */}
            <Grid item style={{ margin: "8px" }}>
              <Button
                onClick={this.requestCreateRoom}
                color='primary'
                variant="raised">{ui.create}</Button>
            </Grid>
          </Grid>
          {Object.values(this.state.rooms).filter(({started})=>started==null).map(room => (
            <Card className={classes.card} key={room.name} onClick={() => this.requestJoinRoom(room)}>
              <Grid container justify='space-between'>
                <Grid item>
                  <Typography>{room.name}</Typography>
                </Grid>
                <Grid>
                  <Typography>{Object.keys(room.players).length}</Typography>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Grid>
        <ChatRoom channel="lobby" name={this.props.player.name}></ChatRoom>
      </div>
    )
  }
  renderRoom(room) {
    const { i18n: { ui }, classes } = this.props
    return (
      <div className={classes.root}>
        <Grid item style={{ margin: 'auto' }}>
          <Grid direction='column' container justify='center'>
            <Grid item style={{ margin: "8px" }}>
              <Typography variant="display3">{ui.room}: {room.name}</Typography>
            </Grid>
            <Grid container direction='column' justify='center'>
              {(Object.values(room.players).map(name => (
                <Grid style={{ margin: "8px" }} key={name} item>
                  <Card className={classes.card}>
                    <Grid container justify='space-between'>
                      <Grid item>
                        <Typography>{name}</Typography>
                      </Grid>
                      <Grid>
                        <Typography> </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              )))}
            </Grid>
            <Grid container alignItems='baseline' justify='center' style={{ margin: "8px" }}>
              <Grid style={{ margin: "8px" }} item>
                <Button variant='raised' color='secondary' onClick={this.leaveRoom}>{ui.leave}</Button>
              </Grid>
              <Grid style={{ margin: "8px" }} item>
                <Button variant='raised' color='primary' onClick={this.callStartGame}>{ui.start}</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
  render() {
    const { player } = this.props
    const { rooms } = this.state
    if (!('roomName' in player) || (player.roomName === '') || !(player.roomName in rooms)) {
      return this.renderLobby()
    } else {
      return this.renderRoom(rooms[player.roomName])
    }
  }
}

export default withStyles(styles)(withi18n(withGame(withPlayer(Lobby))))