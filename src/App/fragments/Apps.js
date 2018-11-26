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
        url
        contactInformation {
          address {
            streetName
            streetNumber
            departmentNumber
            postalCode
          }
          phone {
            areaCode
            number
            mobilePhone
          }
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
        contactInformation {
          address {
            streetName
            streetNumber
            departmentNumber
            postalCode
          }
          phone {
            areaCode
            number
            mobilePhone
          }
        }
      }
    }
  `
}
