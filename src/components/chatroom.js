import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, List, ListItem, ListItemText, Input, Paper, Button, Collapse, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import socket from '../lib/socket-client-helper'
import Send from './svg/send'
import Chip from './chatroom-chip'
import withPlayer from '../lib/with-player'
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

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
    display: 'flex',
    justifyContent: 'space-between'
  }
})

function TabContainer({ children, dir }) {
  return (
    <div>
      {children}
    </div>
  );
}

class ChatRoom extends Component {
  state = {
    messages: { lobby: [] },
    message: '',
    cursor: 0,
    collapse: true,
    oldIsr: null,
    focus: false,
    tab: 0
  }
  onReceiveMessage = ([channel, message]) => {
    const { messages } = this.state
    if (!(channel in messages)) messages[channel] = []
    messages[channel].push(message)
    this.setState({ messages })
  }
  componentWillMount() {
    socket.on(`chatRoom`, this.onReceiveMessage)
    // dbon(`rooms/${channel}/chat`, 'value', value => this.setState({
    //   messages: value && value.messages && value.messages.sort((a,b)=>a.time-b.time) || [],
    //   cursor: value && value.cursor || 0
    // }))
    this.state.oldIsr = window.onkeyup
    window.onkeyup = e => {
      const key = e.keyCode ? e.keyCode : e.which
      if (key === 13) this.state.focus && this.handleSend()
    }
  }
  componentWillUnmount() {
    window.onkeyup = this.state.oldIsr
    // dboff(`rooms/${this.props.channel}/chat`, 'value')
    socket.removeAllListeners(`chatRoom`)
  }

  handleInput = ({ target: { value } }) => {
    this.setState({ message: value })
  }

  handleSend = () => {
    const { player: { name, roomName, id } } = this.props
    let { messages, message, cursor, tab } = this.state
    if (message === '') return
    const newMessage = { time: Date.now(), name: name || this.props.name, message, id }
    this.setState({ message: '' })

    socket.emit(`chatRoom`, [['lobby', roomName][tab], newMessage])
  }
  handleTabChange = (_, tab) => this.setState({ tab })
  handleSwipeTab = tab => this.setState({ tab })
  render() {
    const { classes, theme, player: { roomName, name, id } } = this.props
    const chatRoomTitle = this.props.chatRoomTitle || 'chatroom'
    const { message, messages, collapse } = this.state
    if (!roomName && this.state.tab !== 0) this.setState({ tab: 0 })
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
                {roomName && <Tabs
                  value={this.state.tab}
                  onChange={this.handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  fullWidth
                >
                  <Tab label="lobby" style={{ width: '50%', minWidth: 0 }} />
                  <Tab label={roomName} style={{ width: '50%', minWidth: 0 }} />
                </Tabs>
                }
                <SwipeableViews
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={this.state.tab}
                  onChangeIndex={this.handleSwipeTab}
                >
                  {((roomName && ['lobby', roomName]) || ['lobby']).map(context => (
                    <TabContainer dir={theme.direction}>
                      <Grid item className={classes.messageContainer}>
                        <List>
                          {messages[context] && messages[context].map(({ name, message, time, id: mid }) => (
                            <Chip name={name} message={message} time={time} me={id === mid} />
                          ))}
                        </List>
                      </Grid>
                    </TabContainer>))}
                  <div style={{ float: "left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                  </div>
                </SwipeableViews>
                <Paper elevation={4}>
                  <Grid item className={classes.inputWrap}>
                    <Input
                      placeholder="New Message"
                      inputProps={{
                        'aria-label': 'Description',
                      }}
                      onChange={this.handleInput}
                      onFocus={() => this.setState({ focus: true })}
                      onBlur={() => this.setState({ focus: false })}
                      value={message}
                      style={{ margin: 8, width: 182 }}
                    />
                    <IconButton color='primary' onClick={this.handleSend}>
                      <Send />
                    </IconButton >
                  </Grid>
                </Paper>
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
  name: 'guest ' + Math.floor(Math.random() * 1000),
  channel: '__global__'
}

export default withPlayer(withStyles(styles, { withTheme: true })(ChatRoom))