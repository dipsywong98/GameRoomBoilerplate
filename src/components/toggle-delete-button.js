import React, { Component } from 'react'
import { Grid, TextField, Button } from '@material-ui/core/index'

export default class ToggleDeleteButton extends Component {
  state = {
    deleted: false
  }
  onClick = () => {
    this.setState({ deleted: !this.state.deleted })
  }
  render() {
    const {deleted} = this.state
    return (
      <Button
        variant='outlined'
        onClick={this.onClick}
        style={{color:(deleted?'#B0B0B0':'#484848')}}
      >
        {(
          deleted
          ? <del>{this.props.children}</del>
          : this.props.children
        )}
      </Button>
    )
  }
}
