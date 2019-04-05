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
        administrativeAreaLevel1
        administrativeAreaLevel2
        country
        formatted_address
        place_id
        latitude
        longitude
      }
      optionLabel
      departmentId
      externalUrl
      imageUrl
      showInCalendar
      tags {
        tag
      }
      locations {
        id
        name
        quota
      }
      sendFirebase
      firebaseIdEvent
    }
  `
}
