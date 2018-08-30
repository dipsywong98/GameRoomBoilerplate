import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Typography, Button, Menu, MenuItem } from '@material-ui/core/index'
import { withStyles } from '@material-ui/core/styles'
import { setLang } from '../lib/store'
import { langList } from '../lib/i18n'
import Language from './svg/language'
import { getCookie, setCookie } from '../lib/cookie'

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  }
})

class Picker extends Component {
  state = {
    anchorEl: null,
  }

  componentDidMount() {
    const lang = getCookie('lang')
    if (lang && lang !== 'en') {
      this.props.setLang(lang)
    }
  }

  handleClick = event => {
    console.log(event.currentTarget)
    this.setState({ anchorEl: event.currentTarget })
  };

  handleClose = (value = null) => {
    this.setState({ anchorEl: null })
    if (!!value) {
      setCookie('lang', value, 99)
      this.props.setLang(value)
    }
  };


  render() {
    const { anchorEl } = this.state
    console.log(anchorEl)
    const open = !!anchorEl
    return (
      <div>
        {/* <select onChange={({target:{value}})=>this.handleClose(value)}>
          {Object.keys(langList).map(lang => (
              <option value={lang} key={langList[lang].name}>
                {langList[lang].name}
              </option>))}
        </select> */}
        <Button variant='outlined' onClick={this.handleClick}>
          Language <Language />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => this.handleClose(null)}
        >
          {
            Object.keys(langList).map(lang => (
              <MenuItem onClick={() => this.handleClose(lang)} key={langList[lang].name}>
                {langList[lang].name}
              </MenuItem>))
          }
        </Menu>
      </div>
    )
  }
}

const mapStateToProps = ({ lang }) => ({ lang })
const mapDispatchToProps = (dispatch, ownProps) => ({ setLang: (...args) => dispatch(setLang(...args)) })

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Picker))
