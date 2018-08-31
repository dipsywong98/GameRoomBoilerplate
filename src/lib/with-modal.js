import { connect } from 'react-redux'
import { setModal } from './store'

const mapStateToProps = ({ modal }) => ({ modal })

const mapDispatchToProps = (dispatch, ownProps) => ({
  setModal: (modal) =>  dispatch(setModal({show:true, ...modal}))
})

const withModal = WrapComponent => {
  return connect(mapStateToProps, mapDispatchToProps)(WrapComponent)
}

export default withModal