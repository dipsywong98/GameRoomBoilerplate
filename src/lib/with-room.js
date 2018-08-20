import { connect } from 'react-redux'
import { setRoom } from './store'

const mapStateToProps = ({ room }) => ({ room })

const mapDispatchToProps = (dispatch, ownProps) => ({
  setRoom: (...args) => dispatch(setRoom(...args))
})

const withRoom = WrapComponent => {
  return connect(mapStateToProps, mapDispatchToProps)(WrapComponent)
}

export default withRoom