import React, { Component } from 'react'
import { Typography, Grid, Button, Slide, Collapse, Paper } from '@material-ui/core/index'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import withModal from '../lib/with-modal';

class Modal extends Component {
  onClose = () => {
    this.props.setModal({ show: false })
  }
  render() {
    const { modal: { show, title, text, buttons } } = this.props
    return (
      <Dialog open={show} onClose={this.onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <div style={{height:0,color:'transparent'}}>
          yooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
          </div>
          {text}
        </DialogContent>
        <DialogActions>
          {buttons.map(({ text, color, variant, onClick }) => (
            <Button key={text} color={color} variant={variant} onClick={() => {
              onClick && onClick()
              this.onClose()
            }}>
              {text}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    )
  }
}

export default withModal(Modal)