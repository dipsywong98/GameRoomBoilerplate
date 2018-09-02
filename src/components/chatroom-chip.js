import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Typography, Grid, List, ListItem, ListItemText, Input, Paper, Button, Collapse, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import ColorHash from 'color-hash'
import moment from 'moment'

const chip = {
  padding: '5px 10px',
  width: '80%',
  margin: '5px',
  marginLeft: '10px',
  borderRadius: '20px'
}

const styles = theme => ({
  chip: {
    ...chip,
    backgroundColor: theme.palette.grey[200],
  },
  chipMe: {
    ...chip,
    backgroundColor: theme.palette.primary.light,
    float: 'right'
  },
  nameText: {
    color: props => props.color
  }
})

const Chip = ({ name, message, time, classes, me = false }) => {
  let colorHash = new ColorHash(), color = colorHash.hex(btoa(name))

  if (me) {
    return (
      <ListItem className={classes.chipMe}>
        <Grid direction='column' alignItems='stretch' container wrap='nowrap'>
          <Typography variant='subheading' style={{wordWrap:'break-word'}}>{message}</Typography>
          <abbr title={moment(time).format('YYYY-MM-DD HH:mm:ss')} style={{ textDecoration: 'none' }}>
            <Typography variant='caption'>{moment(time).format('HH:mm')}</Typography>
          </abbr>
        </Grid>
      </ListItem>
    )
  } else {
    return (
      <ListItem className={classes.chip}>
        <Grid direction='column' alignItems='stretch' container wrap='nowrap'>
          <Grid container justify='space-between' alignItems='baseline'>
            <Typography variant='body2' style={{ color }}>{name}</Typography>
            <Grid item>
              <abbr title={moment(time).format('YYYY-MM-DD HH:mm:ss')} style={{ textDecoration: 'none' }}>
                <Typography variant='caption'>{moment(time).format('HH:mm')}</Typography>
              </abbr>
            </Grid>
          </Grid>
          <Typography variant='subheading' style={{wordWrap:'break-word'}}>{message}</Typography>
        </Grid>
      </ListItem>
    )
  }
}

export default withStyles(styles)(Chip)
