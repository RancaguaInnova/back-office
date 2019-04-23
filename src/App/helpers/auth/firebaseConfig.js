import * as firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyAn0Xsm2h07oo35fe5Wq1LqBLxMyvXkY',
  authDomain: 'cdir-tickets.firebaseapp.com',
  databaseURL: 'https://cdir-tickets.firebaseio.com',
  storageBucket: 'gs://cdir-tickets.appspot.com'
}
firebase.initializeApp(config)

export default firebase
