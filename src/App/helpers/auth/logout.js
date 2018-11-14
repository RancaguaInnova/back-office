import gql from 'graphql-tag'
import setSession from './setSession'

export default async function() {
  await global.apolloClient.mutate({
    mutation: gql`
      mutation logout {
        logout
      }
    `
  })
  await setSession(null)
}
