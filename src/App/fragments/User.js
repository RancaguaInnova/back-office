import gql from 'graphql-tag'

export default {
  FullUser: gql`
    fragment FullUser on User {
      _id
      email
      profile {
        firstName
        lastName
        identifier
        address {
          streetName
          streetNumber
          departmentNumber
          city
        }
        phone {
          areaCode
          number
          mobilePhone
          postalCode
        }
        educationalLevel
      }
      active
      roles
    }
  `,
  Profile: gql`
    fragment Profile on User {
      profile {
        firstName
        lastName
        identifier
        address {
          streetName
          streetNumber
          departmentNumber
          city
          postalCode
        }
        phone {
          areaCode
          number
          mobilePhone
        }
        educationalLevel
      }
    }
  `
}
