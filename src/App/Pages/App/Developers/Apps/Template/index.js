import React from 'react'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import { withRouter } from 'react-router'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import styles from './styles.css'
import autobind from 'autobind-decorator'
import 'react-inputs-validation/lib/react-inputs-validation.min.css'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { Field, Form } from 'simple-react-form'
import SelectOrisoft from 'orionsoft-parts/lib/components/fields/Select'
import SearchBar from 'App/components/fields/GooglePlaces'
import FormatEmail from 'App/helpers/format/formatMail'
import FormatUrl from 'App/helpers/format/formatUrl'
import LinkToAccount from '../LinkToAccount'
import { Textbox } from 'react-inputs-validation'
import withUserId from 'App/helpers/auth/withUserId'
import AppFragments from 'App/fragments/Apps'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'

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
      validate: false,
      name: '',
      userFields: null,
      hasNameError: true,
      hasApplicationUrlError: true,
      hasUrlError: true,
      _id: '',
      description: '',
      applicationURL: '',
      fieldName: '',
      lastName: '',
      url: '',
      email: '',
      streetName: '',
      streetNumber: '',
      departmentNumber: '',
      postalCode: '',
      areaCode: '',
      number: '',
      mobilePhone: '',
      longitude: -70.740435,
      latitude: -34.1706134
    }
    this.validateForm = this.validateForm.bind(this)
    this.validateFormUpdate = this.validateFormUpdate.bind(this)
  }

  componentDidMount() {
    if (this.props.type === 'update') {
      let Application = this.props.application

      this.setState({
        ownerId: Application.ownerId,
        _id: Application._id,
        applicationURL: Application.applicationURL || '',
        name: Application.name || '',
        description: Application.description || '',
        userFields: Application.userFields || '',
        validate: false
      })
      let { developerInfo } = Application
      if (developerInfo !== null) {
        this.setState({
          firstName: Application.developerInfo.firstName || '',
          lastName: Application.developerInfo.lastName || '',
          url: Application.developerInfo.url || '',
          email: Application.developerInfo.email || '',
          streetName: Application.developerInfo.address.streetName || '',
          streetNumber: Application.developerInfo.address.streetNumber || '',
          departmentNumber: Application.developerInfo.address.departmentNumber || '',
          postalCode: Application.developerInfo.address.postalCode || '',
          areaCode: Application.developerInfo.phone.areaCode || '',
          number: Application.developerInfo.phone.number || '',
          mobilePhone: Application.developerInfo.phone.mobilePhone || ''
        })
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

  setApplication() {
    let s = this.state
    var Application = {
      _id: s._id,
      ownerId: this.props.type === 'create' ? this.props.userId : s.ownerId,
      name: s.name,
      description: s.description,
      userFields: s.userFields,
      applicationURL: s.applicationURL,
      developerInfo: {
        firstName: s.fieldName,
        lastName: s.lastName,
        url: s.url,
        email: s.email,
        address: {
          streetName: s.streetName,
          streetNumber: s.streetNumber,
          departmentNumber: s.departmentNumber,
          postalCode: s.postalCode
        },
        phone: {
          areaCode: s.areaCode !== '' ? s.areaCode : null,
          number: s.number,
          mobilePhone: s.mobilePhone
        }
      }
    }
    return Application
  }

  @autobind
  async onSubmitInsert() {
    try {
      var Application = this.setApplication()
      await this.props.createApplication({ application: Application })
      this.onSuccessInsert()
    } catch (error) {
      this.props.showMessage('Ocurrió un error al registrar el Aplicación')
    }
  }

  @autobind
  async onSubmitUpdate() {
    try {
      var Application = this.setApplication()
      await this.props.updateApplication({ application: Application })
      this.onSuccessUpdate()
    } catch (error) {
      this.props.showMessage('Ocurrió un error al editar el Aplicación')
    }
  }

  onSuccessDelete() {
    this.props.showMessage('Aplicación eliminado correctamente')
    this.props.history.push(`/devs/apps`)
  }

  @autobind
  async onDelete() {
    try {
      var Application = this.setApplication()
      await this.props.deleteApplication({ _id: Application._id })
      this.onSuccessDelete()
    } catch (error) {
      this.props.showMessage('Ocurrió un error al eliminar el Aplicación')
    }
  }

  handleChangeAddress = contactInformationAddress => {
    this.setState({
      streetName: contactInformationAddress.streetName,
      city: contactInformationAddress.city,
      departmentNumber: contactInformationAddress.departmentNumber,
      postalCode: contactInformationAddress.postalCode,
      streetNumber: contactInformationAddress.streetNumber,
      formatted_address: contactInformationAddress.formatted_address || '',
      place_id: contactInformationAddress.place_id || '',
      latitude: contactInformationAddress.latitude || '',
      longitude: contactInformationAddress.longitude || ''
    })
  }

  toggleValidating(validate) {
    this.setState({ validate })
  }
  Delete = () => {
    confirmAlert({
      title: 'Eliminar Aplicación',
      message: '¿Esta seguro que desea eliminar este Aplicación?',
      buttons: [
        {
          label: 'Si',
          onClick: () => this.onDelete()
        },
        {
          label: 'No'
        }
      ]
    })
  }

  async validateForm(e) {
    e.preventDefault()

    await this.toggleValidating(true)
    const { hasNameError, hasDescriptionError, hasApplicationUrlError, hasUrlError } = this.state
    if (!hasNameError && !hasDescriptionError && !hasApplicationUrlError && !hasUrlError) {
      this.props.showMessage('Campos validados correctamente')
      this.onSubmitInsert()
    } else {
      this.props.showMessage('Verifique que todos los datos estén correctos')
    }
  }

  async validateFormUpdate(e) {
    e.preventDefault()
    await this.toggleValidating(true)
    const { hasNameError, hasDescriptionError, hasApplicationUrlError, hasUrlError } = this.state
    if (!hasNameError && !hasDescriptionError && !hasApplicationUrlError && !hasUrlError) {
      this.props.showMessage('Campos validados correctamente')
      this.onSubmitUpdate()
    } else {
      this.props.showMessage('Verifique que todos los datos estén correctos')
    }
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

  render() {
    const {
      validate,
      name,
      description,
      applicationURL,
      firstName,
      lastName,
      url,
      streetName,
      streetNumber,
      departmentNumber,
      city,
      postalCode,
      areaCode,
      number,
      mobilePhone,
      email
    } = this.state
    return (
      <Form state={this.state} onChange={changes => this.setState(changes)}>
        <Section title={this.props.title} description={this.props.description} top>
          <div className={styles.headerLabel}>Información de la aplicación:</div>

          <div className={styles.fieldGroup}>
            <div className={styles.label}>Nombre:</div>
            <Textbox
              tabIndex='1'
              id={'Name'}
              name={'Name'}
              maxLength='300'
              type='text'
              value={name}
              validate={validate}
              validationCallback={res => {
                this.setState({ hasNameError: res, validate: false })
              }}
              onChange={(name, e) => {
                this.setState({ name })
              }}
              validationOption={{ name: 'Nombre', check: true, required: true }}
            />
            <div className={styles.label}>Descripción:</div>
            <Textbox
              tabIndex='2'
              id={'description'}
              name={'description'}
              maxLength='300'
              type='text'
              value={description}
              validate={validate}
              onChange={(description, e) => {
                this.setState({ description })
              }}
              validationOption={{ name: 'Descripción', check: false, required: false }}
            />
            <div className={styles.label}>URL de redirección:</div>
            <Textbox
              tabIndex='3'
              id={'applicationURL'}
              name={'applicationURL'}
              maxLength='300'
              type='text'
              value={applicationURL}
              validate={validate}
              onChange={(applicationURL, e) => {
                this.setState({ applicationURL })
              }}
              validationCallback={res => {
                this.setState({ hasApplicationUrlError: res, validate: false })
              }}
              validationOption={{
                name: 'Url aplicación',
                check: true,
                required: false,
                customFunc: applicationURL => {
                  return FormatUrl(applicationURL)
                }
              }}
            />
            <div className={styles.label}>Datos de usuario:</div>
            <Field
              fieldName='userFields'
              type={SelectOrisoft}
              multi
              onChange={userFields => {
                this.setState({ userFields })
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
          </div>
          {this.props.userId !== '' && (
            <div>
              <div className={styles.headerLabel} style={{ marginBottom: 10 }}>
                Información del desarrollador:
              </div>
              <div>{this.renderLinkToAccountButton()}</div>
              <div className={styles.fieldGroup} style={{ marginTop: 15 }}>
                <div className={styles.label}>Nombre:</div>
                <Textbox
                  tabIndex='4'
                  id={'firstName'}
                  name={'firstName'}
                  maxLength='300'
                  type='text'
                  value={firstName}
                  validate={validate}
                  onChange={(firstName, e) => {
                    this.setState({ firstName })
                  }}
                  validationOption={{ name: 'Nombre', check: false, required: false }}
                />

                <div className={styles.label}>Apellido:</div>
                <Textbox
                  tabIndex='5'
                  id={'lastName'}
                  name={'lastName'}
                  maxLength='300'
                  type='text'
                  value={lastName}
                  validate={validate}
                  onChange={(lastName, e) => {
                    this.setState({ lastName })
                  }}
                  validationOption={{ name: 'Url aplicación', check: false, required: false }}
                />
                <div className={styles.label}>Pagina Web:</div>
                <Textbox
                  tabIndex='6'
                  id={'url'}
                  name={'url'}
                  maxLength='300'
                  type='text'
                  value={url}
                  validate={validate}
                  onChange={(url, e) => {
                    this.setState({ url })
                  }}
                  validationCallback={res => {
                    this.setState({ hasUrlError: res, validate: false })
                  }}
                  validationOption={{
                    name: 'Url',
                    check: true,
                    required: false,
                    customFunc: url => {
                      return FormatUrl(url)
                    }
                  }}
                />
                <div className={styles.headerLabel}>Información de contacto:</div>
                <div className={styles.fieldGroup}>
                  <div className={styles.subheaderLabel}>Dirección:</div>
                  <div className={styles.fieldGroup}>
                    <SearchBar
                      handleChangeAddress={this.handleChangeAddress}
                      latitude={this.state.latitude}
                      longitude={this.state.longitude}
                      address={this.state.formatted_address}
                    />
                    <div className={styles.label}>Nombre de calle:</div>
                    <Textbox
                      tabIndex='7'
                      id={'streetName'}
                      name={'streetName'}
                      maxLength='300'
                      type='text'
                      value={streetName}
                      validate={validate}
                      onChange={(streetName, e) => {
                        this.setState({ streetName })
                      }}
                      validationOption={{ name: 'Calle ', check: false, required: false }}
                    />
                    <div className={styles.label}>Numeración:</div>
                    <Textbox
                      tabIndex='8'
                      id={'streetNumber'}
                      name={'streetNumber'}
                      maxLength='300'
                      type='text'
                      value={streetNumber}
                      validate={validate}
                      onChange={(streetNumber, e) => {
                        this.setState({ streetNumber })
                      }}
                      validationOption={{ name: 'Número ', check: false, required: false }}
                    />
                    <div className={styles.label}>
                      Número de oficina/casa/departamento (opcional):
                    </div>
                    <Textbox
                      tabIndex='9'
                      id={'departmentNumber'}
                      name={'departmentNumber'}
                      maxLength='300'
                      type='text'
                      value={departmentNumber}
                      validate={validate}
                      onChange={(departmentNumber, e) => {
                        this.setState({ departmentNumber })
                      }}
                      validationOption={{
                        name: 'Número de departamento',
                        check: false,
                        required: false
                      }}
                    />
                    <div className={styles.label}>Ciudad:</div>
                    <Textbox
                      tabIndex='10'
                      id={'city'}
                      name={'city'}
                      maxLength='300'
                      type='text'
                      value={city}
                      validate={validate}
                      onChange={(city, e) => {
                        this.setState({ city })
                      }}
                      validationOption={{
                        name: 'Ciudad',
                        check: false,
                        required: false
                      }}
                    />
                    <div className={styles.label}>Código Postal:</div>
                    <Textbox
                      tabIndex='11'
                      id={'postalCode'}
                      name={'postalCode'}
                      maxLength='300'
                      type='text'
                      value={postalCode}
                      validate={validate}
                      onChange={(postalCode, e) => {
                        this.setState({ postalCode })
                      }}
                      validationOption={{
                        name: 'Código Postal',
                        check: false,
                        required: false
                      }}
                    />
                  </div>
                  <div className={styles.subheaderLabel}>Teléfono:</div>
                  <div className={styles.fieldGroup}>
                    <div className={styles.label}>Código de área:</div>
                    <Textbox
                      tabIndex='11'
                      id={'areaCode'}
                      name={'areaCode'}
                      maxLength='300'
                      type='Number'
                      value={areaCode}
                      validate={validate}
                      onChange={(areaCode, e) => {
                        this.setState({ areaCode })
                      }}
                      validationOption={{
                        name: 'Código de área',
                        check: false,
                        required: false
                      }}
                    />
                    <div className={styles.label}>Número fijo:</div>
                    <Textbox
                      tabIndex='11'
                      id={'number'}
                      name={'number'}
                      maxLength='300'
                      type='Number'
                      value={number}
                      validate={validate}
                      onChange={(number, e) => {
                        this.setState({ number })
                      }}
                      validationOption={{
                        name: 'Número Fijo',
                        check: false,
                        required: false
                      }}
                    />
                    <div className={styles.label}>Celular:</div>
                    <Textbox
                      tabIndex='11'
                      id={'mobilePhone'}
                      name={'mobilePhone'}
                      maxLength='300'
                      type='Number'
                      value={mobilePhone}
                      validate={validate}
                      onChange={(mobilePhone, e) => {
                        this.setState({ mobilePhone })
                      }}
                      validationOption={{
                        name: 'Célular',
                        check: false,
                        required: false
                      }}
                    />
                  </div>
                  <div className={styles.subheaderLabel}>Email:</div>
                  <div className={styles.fieldGroup}>
                    <div className={styles.label}>Email:</div>
                    <Textbox
                      tabIndex='11'
                      id={'email'}
                      name={'email'}
                      maxLength='300'
                      type='text'
                      value={email}
                      validate={validate}
                      onChange={(email, e) => {
                        this.setState({ email })
                      }}
                      validationOption={{
                        name: 'Email',
                        check: true,
                        required: false,
                        customFunc: email => {
                          return FormatEmail(email)
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {this.props.userId === '' &&
            (this.props.showMessage(
              'Desarollador no registrado, sera redireccionado al registro de desarrolladores'
            ),
            this.props.history.push('/devs/registro'))}

          <div className='os_button_container padding'>
            <button style={{ marginRight: 10 }} className='orion_button ' onClick={this.BackList}>
              Volver
            </button>
            {this.props.type === 'update' && (
              <button
                style={{ marginRight: 10 }}
                onClick={this.Delete}
                className='orion_button orion_danger'
              >
                Eliminar Aplicación
              </button>
            )}
            {this.props.type === 'update' && (
              <button
                style={{ marginRight: 10 }}
                onClick={this.validateFormUpdate}
                className='orion_button orion_primary'
              >
                Actualizar Aplicación
              </button>
            )}
            {this.props.type === 'create' && (
              <button onClick={this.validateForm} className='orion_button orion_primary'>
                Crear Aplicación
              </button>
            )}
          </div>
        </Section>
      </Form>
    )
  }
}
export default TemplateApplication
