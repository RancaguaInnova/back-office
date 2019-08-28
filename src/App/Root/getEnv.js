const hostname = window.location.hostname
const isProduction = hostname.includes('.com')
const isDev = !isProduction // hostname.includes('beta.') || hostname.includes('dev')

const forceProd = false

export default () =>
  isProduction || forceProd ? 'prod' : isDev ? 'dev' : 'local'
