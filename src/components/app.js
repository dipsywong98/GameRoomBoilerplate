import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { store } from '../lib/store'
import { initGA, logPageView } from '../lib/ga'
import Loading from './svg/loading'
import Home from './home'
import Lobby from './lobby'
import { Typography } from '@material-ui/core';
import withRoot from '../withRoot'
import { withStyles } from '@material-ui/core/styles'

class App extends Component {
  state = {
    loading: true
  }
  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }
    logPageView()
    window.onload = ()=>this.setState({loading: false})
  }
  render() {
    if(this.state.loading)return <div style={{position:'absolute', top:'50%', left: '50%'}}><Typography>LOADING...</Typography></div>
    return (<Provider store={store} children={this.props.children}/>)
  }
}

export default withRoot(App)