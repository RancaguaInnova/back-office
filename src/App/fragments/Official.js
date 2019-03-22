import gql from 'graphql-tag'

export default {
  Officials: gql`
    fragment SelectOfficial on PaginatedOfficial {
      items{
      id:_id
      name:optionLabel
      }
    }
  `
}
