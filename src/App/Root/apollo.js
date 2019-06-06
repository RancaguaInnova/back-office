import { createClient } from '@orion-js/graphql-client'
import url from './url'

export default createClient({
  endpointURL: url,
  useSubscriptions: false,
  saveSession (session) {
    localStorage.setItem('session', JSON.stringify(session, null, 2))
  },
  getSession (session) {
    try {
      return JSON.parse(localStorage.getItem('session'))
    } catch (e) {
      return {}
    }
  }
})
