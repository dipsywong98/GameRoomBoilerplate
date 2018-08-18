// import config from '../../config'
// import firebase from 'firebase/app'
// import 'firebase/database'
// import firebase from 'firebase'

try {
  // firebase.initializeApp(config.firebase)
} catch (e) {
}

// let database = firebase.database()

const dbonce = async (ref, type = 'value') => await new Promise((resolve, reject) => {
  // database.ref(ref).once(type).then(snapshot => { resolve(snapshot.val()) }, function (errorObject) {
  //   console.log("The read failed: " + errorObject.code);
  // })//.catch(reject)
})

const dbupdate = async (ref, value) => await new Promise((resolve, reject) => {
  // database.ref(ref).update(value).then(() => resolve(), function (errorObject) {
  //   console.log("The read failed: " + errorObject.code);
  // }).catch(reject)
})

const dbset = async (ref, value) => await new Promise((resolve, reject) => {
  // database.ref(ref).set(value).then(() => resolve(), function (errorObject) {
  //   console.log("The read failed: " + errorObject.code);
  // }).catch(reject)
})

const dbon = (ref, type, fn) => {
  // database.ref(ref).on(type, snapshot=>fn(snapshot.val()))
}

const dboff = (ref, type, fn) => {
  // database.ref(ref).off(type, fn)
}

export {
  // firebase,
  // database,
  dbonce,
  dbupdate,
  dbset,
  dbon,
  dboff
}
