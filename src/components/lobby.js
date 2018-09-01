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
import NewRoomForm from './new-room-form'
import withModal from '../lib/with-modal';
import roomSettings from '../lib/room-setting'
import { sha3_512 } from 'js-sha3'
import Lock from './svg/lock'

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
    margin: 8,
    width: '20em',
    maxWidth: '30em'
  }
});

class Lobby extends Component {
  state = {
    roomName: '',
    options: {}
  }
  requestCreateRoom = () => {
    const { roomName: name } = this.state
    const { player, i18n: { ui }, setModal } = this.props
    setModal({
      title: ui.create,
      text: (<NewRoomForm onChange={options => this.setState({ options })} />),
      buttons: [{
        text: ui.create,
        onClick: () => {
          const { options } = this.state
          const { playerRange: [lower, upper] } = roomSettings()
          if (!options.name) {
            window.alert('Room Name is Required')
            return 1
          }
          if (options.upperLimit < lower || options.upperLimit > upper) {
            window.alert('Invalid Upperlimit')
            return 1
          }
          if (options.password) options.password = sha3_512(options.password)
          socket.emit('createRoom', options)
        }
      }, {
        text: ui.cancel
      }]
    })

  }
  requestJoinRoom = (room) => {
    const { player, setModal, i18n: { ui } } = this.props
    let password = ''
    if (Object.keys(room.players).length >= room.upperLimit) return setModal({ text: `${ui.room} "${room.name}" ${ui.alreadyFull}` })
    if (room.password) {
      setModal({
        title: ui.password,
        text: (<div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            id="password-input"
            label={ui.password}
            type="password"
            autoComplete="current-password"
            margin="normal"
            onChange={({ target: { value } }) => password = value}
          />
        </div>),
        buttons: [{
          text: ui.join,
          onClick: () => {
            const sha_password = sha3_512(password)
            if (room.password !== sha_password) {
              window.alert(ui.incorretPassword)
              return 1
            } else {
              socket.emit('player', { roomName: room.name, password: sha_password })
            }
          }
        }]
      })
    } else {
      socket.emit('player', { roomName: room.name })
    }
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
          {/* <Grid item style={{ margin: "8px" }}>
            <TextField
              label={ui.enterRoomName}
              onChange={({ target: { value: roomName } }) => this.setState({ roomName })} />
          </Grid> */}
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
            <Card className={classes.card} key={room.name}>
              <Grid container justify='space-between' alignItems='baseline'>
                <Grid item style={{ maxWidth: '12em', overflow: 'hidden', margin: '0px 8px' }}>
                  <Typography style={{ display: 'flex' }}>{room.name}{room.password && <Lock />}</Typography>
                </Grid>
                <Grid item>
                  <Button onClick={() => this.requestJoinRoom(room)}>
                    {ui.join} [{Object.keys(room.players).length}{room.upperLimit && '/' + room.upperLimit}]
                  </Button>
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

export default withModal(withUiState(withLobby(withStyles(styles)(withi18n(withGame(withPlayer(Lobby)))))))