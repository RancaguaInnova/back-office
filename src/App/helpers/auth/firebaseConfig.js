import * as firebase from 'firebase'

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASED_DATABASE_URL,
  storageBucket: process.env.FIREBASE_BUCKET
}
firebase.initializeApp(config)

export default firebase
