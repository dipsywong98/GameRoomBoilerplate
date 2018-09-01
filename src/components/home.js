import React, { Component } from 'react'
import { Grid, TextField, Typography, Button, Slide } from '@material-ui/core/index'
import { withStyles } from '@material-ui/core/styles'
import LangPicker from './lang-picker'
import { withi18n } from '../lib/i18n'
import withPlayer from '../lib/with-player'
// import config from '../../config'
// import { database, dbonce, dbset, dbupdate } from '../lib/init-firebase'
// import Room from './room'
import Loading from './svg/loading'
import LastUpdate from './last-update'
import after24hours from '../lib/after24hours'
// import ChatRoom from './chatroom'
import randInt from '../lib/rand-int'
import { connect } from 'react-redux'
import withUiState from '../lib/with-ui-state'
import withModal from '../lib/with-modal'

console.log(process.env.SERVER)

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
  }
});

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.player.name,
      roomName: null,
      loading: false,
      joinedRoom: false,
      id: randInt(1, 1001)
    }
  }

  changeName = newName => {
    this.setState({ name: newName })
  }

  nameChangeHandler = ({ target: { value } }) => {
    this.setState({ name: value })
  }

  render() {
    const { i18n: { ui }, classes } = this.props
    const { name, roomName, loading, joinedRoom, id } = this.state
    return (
      <div className={classes.root}>
        {(loading ? <Grid item children={<Loading />} /> : null)}
        <Grid item>
          <Typography variant="display3">{ui.welcome}</Typography>
          <Grid container justify="center">
            <Grid item style={{ margin: "8px" }}>
              <TextField
                id="name"
                label={ui.enter_your_name}
                margin="normal"
                onChange={this.nameChangeHandler}
                value={name}
              />
            </Grid>

          </Grid>
          <Grid container justify="center">
            <Grid item style={{ margin: "8px" }}>
              <Button
                variant="raised"
                color="secondary"
                onClick={this.showModal}>
                {ui.tutorial}
              </Button>
            </Grid>
            <Grid item style={{ margin: "8px" }}>
              <Button
                variant="raised"
                color="primary"
                onClick={() => this.props.setPlayer({ name }) && this.props.setUiState(1)}
                disabled={!name || loading}>
                {ui.play}
              </Button>
            </Grid>
          </Grid>
          <Grid style={{ marginTop: '32px' }} item>
            <LangPicker />
          </Grid>
          <Grid style={{ marginTop: '32px' }} item>
            <LastUpdate repo='dipsywong98/SpyFall' />
          </Grid>
          <Grid style={{ marginTop: '32px' }} item>
            hi{process.env.SERVER}
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withModal(withUiState(withi18n(withPlayer(withStyles(styles)(Home)))))
