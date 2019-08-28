const hostname = window.location.hostname
const isProduction = hostname.includes('.com')
const isLocal = hostname.includes('localhost')
const isDev = !isProduction && !isLocal

const forceProd = false

export default () =>
  isProduction || forceProd ? 'prod' : isDev ? 'dev' : 'local'
