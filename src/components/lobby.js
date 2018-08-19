// import React from 'react'
// export default (props)=>(
//   <div>
//     This is a lobby
//   </div>
// )

import io from 'socket.io-client'
import React,{Component} from 'react'
import {subscribe, emit} from '../lib/socket-client-helper'
 class Lobby extends Component {
  constructor(props){
    super(props)
    const self = this
    subscribe('chatRoom',function(msg){
      self.state.msgs.push(msg);
      self.setState({msgs:self.state.msgs})
    })
    this.state = {msgs:[],newmsg:''}
  }
  render(){
    return (
      <div>
        {this.state.msgs.map((msg,k)=><p key={k}>{msg}</p>)}
    <input value={this.state.newmsg} onChange={({ target: { value } })=>this.setState({newmsg:value})}/>
        <button onClick={()=>emit('chatRoom',this.state.newmsg)&&this.setState({newmsg:''})}>Send</button>
      </div>
    )
  }
}
 export default Lobby