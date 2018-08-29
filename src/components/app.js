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

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
})

class App extends Component {
  state = {
    loading: true,
    playerState: 0
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
    if(this.state.loading)return <div style={{paddingTop:'20em',textAlign:'center'}}><Typography>LOADING...</Typography></div>
    const Element = [Home, Lobby][this.state.playerState]
    return (<Provider store={store}>
      <Element changeState={playerState=>this.setState({playerState})}/>
    </Provider>)
  }
}

export default withRoot(withStyles(styles)(App))