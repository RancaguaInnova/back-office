import getEnv from './getEnv'

const env = getEnv()
const servicesUrl =
  env === 'prod'
    ? 'https://services.smartrancagua.com'
    : 'http://localhost:3100'

export default servicesUrl
