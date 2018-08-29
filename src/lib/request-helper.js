import request from 'request'
// import root from 'get-server-root'
import { store } from '../lib/store'

const asyncRequest = async ({
  url,
  method,
  data: form
}) => new Promise(function (resolve, reject) {
  const { player } = store.getState()
  form = { ...form, player }
  request[method](url, { form }, function (err, { statusCode }, body) {
    if (statusCode >= 200 && statusCode < 300) {
      resolve({ err, data, statusCode })
    } else {
      reject({ err, data, statusCode })
    }
  })
})

export default asyncRequest