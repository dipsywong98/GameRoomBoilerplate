import React from 'react'
import App from './app'
import withRoot from '../withRoot';
import Home from './home'
import Lobby from './lobby'
import Game from './game'
import withGame from '../lib/with-game'

class _Page extends React.Component {
  state = {
    playerState: 0
  }
  render() {
    const Element = [Home, Lobby][this.state.playerState]
    if(this.props.game.started == true) return <Game/>
    return (
        <Element changeState={playerState=>this.setState({playerState})}/>
    )
  }
}

const Page = withGame(_Page)

export default (props)=>(<App><Page {...props}></Page></App>)