import React, { Component } from 'react'
import { Typography, Grid, Button, Slide, Collapse, Paper } from '@material-ui/core/index'
import { withStyles } from '@material-ui/core/styles'
import { withi18n } from '../lib/i18n'
// import locations from '../lib/locations'
import randInt from '../lib/rand-int'
import Loading from './svg/loading'
import ToggleDeleteButton from './toggle-delete-button'
import withGame from '../lib/with-game'
import socket from '../lib/socket-client-helper'
import withModal from '../lib/with-modal'
import withUiState from '../lib/with-ui-state'

const styles = theme => ({
  paper: {
    backgroundColor: '#F0F0F0',
    width: '100%'
  }
})

class Game extends Component {
  onGameEnd = () => {
    this.props.setGame({ started: false })
  }
  onClick(i, j) {
    socket.emit('game', { place: [i, j] })
  }
  componentWillUpdate(){
    const { game, modal: { show }, setModal, setUiState } = this.props
    const { players, boxes, result, currentPlayer } = game
    if (!show) {
      if (!!result) {
        setModal({
          title: 'Result',
          text: (result.winner?'Winner is ' + result.winner.name:'draw'),
          buttons: [{
            text: 'back',
            onClick: () => setUiState(2)
          }]
        })
      }
    }
  }
  render() {
    const { game, modal: { show }, setModal, setUiState } = this.props
    const { players, boxes, result, currentPlayer } = game
    return <div>
      {Object.values(players).map((player, k) => (<p key={'p' + k}>{player.name}({player.symbol}) {(k === currentPlayer) ? '<---Turn' : null}</p>))}
      {boxes.map((row, i) => (
        <div key={i} style={{ display: 'flex' }}>
          {row.map((box, j) => (
            <div onClick={() => this.onClick(i, j)} style={{ width: 100, height: 100, border: 'solid' }} key={i * 3 + j}>
              {box}
            </div>
          ))}
        </div>
      ))}
      {result && (<p>winner is {JSON.stringify(result)}</p>)}
    </div>
  }
}

export default withUiState(withModal(withGame(withi18n(withStyles(styles)(Game)))))
