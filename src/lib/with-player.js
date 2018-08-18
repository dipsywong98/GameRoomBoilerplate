import { connect } from 'react-redux'
import { setPlayer } from './store'

const mapStateToProps = ({ player }) => ({ player })

const mapDispatchToProps = (dispatch, ownProps) => ({
  setPlayer: (...args) => dispatch(setPlayer(...args))
})

const withPlayer = WrapComponent => {
  return connect(mapStateToProps, mapDispatchToProps)(WrapComponent)
}

export default withPlayer