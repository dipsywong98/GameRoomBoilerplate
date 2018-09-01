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
import withLobby from '../lib/with-lobby'
import withUiState from '../lib/with-ui-state'
import withModal from '../lib/with-modal'
import roomSettings from '../lib/room-setting'
import yellow from '@material-ui/core/colors/yellow'
import lime from '@material-ui/core/colors/lime'
import Emoji from './emoji'

const colors = ['#FFFFFF', lime[500], yellow[500]]
const identityEmojis = [
  <Emoji symbol='❌' label='cross' />,
  <Emoji symbol='✔️' label='tick' />,
  <Emoji symbol='👑' label='crown' />
]

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
    maxWidth: '40em',
    width: '20em',
    margin: 'auto'
  }
});

class Room extends Component {
  constructor(props) {
    super(props)
  }
  leaveRoom = () => {
    socket.emit('player', { roomName: '' })
  }
  callStartGame = () => {
    const { lobby, player, i18n: { ui }, setModal } = this.props
    const room = lobby[player.roomName]
    const { playerRange: [lower] } = roomSettings()
    if (player.id !== room.master) {
      socket.emit('player', { startGame: true })
    } else if (Object.keys(room.players).length < lower) {
      setModal({
        title: ui.alert,
        text: ui.requireNTostartGame(lower)
      })
    } else {
      let flag = []
      for (let k in room.players) {
        if (k === room.master) continue
        if (!room.players[k].ready) {
          flag.push(room.players[k].name)
        }
      }
      if (flag.length === 0) {
        socket.emit('player', { startGame: true })
      } else {
        setModal({
          title: ui.alert,
          text: (<div>
            <Typography>{ui.players}</Typography>
            <ul>
              {flag.map(name => <li key={name}>{name}</li>)}
            </ul>
            <Typography>{ui.are_not_ready}</Typography>
          </div>)
        })
      }
    }
  }
  /**
   * 
   * @param {socket id of player} player_id
   * @return {status} 0: not ready, 1: ready, 2: master
   */
  playerStatus(player_id) {
    const { lobby, player } = this.props
    const room = lobby[player.roomName]
    if (player_id === room.master) return 2
    return 0 + room.players[player_id].ready
  }

  /**
   * 
   * @param {socket id of player} player_id
   * @return {indentity} 0: normal people, 1: myself, 2: master
   */
  identity(player_id) {
    const { lobby, player } = this.props
    const room = lobby[player.roomName]
    if (player_id === room.master) return 2
    return 0 + (player_id === player.id)
  }

  render() {
    const { i18n: { ui }, classes, player, lobby } = this.props
    const room = lobby[player.roomName]
    if (!room) return <Typography>LOADING</Typography>
    return (
      <div className={classes.root}>
        <Grid item style={{ margin: 'auto' }}>
          <Grid direction='column' container justify='center'>
            <Grid item style={{ margin: "8px", maxWidth: '90vw', wordWrap: 'break-word' }}>
              <Typography variant="display3">{ui.room}: {room.name}</Typography>
            </Grid>
            <Grid container direction='column' justify='center'>
              {(Object.keys(room.players).map(id => ({ id, ...room.players[id] })).map(({ id, name }) => (
                <Grid style={{ margin: "8px" }} key={id} item>
                  <Card className={classes.card} style={{ backgroundColor: colors[this.playerStatus(id)] }}>
                    <Grid container justify='space-between' alignItems='baseline'>
                      <Grid item style={{ maxWidth: '15em', overflow: 'hidden', margin: '0 8px' }}>
                        <Typography>{name}</Typography>
                      </Grid>
                      <Grid>
                        <Button>{identityEmojis[this.identity(id)]}</Button>
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
                <Button variant='raised' color='primary' onClick={this.callStartGame}>{(player.id === room.master ? ui.start : ui.ready)}</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withModal(withUiState(withLobby(withStyles(styles)(withi18n(withGame(withPlayer(Room)))))))