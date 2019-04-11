import gql from 'graphql-tag'

export default {
  FullApp: gql`
    fragment FullApp on Application {
      _id
      name
      description
      departmentId
      approved
      userFields
      applicationURL
      developerInfo {
        firstName
        lastName
        email
        url
        address {
          streetName
          streetNumber
          departmentNumber
          city
          postalCode
          administrativeAreaLevel1
          administrativeAreaLevel2
          country
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
      }
      tags {
        tag
      }
    }
  `,
  AppRegistrationForm: gql`
    fragment AppRegistrationForm on Application {
      _id
      name
      description
      userFields
      applicationURL
      developerInfo {
        firstName
        lastName
        url
        email
        address {
          streetName
          streetNumber
          departmentNumber
          city
          postalCode
          administrativeAreaLevel1
          administrativeAreaLevel2
          country
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
      }
    }
  `
}
