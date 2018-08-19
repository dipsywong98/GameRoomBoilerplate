import React,{Component} from 'react'
import request from 'request'
import {on, emit} from '../lib/socket-client-helper'
import withPlayer from '../lib/with-player'
import ChatRoom from './chatroom'
import root from '../lib/get-server-root'
 class Lobby extends Component {
   state={
     roomName:''
   }
  constructor(props){
    super(props)
  }
  createRoom = ()=>{
    const {roomName:name} = this.state
    const {player}=this.props
    request.post(root()+'/gamerooms',{form:{player,option:{name}}},(err,httpResponse,body)=>{
      console.log({err,httpResponse,body})
    })
  }
  render(){
    return (
      <div>
        {/* {this.state.msgs.map((msg,k)=><p key={k}>{msg}</p>)}
    <input value={this.state.newmsg} onChange={({ target: { value } })=>this.setState({newmsg:value})}/>
        <button onClick={()=>emit('chatRoom',this.state.newmsg)&&this.setState({newmsg:''})}>Send</button> */}
        <input onChange={({target:{value:roomName}})=>this.setState({roomName})}/>
        <button onClick={this.createRoom}></button>
        <ChatRoom channel="lobby" name={this.props.player.name}></ChatRoom>
      </div>
    )
  }
}
 export default withPlayer(Lobby)