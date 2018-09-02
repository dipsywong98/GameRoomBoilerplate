import React from 'react'
import App from './app'
import withRoot from '../withRoot';
import Home from './home'
import Lobby from './lobby'
import Game from './game'
import Room from './room'
import withGame from '../lib/with-game'
import withUiState from '../lib/with-ui-state'
import Modal from './modal'
import Chatroom from './chatroom';

class _Page extends React.Component {
  render() {
    const Element = [Home, Lobby, Room, Game, Game][this.props.uiState]
    return (
      <div>
        <Modal />
        <Element />
        <Chatroom />
      </div>
    )
  }
}

const Page = withUiState(_Page)

export default (props)=>(<App><Page {...props}></Page></App>)