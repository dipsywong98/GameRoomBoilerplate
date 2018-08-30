import { connect } from 'react-redux'
import { setGame } from './store'
import socket from './socket-client-helper'

const mapStateToProps = ({ game }) => ({ game })

const mapDispatchToProps = (dispatch, ownProps) => ({
  setGame: (...args) => {
    // socket.emit('game',...args)
    dispatch(setGame(...args))
  }
})

const withGame = WrapComponent => {
  return connect(mapStateToProps, mapDispatchToProps)(WrapComponent)
}

export default withGame