import { connect } from 'react-redux'
import { setPlayer } from './store'
import socket from './socket-client-helper'

const mapStateToProps = ({ player }) => ({ player })

const mapDispatchToProps = (dispatch, ownProps) => ({
  setPlayer: (...args) => {
    socket.emit('player',...args)
    return dispatch(setPlayer(...args))
  }
})

const withPlayer = WrapComponent => {
  return connect(mapStateToProps, mapDispatchToProps)(WrapComponent)
}

export default withPlayer