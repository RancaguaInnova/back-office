import getEnv from './getEnv'

const env = getEnv()

const servicesUrl = {
  prod: 'https://services.smartrancagua.com',
  dev: 'https://services.smartrancagua.com',
  local: 'http://localhost:3100'
}

if (env !== 'local' && window.location.protocol !== 'https:') {
  window.location.protocol = 'https:'
}

export default servicesUrl[env]
