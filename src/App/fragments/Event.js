import gql from 'graphql-tag'

export default {
  FullEvent: gql`
    fragment FullApp on Application {
      _id
      name
      description
      date {
        date
        startHour
        endHour
        dateStr
      }
      address {
        streetName
        streetNumber
        departmentNumber
        city
        postalCode
      }
      optionLabel
      departmentId
      externalUrl
      imageUrl
      showInCalendar
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
          postalCode
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
