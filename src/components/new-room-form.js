import React, { Component } from 'react'
import roomSettings from '../lib/room-setting'
import { Typography, Grid, Button, TextField, Card } from '@material-ui/core/index'
import { withi18n } from '../lib/i18n'
import withPlayer from '../lib/with-player'

class NewRoomForm extends Component {
  state = {
    upperLimit: roomSettings().playerRange[0],
    name: this.props.player.name
  }
  componentDidMount(){
    const { onChange } = this.props
    onChange && onChange({ ...this.state })
  }
  setState = (newVal) => {
    super.setState(newVal)
    const { onChange } = this.props
    onChange && onChange({ ...this.state, ...newVal })
  }
  render() {
    const { canPassword, playerRange: [lower, upper] } = roomSettings()
    const { i18n: { ui } } = this.props
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/*choose a room upper limit, lower limit are used for game start, upper limit use for game join*/}
        <TextField
          id="roomName-input"
          label={ui.enterRoomName}
          margin="normal"
          onChange={({ target: { value } }) => this.setState({ name: value })}
          value={this.state.name}
        />
        {(upper - lower < 10
          ? (<TextField select onChange={({ target: { value } }) => this.setState({ upperLimit: value })} value={this.state.upperLimit} label={ui.roomUpperLimit}>
            {Array(upper - lower + 1).fill().map((_, k) => (
              <option value={k + lower} key={k}>{k + lower}</option>
            ))}
          </TextField>) : (
            <TextField
            id="roomUpperLimitt"
            label={ui.roomUpperLimit}
            margin="normal"
            onChange={({ target: { value } }) => this.setState({ upperLimit: value })}
            value={this.state.upperLimit}
            type="number"
          />
          ))}
        {canPassword &&
          <TextField
            id="password-input"
            label={ui.password}
            type="password"
            autoComplete="current-password"
            margin="normal"
            onChange={({ target: { value } }) => this.setState({ password: value })}
          />}
      </div>
    )
  }
}

export default withPlayer(withi18n(NewRoomForm))
