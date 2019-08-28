import getEnv from './getEnv'

const env = getEnv()

const servicesUrl =
  env === 'prod'
    ? 'https://services.smartrancagua.com'
    : 'http://localhost:3100'

if (env !== 'local' && window.location.protocol !== 'https:') {
  window.location.protocol = 'https:'
}

export default servicesUrl
