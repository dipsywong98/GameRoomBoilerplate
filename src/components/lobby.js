import React,{Component} from 'react'
import request from 'request'
import {on, emit} from '../lib/socket-client-helper'
import withPlayer from '../lib/with-player'
import ChatRoom from './chatroom'
import root from '../lib/get-server-root'
 class Lobby extends Component {
   state={
     roomName:'',
     rooms:[]
   }
  constructor(props){
    super(props)
    request.get(root()+'/gamerooms',(err,httpResponse,body)=>{
      console.log({err,httpResponse,body})
      if(httpResponse.statusCode===200){
        this.setState({rooms:Object.values(JSON.parse(body))})
      }else{
        window.alert(body)
      }
    })
  }
  requestCreateRoom = ()=>{
    const {roomName:name} = this.state
    const {player}=this.props
    request.post(root()+'/gamerooms',{form:{player,options:{name}}},(err,httpResponse,body)=>{
      if(httpResponse.statusCode===200){
        this.onJoinRoom(JSON.parse(body))
      }else{
        window.alert(body)
      }
    })
  }
  requestJoinRoom = (room) => {
    const {player} = this.props
    request.post(root()+'/gamerooms/'+room.name,{form:{player}},(err,httpResponse,body)=>{
      console.log({err,httpResponse,body})
      if(httpResponse.statusCode===200){
        this.onJoinRoom(JSON.parse(body))
      }else{
        window.alert(body)
      }
    })
  }
  onJoinRoom = (room) => {
    console.log('successfully joined room', room)
    this.props.setPlayer({room})
    this.props.changeState(2)
  }
  render(){
    console.log(this.state.rooms)
    return (
      <div>
        <button onClick={()=>this.props.changeState(0)}>Back</button>
        {/* {this.state.msgs.map((msg,k)=><p key={k}>{msg}</p>)}
    <input value={this.state.newmsg} onChange={({ target: { value } })=>this.setState({newmsg:value})}/>
        <button onClick={()=>emit('chatRoom',this.state.newmsg)&&this.setState({newmsg:''})}>Send</button> */}
        <input onChange={({target:{value:roomName}})=>this.setState({roomName})}/>
        <button onClick={this.requestCreateRoom}>Create Room</button>
        {this.state.rooms.map(room=>(
          <div>
            <button onClick={()=>this.requestJoinRoom(room)} key={room.name}>{room.name}</button>
          </div>
        ))}
        <ChatRoom channel="lobby" name={this.props.player.name}></ChatRoom>
      </div>
    )
  }
}
 export default withPlayer(Lobby)