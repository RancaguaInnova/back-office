import gql from 'graphql-tag'

export default {
  FullInformationCategory: gql`
    fragment FullInformationCategory on InformationCategory {
      _id
      name
      description
      optionLabel
      iconURL
      parent {
        _id
        name
      }
      tags
      childIds
    }
  `
}
