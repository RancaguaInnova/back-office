import * as firebase from 'firebase'

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASED_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_BUCKET
}

firebase.initializeApp(config)

export default firebase
