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

class Room extends Component {
  constructor(props) {
    super(props)
  }
  leaveRoom = () => {
    socket.emit('player', { roomName: '' })
  }
  callStartGame = () => {
    socket.emit('player',{startGame: true})
  }
  render() {
    const { i18n: { ui }, classes, player } = this.props
    const room = this.props.lobby[this.props.player.roomName]
    if(!room)return <Typography>LOADING</Typography>
    return (
      <div className={classes.root}>
        <Grid item style={{ margin: 'auto' }}>
          <Grid direction='column' container justify='center'>
            <Grid item style={{ margin: "8px" }}>
              <Typography variant="display3">{ui.room}: {room.name}</Typography>
            </Grid>
            <Grid container direction='column' justify='center'>
              {(Object.keys(room.players).map(id=>({id,...room.players[id]})).map(({id,name, ready}) => (
                <Grid style={{ margin: "8px" }} key={name} item>
                  <Card className={classes.card}>
                    <Grid container justify='space-between'>
                      <Grid item>
                        <Typography>{name}</Typography>
                      </Grid>
                      <Grid>
                        <Typography>{(id===room.master?'master':(ready?'ready':'not ready'))}</Typography>
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
                <Button variant='raised' color='primary' onClick={this.callStartGame}>{(player.id === room.master?ui.start:ui.ready)}</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withUiState(withLobby(withStyles(styles)(withi18n(withGame(withPlayer(Room))))))