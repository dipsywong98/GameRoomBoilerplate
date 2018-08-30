import { connect } from 'react-redux'
import { initLobby } from './store'

const mapStateToProps = ({ lobby }) => ({ lobby })

const mapDispatchToProps = (dispatch, ownProps) => ({
  initLobby: (...args) =>  dispatch(initLobby(...args))
})

const withLobby = WrapComponent => {
  return connect(mapStateToProps, mapDispatchToProps)(WrapComponent)
}

export default withLobby