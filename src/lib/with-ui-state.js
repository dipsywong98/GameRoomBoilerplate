import { connect } from 'react-redux'
import { setUiState } from './store'

const mapStateToProps = ({ uiState }) => ({ uiState })

const mapDispatchToProps = (dispatch, ownProps) => ({
  setUiState: (...args) =>  dispatch(setUiState(...args))
})

const withUiState = WrapComponent => {
  return connect(mapStateToProps, mapDispatchToProps)(WrapComponent)
}

export default withUiState