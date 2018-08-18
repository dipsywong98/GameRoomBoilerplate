import React, { Component } from 'react'
import { Typography, Paper, Button, Grid, Modal, TextField } from '@material-ui/core/index'
import { withStyles } from '@material-ui/core/styles'
import Clear from './svg/clear'
import Edit from './svg/edit'
import { withi18n } from '../lib/i18n'

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
  },
})

class NameTag extends Component {
  state = {
    editing: false,
    value: this.props.value,
    oldKeyIsr: null
  }
  valueChangeHandler = ({ target: { value } }) => {
    this.setState({ value })
  }
  handleClose = () => {
    this.setState({ editing: false })
    window.onkeyup = this.state.oldKeyIsr
    if(this.props.onChange)this.props.onChange(this.state.value)
  }
  toggleModal = () => {
    this.state.oldKeyIsr = window.onkeyup
    window.onkeyup = e => {
      const key = e.keyCode ? e.keyCode : e.which
      console.log(key)
      if(key===13)this.handleClose()
    }
    this.setState({editing:true})
  }
  render() {
    const { i18n:{ui}, classes } = this.props
    return (
      <Paper style={{width:'250px'}}>
        <Grid container justify='space-between' alignItems='center'>
          <Typography variant='body2' item xs={10} item style={{marginLeft:'8px'}}>{this.props.value}</Typography>
          <Grid item >
            {this.props.onChange && <Button align="right" size='small' onClick={this.toggleModal} children={<Edit />} />}
            {this.props.onDelete && <Button align="right" size='small' onClick={this.props.onDelete} children={<Clear />} />}
          </Grid>
        </Grid>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.editing}
          onClose={this.handleClose}
        >
          <div className={classes.paper}>
            <Typography variant="title" id="modal-title">
              New value
            </Typography>
            <TextField
              id="value"
              label={ui.enter_your_name}
              margin="normal"
              onChange={this.valueChangeHandler}
              value={this.state.value}
              item
            />
          </div>
        </Modal>
      </Paper>
    )
  }
}

export default withi18n(withStyles(styles)(NameTag))