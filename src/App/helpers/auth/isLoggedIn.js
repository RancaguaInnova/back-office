import getSession from './getSession'

export default function() {
  const {userId, publicKey, secretKey} = getSession()
  return userId && publicKey && secretKey
}
