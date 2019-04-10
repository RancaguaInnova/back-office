export default function() {
  try {
    const session = JSON.parse(localStorage.getItem('session')) || {}
    return session
  } catch (error) {
    return {}
  }
}
