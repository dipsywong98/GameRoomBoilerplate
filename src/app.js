import io from 'socket.io-client'
import React,{Component} from 'react'

class App extends Component {
  constructor(props){
    super(props)
    const socket = io('http://localhost:80', {transports: ['websocket', 'polling', 'flashsocket']})
    this.state={socket,msgs:[],newmsg:''}
    const self = this
    socket.on('chatRoom',function(msg){
      self.state.msgs.push(msg);
      self.setState({msgs:self.state.msgs})
    })
  }
  render(){
    return (
      <div>
        {this.state.msgs.map((msg,k)=><p key={k}>{msg}</p>)}
    <input value={this.state.newmsg} onChange={({ target: { value } })=>this.setState({newmsg:value})}/>
        <button onClick={()=>this.state.socket.emit('chatRoom',this.state.newmsg)&&this.setState({newmsg:''})}>Send</button>
      </div>
    )
  }
}

export default App