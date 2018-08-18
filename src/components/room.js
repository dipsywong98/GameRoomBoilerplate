import React, { Component } from 'react'
import { Typography, Grid, Button, Slide } from '@material-ui/core/index'
import { withStyles } from '@material-ui/core/styles'
import { database, dbonce, dbon, dboff, dbset, dbupdate } from '../lib/init-firebase'
import { withi18n } from '../lib/i18n'
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

  componentWillMount = () => {
    const { name, roomName } = this.props
    console.log('will mount')
    dbon(`/rooms/${roomName}`, 'value', room => this.setState({ room }))
    window.addEventListener("beforeunload", this.componentWillUnmount)
  }

  componentWillUnmount = () => {
    const { room } = this.state
    const { name, roomName } = this.props
    dboff(`/rooms/${roomName}`, 'value', room => this.setState({ room }))
    if (!!room && !!room.players && Object.keys(room.players).length > 1) {
      console.log(`rm /rooms/${roomName}/players/${name}`)
      dbset(`/rooms/${roomName}/players/${name}`, null)
    }
    else if (!!room && !!room.players && Object.keys(room.players).indexOf(name) !== -1) {
      console.log(`rm /rooms/${roomName}`)
      dbset(`/rooms/${roomName}`, null)
    }
    window.removeEventListener("beforeunload", this.componentWillUnmount)
  }

  startGame = () => {
    this.setState({ loading: true })
    const { roomName, i18n } = this.props
    const locations = Object.keys(i18n.locations)
    let { room: { players } } = this.state
    const locationId = randInt(0, locations.length)
    const firstPlayer = Object.keys(players)[randInt(0, Object.keys(players).length)]
    const location = locations[locationId]
    dbupdate(`rooms/${roomName}`, {
      location,
      playing: true,
      startTime: Date.now(),
      firstPlayer,
      expire: after24hours()
    })
    console.log(i18n.locations[location].roles)
    let roles = Array(Object.keys(i18n.locations[location].roles).length).fill('').map((_, k) => k)
    const defaultRole = roles[roles.length - 1]
    let notAssigned = Object.keys(players)
    while (notAssigned.length > 1) {
      console.log(notAssigned, roles)
      let role = defaultRole
      if (roles.length > 0) {
        role = roles.splice(randInt(0, roles.length), 1)[0]
      }
      let player
      player = notAssigned.splice(randInt(0, notAssigned.length), 1)[0]
      players[player] = role
      console.log(`${player}->${role}`)
    }
    players[notAssigned[0]] = 'spy'
    dbset(`rooms/${roomName}/players`, players)
    this.setState({ loading: false })
  }

  endGame = async () => {
    const { roomName } = this.props
    dbupdate(`rooms/${roomName}`, { playing: false, startTime: null })
  }

  onChangeName = async (oldName, newName) => {
    if(newName === oldName) return
    this.setState({ loading: true })
    const { roomName, i18n: { ui } } = this.props
    let s = await dbonce(`rooms/${roomName}/players/${newName}`)
    if (!!s) {
      alert(`${ui.player} ${newName} ${ui.already_exist}`)
    } else {
      s = await dbonce(`rooms/${roomName}/players/${oldName}`)
      console.log(s)
      this.state.name = newName
      await dbupdate(`rooms/${roomName}/players`, { [newName]: s, [oldName]: null })
      this.props.changeName(newName)
    }
    this.setState({ loading: false })
  }

  onDeletePlayer = async player => {
    const { roomName, i18n: { ui } } = this.props
    console.log(player)
    await dbset(`rooms/${roomName}/players/${player}`, null)
  }

  render() {
    const { i18n, i18n: { ui }, leaveRoom, name, roomName, classes } = this.props
    const { room, loading } = this.state
    if (room && room.players && Object.keys(room.players).indexOf(this.state.name) === -1) {
      alert(ui.you_have_been_kicked_out)
      leaveRoom()
    }
    return (
      <Grid direction='column' container justify='center'>
        <Grid item style={{margin:"8px"}}>
          <Typography variant="display3">{ui.room}: {roomName}</Typography>
        </Grid>
        {(loading ? <Loading /> : null)}
        {/* {JSON.stringify(room)} */}

        <Grid item style={{margin:"8px"}}>
          <Slide direction="left" in={room && room.playing} mountOnEnter unmountOnExit>
            <Game room={room} name={name} roomName={roomName} endGame={this.endGame} />
          </Slide>
        </Grid>
        {/* {room && Object.keys(room.players).join()} */}
        {(room && room.playing ? null : <Grid item>
          <Grid container justify='center'>
            <Grid item xl={6} lg={6} md={8} sm={10} xs={12}>
              <Grid container justify='center' direction='column' alignItems='center'>
                {room && room.players && Object.keys(room.players).map(player => (
                  <Grid item style={{ textAlign: 'center' }}>
                    {(player === name
                      ? <NameTag value={player} onChange={newName => this.onChangeName(player, newName)} />
                      : <NameTag value={player} onDelete={() => this.onDeletePlayer(player)} />)}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>)}
        {(room && room.playing
          ? (null)
          : (
            <Grid item>
              <Grid container justify='center'>
                <Grid item style={{margin:"8px"}}>
                  <Button color='secondary' variant='raised' onClick={leaveRoom}>{ui.leave_room}</Button>
                </Grid>
                <Grid item style={{margin:"8px"}}>
                  <Button color='primary' variant='raised' onClick={this.startGame}>{ui.start_game}</Button>
                </Grid>
              </Grid>
            </Grid>)
        )}
      </Grid>
    )
  }
}

export default withi18n(withStyles(styles)(Room))
