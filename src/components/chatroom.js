import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, List, ListItem, ListItemText, Input, Paper, Button, Collapse, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { dbon, dbupdate, dbset, dboff } from '../lib/init-firebase'
import Send from './svg/send'
import Chip from './chatroom-chip'

const styles = theme => ({
  frame: {
    position: 'fixed',
    bottom: '0px',
    right: theme.spacing.unit * 4,
    width: '250px',
    zIndex: '99'
  },
  inner: {
    padding: `0 ${theme.spacing.unit}`,
    border: `solid 2px ${theme.palette.primary.light}`,
  },
  messageContainer: {
    height: '350px',
    overflowY: 'scroll'
  },
  inputWrap: {
    borderTop: ''
  }
})

class ChatRoom extends Component {
  state = {
    messages: [],
    message: '',
    cursor: 0,
    collapse: true,
    oldIsr: null,
    focus: false
  }
  componentWillMount() {
    const { channel } = this.props
    console.log(`subsribe to ${channel}`)
    dbon(`rooms/${channel}/chat`, 'value', value => this.setState({
      messages: value && value.messages && value.messages.sort((a,b)=>a.time-b.time) || [],
      cursor: value && value.cursor || 0
    }))
    this.state.oldIsr = window.onkeyup
    window.onkeyup = e => {
      const key = e.keyCode ? e.keyCode : e.which
      if(key===13) this.state.focus && this.handleSend()
    }
  }
  componentWillUnmount() {
    window.onkeyup = this.state.oldIsr
    dboff(`rooms/${this.props.channel}/chat`, 'value')
  }
  componentWillReceiveProps(nextProps) {
    dboff(`rooms/${this.props.channel}/chat`, 'value')
    console.log(`unsubsribe to ${this.props.channel} and subscribe to ${nextProps.channel}`)
    dbon(`rooms/${nextProps.channel}/chat`, 'value', value => this.setState({
      messages: value && value.messages && value.messages.sort((a,b)=>a.time-b.time) || [],
      cursor: value && value.cursor || 0
    }))
  }
  
  handleInput = ({ target: { value } }) => {
    this.setState({ message: value })
  }
  handleSend = () => {
    const { channel, name } = this.props
    let { messages, message, cursor } = this.state
    if(message === '') return
    const newMessage = { time: Date.now(), name, message }
    this.setState({ message: '' })
    dbset(`rooms/${channel}/chat/messages/${cursor++%50}`, newMessage)
    dbset(`rooms/${channel}/chat/cursor`,cursor)
    this.setState({cursor})
  }
  render() {
    const { classes, name } = this.props
    const chatRoomTitle = this.props.chatRoomTitle || 'chatroom'
    const { message, messages, collapse } = this.state
    return (
      <Grid container direction='column' className={classes.frame}>
        <Paper elevation={16}>
          <Grid item>
            <Button onClick={() => this.setState({ collapse: !collapse })} variant='raised' color='primary' style={{ width: '100%' }}>
              {chatRoomTitle}
            </Button>
          </Grid>
          <Grid item>
            <Collapse in={!collapse}>
              <Grid container direction='column' className={classes.inner} justify='flex-end'>
                <Grid item className={classes.messageContainer}>
                  <List>
                    {messages.map(({ name, message, time }) => (
                      <Chip name={name} message={message} time={time} me={name === this.props.name}/>
                    ))}
                  </List>
                </Grid>
                <Grid item className={classes.inputWrap}>
                  <Input
                    placeholder="New Message"
                    inputProps={{
                      'aria-label': 'Description',
                    }}
                    onChange={this.handleInput}
                    onFocus={()=>this.setState({focus: true})}
                    onBlur={()=>this.setState({focus: false})}
                    value={message}
                  />
                  <IconButton color='primary' onClick={this.handleSend}>
                    <Send />
                  </IconButton >
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
        </Paper>
      </Grid>
    )
  }
}

ChatRoom.propTypes = {
  channel: PropTypes.string.isRequired
}

ChatRoom.defaultProps = {
  name: 'guest '+Math.floor(Math.random()*1000),
  channel: '__global__'
}

export default withStyles(styles)(ChatRoom)