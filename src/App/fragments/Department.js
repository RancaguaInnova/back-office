import gql from 'graphql-tag'

export default {
  FullDepartment: gql`
    fragment FullDepartment on Department {
      _id
      name
      optionLabel
      managerId
      informationCategoryId
      tags
      contactInformation {
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
        email
      }
      businessHours
      description
      imageUrl
      address
      imageHeader
      active
    }
  `
}
