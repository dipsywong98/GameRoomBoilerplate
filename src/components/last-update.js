import fetch from 'node-fetch'
import React, { Component } from 'react'
import { Typography } from '@material-ui/core'
export default class LastUpdate extends Component {
  state={
    lastUpdate: 'Last Update: loading...'
  }
  getLastUpdate = async () =>{
    const repo = this.props.repo || 'dipsywong98/dipsywong98.github.io'
    const response = await fetch(`https://api.github.com/repos/${repo}/commits/master`)
    const { commit } = await response.json()
    this.setState({lastUpdate:`Last Update: ${commit.author.date} ${commit.message}`})
  }
  componentWillMount(){
    this.getLastUpdate()
  }
  render(){
    const repo = this.props.repo || 'dipsywong98/dipsywong98.github.io'
    const link = `https://github.com/${repo}`
    return (
      <a href={link}><Typography variant='caption'>{this.state.lastUpdate}</Typography></a>
    )
  }
}
