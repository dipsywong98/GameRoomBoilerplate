import React from 'react'
import App from './app'
import withRoot from '../withRoot';
import Home from './home'
import Lobby from './lobby'
class Page extends React.Component {
  state = {
    playerState: 0
  }
  render() {
    const Element = [Home, Lobby][this.state.playerState]
    return (
      <App>
        <Element changeState={playerState=>this.setState({playerState})}/>
      </App>
    )
  }
}
export default withRoot(Page)