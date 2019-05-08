import gql from 'graphql-tag'

export default {
  FullUser: gql`
    fragment FullUser on User {
      _id
      email
      profile {
        firstName
        lastName
        typeIdentificationDocument
        identifier
        birthdate
        gender
        address {
          streetName
          streetNumber
          departmentNumber
          city
          postalCode
          formatted_address
          place_id
          latitude
          longitude
        }
        phone {
          areaCode
          number
          mobilePhone
        }
        educationalLevel
        departmentIds
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
          formatted_address
          place_id
          latitude
          longitude
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
