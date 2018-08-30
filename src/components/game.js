import React, { Component } from 'react'
import { Typography, Grid, Button, Slide, Collapse, Paper } from '@material-ui/core/index'
import { withStyles } from '@material-ui/core/styles'
import { withi18n } from '../lib/i18n'
// import locations from '../lib/locations'
import randInt from '../lib/rand-int'
import Loading from './svg/loading'
import ToggleDeleteButton from './toggle-delete-button'
import withGame from '../lib/with-game'

const styles = theme => ({
  paper: {
    backgroundColor: '#F0F0F0',
    width: '100%'
  }
})

class Game extends Component {
  componentDidMount(){

  }
  render(){
    return <div>Game</div>
  }
}

export default withi18n(withStyles(styles)(Game))
