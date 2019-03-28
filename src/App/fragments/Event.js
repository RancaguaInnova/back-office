import gql from 'graphql-tag'

export default {
  FullEvent: gql`
    fragment FullEvent on Event {
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
  `
}
