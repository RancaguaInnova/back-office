export default async function(session) {
  localStorage.setItem('session', JSON.stringify(session || {}, null, 2))
  await global.apolloClient.resetStore()
}
