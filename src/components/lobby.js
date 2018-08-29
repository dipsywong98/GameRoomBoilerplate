import React,{Component} from 'react'
import request from 'request'
import socket from '../lib/socket-client-helper'
import withPlayer from '../lib/with-player'
import withRoom from '../lib/with-room'
import ChatRoom from './chatroom'
import root from '../lib/get-server-root'
 class Lobby extends Component {
   state={
     roomName:'',
     rooms:{}
   }
  constructor(props){
    super(props)
    request.get(root()+'/gamerooms',(err,httpResponse,body)=>{
      console.log({err,httpResponse,body})
      if(httpResponse.statusCode===200){
        this.setState({rooms:JSON.parse(body)})
      }else{
        window.alert(body)
      }
    })
    socket.on('lobby',(room)=>{
      const {rooms} = this.state
      rooms[room.name] = room
      if(room.deleted){
        delete rooms[room.name]
      }
      this.setState({rooms})
    })
  }
  componentWillUnmount(){
    socket.removeAllListeners('lobby')
  }
  requestCreateRoom = ()=>{
    const {roomName:name} = this.state
    const {player}=this.props
    socket.emit('createRoom',{name})
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
    this.props.setPlayer({room:room.name})
    this.props.setRoom(room)
    // this.props.changeState(2)
  }
  render(){
    console.log(this.state.rooms)
    return (
      <div>
        <button onClick={()=>this.props.changeState(0)}>Back</button>
        <input onChange={({target:{value:roomName}})=>this.setState({roomName})}/>
        <button onClick={this.requestCreateRoom}>Create Room</button>
        {Object.values(this.state.rooms).map(room=>(
          <div>
            <button onClick={()=>this.requestJoinRoom(room)} key={room.name}>{room.name}{Object.keys(room.players).length}</button>
          </div>
        ))}
        <ChatRoom channel="lobby" name={this.props.player.name}></ChatRoom>
      </div>
    )
  }
}
 export default withRoom(withPlayer(Lobby))