import gql from 'graphql-tag'

export default {
  FullDepartment: gql`
    fragment FullDepartment on Department {
      _id
      name
      optionLabel
      managerId
      serviceAreaId
      contactInformation {
        address{
          streetName
          streetNumber
          departmentNumber
          city
          postalCode
          administrativeAreaLevel1
          administrativeAreaLevel2
        }
        phone{
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

    }
  `

}
