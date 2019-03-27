import gql from 'graphql-tag'

export default {
  ServiceAreas: gql`
    fragment SelectServiceArea on PaginatedServiceArea {
      items {
        id: _id
        name: optionLabel
      }
    }
  `
}
