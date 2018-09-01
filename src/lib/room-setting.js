import request from 'request'
import root from '../lib/get-server-root'

let roomSettings

request(root() + 'roomSettings', (err, httpResponse, body) => {
  roomSettings = JSON.parse(body)
})

export default ()=>roomSettings
