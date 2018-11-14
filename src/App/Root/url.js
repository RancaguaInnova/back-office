import getEnv from './getEnv'

const urls = {
  local: `http://${window.location.hostname}:3000`,
  dev: `http://${window.location.hostname}:3000`,
  prod: ''
}

console.log('fill dev and production urls here')

const env = getEnv()

if (env !== 'local' && window.location.protocol !== 'https:') {
  window.location.protocol = 'https:'
}

export default urls[env]
