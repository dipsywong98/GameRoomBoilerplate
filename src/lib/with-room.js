import { connect } from 'react-redux'
import { joinRoom, updateRoom } from './store'

const mapStateToProps = ({ room }) => ({ room })

const mapDispatchToProps = (dispatch, ownProps) => ({
  joinRoom: (...args) => dispatch(joinRoom(...args)),
  updateRoom: (...args) => dispatch(updateRoom(...args))
})

const withRoom = WrapComponent => {
  return connect(mapStateToProps, mapDispatchToProps)(WrapComponent)
}

export default withRoom