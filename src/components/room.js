import React, { Component } from 'react'
import { Typography, Grid, Button, Slide } from '@material-ui/core/index'
import { withStyles } from '@material-ui/core/styles'
import withRoom from '../lib/with-room'
import withPlayer from '../lib/with-player'
import { withi18n } from '../lib/i18n'
import socket from '../lib/socket-client-helper'
// import locations from '../lib/locations'
import randInt from '../lib/rand-int'
import Loading from './svg/loading'
import Game from './game'
import ToggleDeleteButton from './toggle-delete-button'
import NameTag from './name-tag'
import after24hours from '../lib/after24hours'
import ChatRoom from './chatroom'

const styles = theme => ({
  center: {
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    flexGrow: 1,
  }
})

class Room extends Component {
  state = {
    room: null,
    loading: false,
    name: this.props.name
  }

  leaveRoom = () => {
    this.props.setPlayer({room:undefined})
    this.props.changeState(1)
  }

  componentWillMount = () => {
    const { setRoom } = this.props
    socket.on('room',setRoom)
  }

  componentWillUnmount = () => {
    socket.removeAllListeners('room')
  }

  render() {
    const {room, i18n:{ui}} = this.props
   return (
      <Grid direction='column' container justify='center'>
      <button onClick={this.leaveRoom}>leave</button>
        <Grid item style={{margin:"8px"}}>
          <Typography variant="display3">{ui.room}: {room.name}</Typography>
        </Grid>
        {/* {(loading ? <Loading /> : null)} */}
        {JSON.stringify(room)}
      </Grid>
    )
  }
}

export default withi18n(withStyles(styles)(withRoom(withPlayer(Room))))
