import React from 'react'
import Button from 'orionsoft-parts/lib/components/Button'
import { Form, Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import { withRouter } from 'react-router'
import gql from 'graphql-tag'
import UserFragments from 'App/fragments/User'
import SearchBar from 'App/components/fields/GooglePlaces'
import styles from './styles.css'

@withRouter
@withMessage
@withGraphQL(gql`
  query user($userId: ID!) {
    user(userId: $userId) {
      _id
      emails {
        address
        verified
      }
      ...Profile
      roles
    }
  }
  ${UserFragments.Profile}
`)
@withMutation(gql`
  mutation updateUser($user: UserInput!) {
    updateUser(user: $user) {
      _id
    }
  }
`)
export default class DeveloperInfo extends React.Component {
  static propTypes = {
    userId: PropTypes.string,
    user: PropTypes.object,
    updateUser: PropTypes.func,
    showMessage: PropTypes.func,
    history: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = { ...this.props.user }
  }

  handleChangeAddress = contactInformationAddress => {
    var profile = this.state.profile
    if (profile.address === null) {
      profile = {}
      var address = {
        streetName: '',
        streetNumber: '',
        departmentNumber: '',
        city: '',
        postalCode: '',
        formatted_address: '',
        place_id: '',
        latitude: '',
        longitude: ''
      }
      profile = {
        address: address
      }
    }
    profile.address.streetName = contactInformationAddress.streetName
    profile.address.streetNumber = contactInformationAddress.streetNumber
    profile.address.departmentNumber = contactInformationAddress.departmentNumber
    profile.address.city = contactInformationAddress.city
    profile.address.postalCode = contactInformationAddress.postalCode
    profile.address.formatted_address = contactInformationAddress.formatted_address
    profile.address.place_id = contactInformationAddress.place_id
    profile.address.latitude = contactInformationAddress.latitude
    profile.address.longitude = contactInformationAddress.longitude
    this.setState({
      profile: profile
    })
  }

  handleCheck(array, val) {
    return array.indexOf(val) > -1
  }
  async onSubmit() {
    let user = Object.assign({}, this.props.user)
    user.profile = Object.assign({}, this.props.user.profile, this.state.profile)

    if (!this.handleCheck(user.roles, 'developer')) {
      user.roles.push('developer')
    }

    try {
      await this.props.updateUser({ user })
      this.props.showMessage('Información Guardada. Ahora puedes registrar tu aplicación')
      this.props.history.push('/devs/apps')
    } catch (error) {
      this.props.showMessage('Hubo un error al guardar los datos')
      console.log('error:', error)
    }
  }

  render() {
    return (
      <div>
        <Form state={this.state} onChange={changes => this.setState(changes)}>
          <div className={styles.headerLabel}>Datos de usuario:</div>
          <div className={styles.fieldGroup}>
            <div className={styles.label}>Nombre:</div>
            <Field fieldName='profile.firstName' type={Text} />
            <div className={styles.label}>Apellido:</div>
            <Field fieldName='profile.lastName' type={Text} />
            <div className={styles.headerLabel}>Datos de contacto:</div>
            <div className={styles.fieldGroup}>
              <SearchBar
                handleChangeAddress={this.handleChangeAddress}
                latitude={
                  this.state.profile &&
                  this.state.profile.address &&
                  this.state.profile.address.latitude
                    ? this.state.profile.address.latitude
                    : -34.1703131
                }
                longitude={
                  this.state.profile &&
                  this.state.profile.address &&
                  this.state.profile.address.longitude
                    ? this.state.profile.address.longitude
                    : -70.74064759999999
                }
                address={
                  this.state.profile &&
                  this.state.profile.address &&
                  this.state.profile.address.formatted_address
                    ? this.state.profile.address.formatted_address
                    : ''
                }
              />
              <div className={styles.subheaderLabel}>Dirección:</div>
              <div className={styles.label}>Nombre de Calle:</div>
              <Field fieldName='profile.address.streetName' type={Text} />
              <div className={styles.label}>Numeración:</div>
              <Field fieldName='profile.address.streetNumber' type={Text} />
              <div className={styles.label}>Número de departamento o casa (opcional):</div>
              <Field fieldName='profile.address.departmentNumber' type={Text} />
              <div className={styles.label}>Ciudad:</div>
              <Field fieldName='profile.address.city' type={Text} />
              <div className={styles.label}>Código Postal:</div>
              <Field fieldName='profile.address.postalCode' type={Text} />
              <div className={styles.subheaderLabel}>Teléfono:</div>
              <div className={styles.label}>Celular:</div>
              <Field fieldName='profile.phone.mobilePhone' type={Text} />
              <div className={styles.label}>Código de área:</div>
              <Field fieldName='profile.phone.areaCode' type={Text} />
              <div className={styles.label}>Numero:</div>
              <Field fieldName='profile.phone.number' type={Text} />
            </div>
          </div>
        </Form>
        <br />
        <Button to='/devs' style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={() => this.onSubmit()} primary>
          Guardar
        </Button>
      </div>
    )
  }
}
