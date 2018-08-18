import { Component } from 'react'
import { withi18n } from '../lib/i18n'
import {database} from '../lib/init-firebase'

@withi18n
class Test extends Component {
  render() {
    // database.ref('/').once('')
    return (
      <p>
        {JSON.stringify(this.props.i18n)}
      </p>
    )
  }
}

export default Test