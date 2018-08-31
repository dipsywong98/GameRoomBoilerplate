import React, { Component } from 'react'
import { Typography, Grid, Button, TextField, Card } from '@material-ui/core/index'
import socket from '../lib/socket-client-helper'
import withPlayer from '../lib/with-player'
import withGame from '../lib/with-game'
import ChatRoom from './chatroom'
import { withi18n } from '../lib/i18n'
import { withStyles } from '@material-ui/core/styles'
import withLobby from '../lib/with-lobby'
import withUiState from '../lib/with-ui-state'

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
    roomName: ''
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
  render() {
    console.log(this.props.lobby)
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
                onClick={() => this.props.setUiState(0)}>{ui.back}</Button>
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
          {this.props.lobby && Object.values(this.props.lobby).filter(({ started }) => !started).map(room => (
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
}

export default withUiState(withLobby(withStyles(styles)(withi18n(withGame(withPlayer(Lobby))))))