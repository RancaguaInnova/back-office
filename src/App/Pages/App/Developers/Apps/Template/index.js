import React from 'react'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import { withRouter } from 'react-router'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import styles from './styles.css'
import autobind from 'autobind-decorator'
import 'react-inputs-validation/lib/react-inputs-validation.min.css'
import { confirmAlert } from 'react-confirm-alert'
import { Form } from 'simple-react-form'
import SearchBar from 'App/components/fields/GooglePlaces'
import LinkToAccount from '../LinkToAccount'
import withUserId from 'App/helpers/auth/withUserId'
import AppFragments from 'App/fragments/Apps'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'

import 'react-confirm-alert/src/react-confirm-alert.css'
import { InputText } from 'primereact/inputtext'
import _mergeWith from 'lodash/mergeWith'
import { Button } from 'primereact/button'
import { MultiSelect } from 'primereact/multiselect'
import { InputSwitch } from 'primereact/inputswitch'

@withUserId
@withRouter
@withMessage
@withMutation(gql`
  mutation createApplication($application: ApplicationInput!) {
    createApplication(application: $application) {
      _id
    }
  }
`)
@withMutation(gql`
  mutation updateApplication($application: ApplicationInput!) {
    updateApplication(application: $application) {
      _id
    }
  }
`)
@withMutation(gql`
  mutation deleteApplication($_id: ID!) {
    deleteApplication(_id: $_id)
  }
`)
@withGraphQL(gql`
  query application($applicationId: ID!) {
    application(applicationId: $applicationId) {
      ...AppRegistrationForm
    }
  }
  ${AppFragments.AppRegistrationForm}
`)
class TemplateApplication extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    application: PropTypes.object,
    createApplication: PropTypes.func,
    updateApplication: PropTypes.func,
    deleteApplication: PropTypes.func,
    userId: PropTypes.string,
    user: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {
      application: {
        _id: '',
        ownerId: '',
        name: '',
        description: '',
        userFields: [],
        applicationURL: '',
        appMovil: false,
        urlApp: '',
        appName: '',
        appStoreId: '',
        appStoreLocale: '',
        playStoreId: '',
        developerInfo: {
          firstName: '',
          lastName: '',
          url: '',
          email: '',
          address: {
            streetName: '',
            streetNumber: '',
            departmentNumber: '',
            city: '',
            postalCode: '',
            administrativeAreaLevel1: '',
            administrativeAreaLevel2: '',
            country: '',
            formatted_address: '',
            place_id: '',
            latitude: -34.1703131,
            longitude: -70.74064759999999
          },
          phone: {
            areaCode: null,
            number: null,
            mobilePhone: ''
          }
        }
      }
    }
  }

  @autobind
  onSuccessInsert() {
    this.props.showMessage('Aplicación creada')
    this.BackList()
  }
  @autobind
  onSuccessUpdate() {
    this.props.showMessage('Aplicación actualizada correctamente')
    this.BackList()
  }
  @autobind
  BackList() {
    this.props.history.push(`/devs/apps`)
  }

  handleChangeAddress = contactInformationAddress => {
    let application = { ...this.state.application }

    application.developerInfo.address = _mergeWith(
      application.developerInfo.address,
      contactInformationAddress,
      (a, b) => (b === null ? a : undefined)
    )
    this.setState({ application })
  }

  renderLinkToAccountButton() {
    return (
      <LinkToAccount
        userId={this.props.userId}
        linkAccountData={developerInfo => {
          if (developerInfo !== null) {
            this.setState({
              firstName: developerInfo.firstName || '',
              lastName: developerInfo.lastName || '',
              email: developerInfo.email || ''
            })
          }
          if (developerInfo.address !== null) {
            this.setState({
              streetName: developerInfo.address.streetName || '',
              streetNumber: developerInfo.address.streetNumber || '',
              departmentNumber: developerInfo.address.departmentNumber || '',
              city: developerInfo.address.city || '',
              postalCode: developerInfo.postalCode || ''
            })
          }
          if (developerInfo.phone !== null) {
            this.setState({
              areaCode: developerInfo.phone.areaCode || '',
              number: developerInfo.phone.number || '',
              mobilePhone: developerInfo.phone.mobilePhone || ''
            })
          }
        }}
        loading={true}
      />
    )
  }
  componentDidMount() {
    if (this.props.type === 'update') {
      var application = _mergeWith(this.state.application, this.props.application, (a, b) =>
        b === null ? a : undefined
      )
      this.setState(application)
    }
  }
  @autobind
  async handleSubmit() {
    var application = this.state.application
    if (this.props.type === 'create') {
      try {
        await this.props.createApplication({ application: application })
        this.onSuccessInsert()
      } catch (error) {
        this.props.showMessage('Ocurrión un error!')
      }
    } else {
      try {
        await this.props.updateApplication({ application: application })
        this.onSuccessUpdate()
      } catch (error) {
        this.props.showMessage('Ocurrión un error!')
      }
    }
  }

  @autobind
  onSuccessDelete() {
    this.props.showMessage('Aplicación eliminada correctamente')
    this.props.history.push(`/devs/apps`)
  }

  @autobind
  async onDelete() {
    try {
      var application = this.state.application
      await this.props.deleteApplication({ _id: application._id })
      this.onSuccessDelete()
    } catch (error) {
      this.props.showMessage('Ocurrió un error al eliminar la aplicación')
    }
  }
  @autobind
  confirmDelete() {
    confirmAlert({
      title: 'Confirmar acción',
      message: '¿seguro desea eliminar esta aplicación?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => await this.onDelete()
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Section title={this.props.title} description={this.props.description} top>
          <div className={styles.headerLabel}>Información de la aplicación:</div>
          <div className={styles.fieldGroup}>
            <div className='label'>Nombre:</div>
            <InputText
              type='text'
              value={this.state.application.name}
              required
              onChange={e => {
                let application = { ...this.state.application }
                application.name = e.target.value
                this.setState({ application })
              }}
            />
            <div className='label'>Descripción:</div>
            <InputText
              type='text'
              value={this.state.application.description}
              onChange={e => {
                let application = { ...this.state.application }
                application.description = e.target.value
                this.setState({ application })
              }}
            />
            <div className='label'>URL de redirección:</div>
            <InputText
              type='url'
              value={this.state.application.applicationURL}
              onChange={e => {
                let application = { ...this.state.application }
                application.applicationURL = e.target.value
                this.setState({ application })
              }}
            />
            <div className='label'>Datos de usuario:</div>
            <MultiSelect
              value={this.state.application.userFields}
              className='p-inputtext'
              onChange={e => {
                let application = { ...this.state.application }
                application.userFields = e.target.value
                this.setState({ application })
              }}
              options={[
                {
                  label: 'Email',
                  value: 'email'
                },
                {
                  label: 'Rut',
                  value: 'identifier'
                },
                {
                  label: 'Nombre',
                  value: 'firstName'
                },
                {
                  label: 'Apellido',
                  value: 'lastName'
                },
                {
                  label: 'Género',
                  value: 'gender'
                },
                {
                  label: 'Fecha de nacimiento',
                  value: 'birthdate'
                },
                {
                  label: 'Dirección',
                  value: 'address'
                },
                {
                  label: 'Teléfono',
                  value: 'phone'
                },
                {
                  label: 'Nivel Educacional',
                  value: 'educationalLevel'
                }
              ]}
            />
            <div className='label'>Es aplicación movil:</div>
            <InputSwitch
              checked={this.state.application.appMovil}
              onChange={e => {
                let application = { ...this.state.application }
                application.appMovil = e.target.value
                this.setState({ application })
              }}
            />
            <div className='label'>url deep link:</div>
            <InputText
              type='text'
              value={this.state.application.urlApp}
              onChange={e => {
                let application = { ...this.state.application }
                application.urlApp = e.target.value
                this.setState({ application })
              }}
            />
            <div className='label'>Nombre de la aplicación:</div>
            <InputText
              type='text'
              value={this.state.application.appName}
              onChange={e => {
                let application = { ...this.state.application }
                application.appName = e.target.value
                this.setState({ application })
              }}
            />
            <div className='label'>App Store Id:</div>
            <InputText
              type='number'
              value={this.state.application.appStoreId || ''}
              onChange={e => {
                let application = { ...this.state.application }
                application.appStoreId = e.target.value
                this.setState({ application })
              }}
            />
            <div className='label'>App Store Locale:</div>
            <InputText
              type='text'
              value={this.state.application.appStoreLocale}
              onChange={e => {
                let application = { ...this.state.application }
                application.appStoreLocale = e.target.value
                this.setState({ application })
              }}
            />
            <div className='label'>Play Store Id:</div>
            <InputText
              type='text'
              value={this.state.application.playStoreId}
              onChange={e => {
                let application = { ...this.state.application }
                application.playStoreId = e.target.value
                this.setState({ application })
              }}
            />
          </div>

          {this.props.userId !== '' && (
            <div>
              <div className={styles.headerLabel} style={{ marginBottom: 10, marginTop: 20 }}>
                Información del desarrollador:
              </div>
              <div>{this.renderLinkToAccountButton()}</div>
              <div className={styles.fieldGroup} style={{ marginTop: 15 }}>
                <div className='label'>Nombre:</div>
                <InputText
                  type='text'
                  value={this.state.application.developerInfo.firstName}
                  onChange={e => {
                    let application = { ...this.state.application }
                    application.developerInfo.firstName = e.target.value
                    this.setState({ application })
                  }}
                />
                <div className='label'>Apellido:</div>
                <InputText
                  type='text'
                  value={this.state.application.developerInfo.lastName}
                  onChange={e => {
                    let application = { ...this.state.application }
                    application.developerInfo.lastName = e.target.value
                    this.setState({ application })
                  }}
                />
                <div className='label'>Pagina Web:</div>
                <InputText
                  type='text'
                  value={this.state.application.developerInfo.url}
                  onChange={e => {
                    let application = { ...this.state.application }
                    application.developerInfo.url = e.target.value
                    this.setState({ application })
                  }}
                />

                <div className='headerLabel'>Información de contacto:</div>
                <div className='subheaderLabel'>Dirección:</div>
                <div className='fieldGroup'>
                  <SearchBar
                    handleChangeAddress={this.handleChangeAddress}
                    latitude={this.state.application.developerInfo.address.latitude}
                    longitude={this.state.application.developerInfo.address.longitude}
                    address={this.state.application.developerInfo.address.formatted_address}
                  />

                  <div className='label'>Nombre de calle:</div>
                  <InputText
                    type='text'
                    value={this.state.application.developerInfo.address.streetName}
                    onChange={e => {
                      let application = { ...this.state.application }
                      application.developerInfo.address.streetName = e.target.value
                      this.setState({ application })
                    }}
                  />
                  <div className='label'>Numeración:</div>
                  <InputText
                    type='text'
                    value={this.state.application.developerInfo.address.streetNumber}
                    onChange={e => {
                      let application = { ...this.state.application }
                      application.developerInfo.address.streetNumber = e.target.value
                      this.setState({ application })
                    }}
                  />
                  <div className='label'>Número de oficina/casa/departamento (opcional):</div>
                  <InputText
                    type='text'
                    value={this.state.application.developerInfo.address.departmentNumber}
                    onChange={e => {
                      let application = { ...this.state.application }
                      application.developerInfo.address.departmentNumber = e.target.value
                      this.setState({ application })
                    }}
                  />
                  <div className='label'>Ciudad:</div>
                  <InputText
                    maxLength='300'
                    type='text'
                    value={this.state.application.developerInfo.address.city}
                    onChange={e => {
                      let application = { ...this.state.application }
                      application.developerInfo.address.city = e.target.value
                      this.setState({ application })
                    }}
                  />
                  <div className='label'>Código Postal:</div>
                  <InputText
                    type='text'
                    value={this.state.application.developerInfo.address.postalCode}
                    onChange={e => {
                      let application = { ...this.state.application }
                      application.developerInfo.address.postalCode = e.target.value
                      this.setState({ application })
                    }}
                  />
                </div>
                <div className='label'>Código de área:</div>
                <InputText
                  type='Number'
                  value={this.state.application.developerInfo.phone.areaCode || ''}
                  onChange={e => {
                    let application = { ...this.state.application }
                    application.developerInfo.phone.areaCode = e.target.value
                    this.setState({ application })
                  }}
                />
                <div className='label'>Número fijo:</div>
                <InputText
                  type='Number'
                  value={this.state.application.developerInfo.phone.number || ''}
                  onChange={e => {
                    let application = { ...this.state.application }
                    application.developerInfo.phone.number = e.target.value
                    this.setState({ application })
                  }}
                />
                <div className='label'>Celular:</div>
                <InputText
                  type='Number'
                  value={this.state.application.developerInfo.phone.mobilePhone}
                  onChange={e => {
                    let application = { ...this.state.application }
                    application.developerInfo.phone.mobilePhone = e.target.value
                    this.setState({ application })
                  }}
                />
              </div>
              <div className={styles.fieldGroup}>
                <div className='label'>Email:</div>
                <InputText
                  type='email'
                  value={this.state.application.developerInfo.email}
                  onChange={e => {
                    let application = { ...this.state.application }
                    application.developerInfo.email = e.target.value
                    this.setState({ application })
                  }}
                />
              </div>
            </div>
          )}
          <br />
          {this.props.userId === '' &&
            (this.props.showMessage(
              'Desarollador no registrado, sera redireccionado al registro de desarrolladores'
            ),
            this.props.history.push('/devs/registro'))}
          <Button
            onClick={() => this.BackList()}
            style={{ marginRight: 10 }}
            label='Cancelar'
            className='p-button-secondary'
            type='button'
          />
          {this.props.type === 'create' && (
            <Button label='Crear Aplicación' style={{ marginRight: 10 }} type='submit' />
          )}
          {this.props.type === 'update' && (
            <Button label='Guardar' style={{ marginRight: 10 }} type='submit' />
          )}
          {this.props.type === 'update' && (
            <Button
              className='p-button-danger'
              type='button'
              label='Eliminar'
              style={{ marginRight: 10 }}
              onClick={() => this.confirmDelete()}
            />
          )}
        </Section>
      </Form>
    )
  }
}
export default TemplateApplication
