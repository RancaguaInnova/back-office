import React from 'react'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import { withRouter } from 'react-router'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import styles from './styles.css'
import SearchBar from 'App/components/fields/google/GooglePlaces'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
import { Textbox, Select } from 'react-inputs-validation'
import 'react-inputs-validation/lib/react-inputs-validation.min.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import DepartmentFragments from 'App/fragments/Department'
import OfficialsFragments from 'App/fragments/Official'
import ServiceAreasFragments from 'App/fragments/ServiceArea'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

@withRouter
@withMessage
@withMutation(gql`
  mutation updateDepartment($department: DepartmentInput!) {
    updateDepartment(department: $department) {
      _id
    }
  }
`)
@withMutation(gql`
  mutation deleteDepartment($_id: ID!) {
    deleteDepartment(_id: $_id) 
  }
`)
@withGraphQL(gql`
  query department($departmentId: ID!) {
    department(departmentId: $departmentId) {
      ...FullDepartment
    }
    officials {
      ...SelectOfficial
    }
     serviceAreas {
      ...SelectServiceArea
    }
  }
  ${DepartmentFragments.FullDepartment}
  ${OfficialsFragments.Officials}
  ${ServiceAreasFragments.ServiceAreas}

`)

class UpdateDepartment extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    department: PropTypes.object,
    UpdateDepartment: PropTypes.func,
    officials: PropTypes.object,
    serviceAreas: PropTypes.object,
    DeleteResponse: PropTypes.bool
  }

  componentDidMount() {

    let defaultItem = {
      name: 'Seleccione una opción',
      id: ''
    }
    this.props.officials.items.unshift(defaultItem)
    this.props.serviceAreas.items.unshift(defaultItem)
    // this.setState({ department: this.props.department })
    this.setState({
      department: this.props.department,
      validate: false,
      name: this.props.department.name || '',
      optionLabel: this.props.department.optionLabel || '',
      managerId: this.props.department.managerId || '',
      serviceAreaId: this.props.department.serviceAreaId || '',
      businessHours: this.props.department.businessHours || '',
      description: this.props.department.description || '',
      imageUrl: this.props.department.imageUrl || '',
      contactInformationAddressCity: this.props.department.contactInformation.address.city || '',
      address: this.props.department.address || '',
      contactInformationAddressCountry: this.props.department.contactInformation.address.country || '',
      contactInformationAddressStreetNumber: this.props.department.contactInformation.address.streetNumber || '',
      contactInformationAddressDepartmentNumber: this.props.department.contactInformation.address.departmentNumber || '',
      contactInformationAddressStreetName: this.props.department.contactInformation.address.streetName || '',
      contactInformationAddressAdministrativeAreaLevel2: this.props.department.contactInformation.address.administrativeAreaLevel2 || '',
      contactInformationAddressAdministrativeAreaLevel1: this.props.department.contactInformation.address.administrativeAreaLevel1 || '',
      contactInformationAddressFormatted_address: this.props.department.contactInformation.address.formatted_address,
      contactInformationAddressPlace_id: this.props.department.contactInformation.address.place_id || '',
      contactInformationAddressLatitud: this.props.department.contactInformation.address.latitude,
      contactInformationAddressLongitud: this.props.department.contactInformation.address.longitude,
      contactInformationAddressPostalCode: this.props.department.contactInformation.address.postalCode || '',
      officialsArray: this.props.officials.items,
      serviceAreasArray: this.props.serviceAreas.items
    })
  }

  onSuccess() {
    this.props.showMessage('Departamento Actualizado correctamente')
    this.props.history.push(`/directorio/departamentos/`)
  }
  onSuccessDelete() {
    this.props.showMessage('Departamento eliminado correctamente')
    this.props.history.push(`/directorio/departamentos/`)
  }

  @autobind
  async onSubmit() {
    try {
      await this.props.updateDepartment({ department: this.state.department })
      this.onSuccess()
    } catch (error) {
      this.props.showMessage(
        'Ocurrió un error al editar el departamento'
      )
    }
  }

  @autobind
  async onDelete() {
    try {

      await this.props.deleteDepartment({ _id: this.state.department._id })
      this.onSuccessDelete()
    } catch (error) {
      this.props.showMessage(
        'Ocurrió un error al eliminar el departamento'
      )
      console.log(error)
    }
  }

  Delete = () => {
    confirmAlert({
      title: 'Eliminar Departamento',
      message: '¿Esta seguro que desea eliminar este departamento?',
      buttons: [
        {
          label: 'Si',
          onClick: () => this.onDelete()
        },
        {
          label: 'No',
          onClick: () => console.log('no')
        }
      ]
    })
  };

  handleChangeAddress = contactInformationAddress => {

    let department = this.state.department
    department.contactInformation.address = contactInformationAddress

    this.setState({
      department: department,
      contactInformationAddressStreetName: contactInformationAddress.streetName,
      contactInformationAddressAdministrativeAreaLevel1:
        contactInformationAddress.administrativeAreaLevel1,
      contactInformationAddressAdministrativeAreaLevel2:
        contactInformationAddress.administrativeAreaLevel2,
      contactInformationAddressCity: contactInformationAddress.city,
      contactInformationAddressDepartmentNumber:
        contactInformationAddress.departmentNumber,
      contactInformationAddressPostalCode: contactInformationAddress.postalCode,
      contactInformationAddressStreetNumber:
        contactInformationAddress.streetNumber,
      contactInformationAddressCountry: contactInformationAddress.country,
      contactInformationAddressFormatted_address: contactInformationAddress.formatted_address || '',
      contactInformationAddressPlace_id: contactInformationAddress.place_id || '',
      contactInformationAddressLatitud: contactInformationAddress.latitude || '',
      contactInformationAddressLongitud: contactInformationAddress.longitude || ''

    })
  }

  constructor(props) {
    super(props)
    this.state = {
      hasNameError: false,
      hasContactInformationPhoneAreaCodeError: false,
      hasContactInformationPhoneNumberError: false,
      hasContactInformationMobilePhoneCodeError: false,
      hasContactInformationEmailCodeError: false,
      hasBusinessHoursCodeError: false,
      hasImageUrlCodeError: false,
      hasAddressCodeError: false,
      hasManageIdError: false,
      hasServiceAreaIdError: false,
      hasContactInformationAddressStreetNameCodeError: false,
      hasContactInformationAddressDepartmentNumberCodeError: false,
      hascontactInformationAddressAdministrativeAreaLevel1CodeError: false,
      hascontactInformationAddressAdministrativeAreaLevel2CodeError: false,
      validate: false
    }
    this.validateForm = this.validateForm.bind(this)
  }

  toggleValidating(validate) {
    this.setState({ validate })
  }

  validateForm(e) {
    e.preventDefault()
    this.toggleValidating(true)
    const {
      hasNameError,
      hasContactInformationEmailCodeError
      /*     hasContactInformationPhoneAreaCodeError,
      hasContactInformationPhoneNumberError,
      hasContactInformationMobilePhoneCodeError,
      hasBusinessHoursCodeError,
      hasImageUrlCodeError,
      hasAddressCodeError,
      hasManageIdError,
      hasServiceAreaIdError,
      hasContactInformationAddressStreetNameCodeError,
      hascontactInformationAddressAdministrativeAreaLevel1CodeError,
      hascontactInformationAddressAdministrativeAreaLevel2CodeError,
      hasContactInformationAddressDepartmentNumberCodeError,
      hasContactInformationAddressPostalCodeCodeError */
    } = this.state
    /*
 && !hasManageIdError && !hasContactInformationPhoneAreaCodeError && !hasContactInformationPhoneNumberError &&
      !hasContactInformationMobilePhoneCodeError && !hasContactInformationEmailCodeError && !hasBusinessHoursCodeError &&
      !hasImageUrlCodeError && !hasAddressCodeError && !hasServiceAreaIdError &&
      !hasContactInformationAddressStreetNameCodeError && !hascontactInformationAddressAdministrativeAreaLevel1CodeError &&
      !hascontactInformationAddressAdministrativeAreaLevel2CodeError && !hasContactInformationAddressDepartmentNumberCodeError && !hasContactInformationAddressPostalCodeCodeError
 */

    if (!hasNameError && !hasContactInformationEmailCodeError) {
      this.props.showMessage('Campos validados correctamente')
      this.onSubmit()
    } else {
      this.props.showMessage('Verifique que todos los datos estén correctos')
    }
  }

  render() {
    const {
      name,
      optionLabel,
      managerId,
      serviceAreaId,
      contactInformationPhoneNumber,
      validate,
      contactInformationPhoneAreaCode,
      contactInformationAddressDepartmentNumber,
      contactInformationPhoneMobilePhone,
      contactInformationEmail,
      contactInformationAddressCountry,
      description,
      imageUrl,
      address,
      businessHours,
      contactInformationAddressStreetName,
      contactInformationAddressStreetNumber,
      contactInformationAddressCity,
      contactInformationAddressAdministrativeAreaLevel2,
      contactInformationAddressAdministrativeAreaLevel1,
      contactInformationAddressPostalCode

    } = this.state
    return (
      <Section
        title="Actualizar Departamento"
        description="Actualizar departamento"
        top
      >
        <div className={styles.fieldGroup}>
          <div className={styles.label}>Nombre</div>
          <Textbox
            tabIndex="1"
            id={'Name'}
            name="Name"
            type="text"
            value={name}
            placeholder=""
            validate={validate}
            validationCallback={res => {
              this.setState({ hasNameError: res, validate: false })
            }}
            onChange={(name, e) => {
              let department = this.state.department
              department.name = name

              this.setState({
                department: department,
                name: name
              })
            }}
            validationOption={{
              name: 'Nombre',
              check: true,
              required: true
            }}
          />

          <div className={styles.label}>
            Texto que aparecerá en campos para seleccionar departamentos
          </div>

          <Textbox
            tabIndex="2"
            id={'optionLabel'}
            name="optionLabel"
            type="text"
            value={optionLabel}
            placeholder=""
            onChange={(optionLabel, e) => {
              let department = this.state.department
              department.optionLabel = optionLabel

              this.setState({
                department: optionLabel,
                optionLabel: optionLabel
              })
            }}
            validationOption={{
              name: 'optionLabel',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>Director(a) de este departamento</div>
          <Select
            tabIndex="3"
            id={'managerId'}
            name={'managerId'}
            value={managerId}
            optionList={this.state.officialsArray}
            onChange={(managerId, e) => {
              let department = this.state.department
              department.managerId = managerId
              this.setState({
                department: department,
                managerId: managerId
              })
            }}
            validate={validate}
            validationCallback={res =>
              this.setState({ hasManageIdError: res, validate: false })
            }
            customStyleOptionListContainer={{
              maxHeight: '200px',
              overflow: 'auto',
              fontSize: '14px'
            }} // Optional.[Object].Default: {}.
            validationOption={{
              name: 'managerId',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>
            Area de servicio a la que pertenece este departamento
          </div>
          <Select
            tabIndex="4"
            id={'serviceAreaId'}
            name={'serviceAreaId'}
            value={serviceAreaId}
            optionList={this.state.serviceAreasArray} // Required.[Array of Object(s)].Default: [].
            onChange={(serviceAreaId, e) => {
              let department = this.state.department
              department.serviceAreaId = serviceAreaId
              this.setState({
                department: department,
                serviceAreaId: serviceAreaId
              })
            }}
            validate={validate}
            validationCallback={res =>
              this.setState({ hasServiceAreaIdError: res, validate: false })
            }
            customStyleOptionListContainer={{
              maxHeight: '200px',
              overflow: 'auto',
              fontSize: '14px'
            }} // Optional.[Object].Default: {}.
            validationOption={{
              name: 'serviceAreaId',
              check: false,
              required: false
            }}
          />
        </div>
        <div className={styles.subheaderLabel}>INFORMACIÓN DE CONTACTO:</div>
        <div>
          <b>DIRECCIÓN</b>
        </div>
        <div className={styles.fieldGroup}>
          <SearchBar
            handleChangeAddress={this.handleChangeAddress}
            address={this.props.department.contactInformation.address.formatted_address}
            longitude={this.props.department.contactInformation.address.longitude}
            latitude={this.props.department.contactInformation.address.latitude} />
          <div className={styles.label}>Calle</div>
          <Textbox
            tabIndex="5"
            id="contactInformation.address.streetName"
            name="contactInformation.address.streetName"
            type="text"
            value={contactInformationAddressStreetName}
            disabled={false}
            maxLength="300"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({
                hasContactInformationAddressStreetNameCodeError: res,
                validate: false
              })
            }
            onChange={(contactInformationAddressStreetName, e) => {

              let department = this.state.department
              department.contactInformation.address.streetName = contactInformationAddressStreetName
              this.setState({
                department: department,
                contactInformationAddressStreetName: contactInformationAddressStreetName
              })
            }}
            validationOption={{
              name: 'Calle',
              check: true,
              required: false
            }}
          />
          <div className={styles.label}>Numero</div>
          <Textbox
            tabIndex="6"
            id="contactInformation.address.streetNumber"
            name="contactInformation.address.streetNumber"
            type="text"
            value={contactInformationAddressStreetNumber}
            disabled={false}
            maxLength="30"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({
                hasContactInformationAddressStreetNameCodeError: res,
                validate: false
              })
            }
            onChange={(contactInformationAddressStreetNumber, e) => {
              let department = this.state.department
              department.contactInformation.address.streetNumber = contactInformationAddressStreetNumber
              this.setState({
                contactInformationAddressStreetNumber: contactInformationAddressStreetNumber,
                department: department
              })
            }}
            validationOption={{
              name: 'Calle',
              check: true,
              required: false
            }}
          />

          <div className={styles.label}>Numero Departamento/Otro</div>
          <Textbox
            tabIndex="7"
            id="contactInformation.address.departmentNumber"
            name="contactInformation.address.departmentNumber"
            type="text"
            value={contactInformationAddressDepartmentNumber}
            disabled={false}
            maxLength="30"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({
                hasContactInformationAddressDepartmentNumberCodeError: res,
                validate: false
              })
            }
            onChange={(contactInformationAddressDepartmentNumber, e) => {

              let department = this.state.department
              department.contactInformation.address.departmentNumber = contactInformationAddressDepartmentNumber
              this.setState({
                department: department,
                contactInformationAddressDepartmentNumber: contactInformationAddressDepartmentNumber
              })
            }}
            validationOption={{
              name: 'Número de departamento',
              check: true,
              required: false
            }}
          />

          <div className={styles.label}>Ciudad</div>
          <Textbox
            tabIndex="8"
            id="contactInformation.address.city"
            name="contactInformation.address.city"
            type="text"
            value={contactInformationAddressCity}
            disabled={false}
            maxLength="30"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({
                hasContactInformationAddressDepartmentNumberCodeError: res,
                validate: false
              })
            }
            onChange={(contactInformationAddressCity, e) => {

              let department = this.state.department
              department.contactInformation.address.city = contactInformationAddressCity
              this.setState({
                department: department,
                contactInformationAddressCity: contactInformationAddressCity
              })
            }}
            validationOption={{
              name: 'Número de departamento',
              check: true,
              required: false
            }}
          />
          <div className={styles.label}>Provincia</div>
          <Textbox
            tabIndex="9"
            id="contactInformation.address.administrativeAreaLevel2"
            name="contactInformation.address.administrativeAreaLevel2"
            type="text"
            value={contactInformationAddressAdministrativeAreaLevel2}
            disabled={false}
            maxLength="300"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({
                hascontactInformationAddressAdministrativeAreaLevel2CodeError: res,
                validate: false
              })
            }
            onChange={(
              contactInformationAddressAdministrativeAreaLevel2,
              e
            ) => {
              let department = this.state.department
              department.contactInformation.address.administrativeAreaLevel2 = contactInformationAddressAdministrativeAreaLevel2
              this.setState({
                department: department,
                contactInformationAddressAdministrativeAreaLevel2: contactInformationAddressAdministrativeAreaLevel2
              })
            }}
            validationOption={{
              name: 'Provincia',
              check: true,
              required: false
            }}
          />
          <div className={styles.label}>Región</div>
          <Textbox
            tabIndex="10"
            id="contactInformation.address.administrativeAreaLevel1"
            name="contactInformation.address.administrativeAreaLevel1"
            type="text"
            value={contactInformationAddressAdministrativeAreaLevel1}
            disabled={false}
            maxLength="300"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({
                hascontactInformationAddressAdministrativeAreaLevel1CodeError: res,
                validate: false
              })
            }
            onChange={(
              contactInformationAddressAdministrativeAreaLevel1,
              e
            ) => {

              let department = this.state.department
              department.contactInformation.address.contactInformationAddressAdministrativeAreaLevel1 = contactInformationAddressAdministrativeAreaLevel1
              this.setState({
                department: department,
                contactInformationAddressAdministrativeAreaLevel1: contactInformationAddressAdministrativeAreaLevel1
              })
            }}
            validationOption={{
              name: 'Región',
              check: true,
              required: false
            }}
          />

          <div className={styles.label}>País</div>
          <Textbox
            tabIndex="11"
            id="contactInformation.address.country"
            name="contactInformation.address.country"
            type="text"
            value={contactInformationAddressCountry}
            disabled={false}
            maxLength="300"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({
                hasContactInformationAddressCountryCodeError: res,
                validate: false
              })
            }
            onChange={(contactInformationAddressCountry, e) => {
              let department = this.state.department
              department.contactInformation.address.country = contactInformationAddressCountry
              this.setState({ department: department, contactInformationAddressCountry: contactInformationAddressCountry })
            }}
            validationOption={{
              name: 'País',
              check: true,
              required: false
            }}
          />
          <div className={styles.label}>Código Postal</div>
          <Textbox
            tabIndex="12"
            id="contactInformation.address.postalCode"
            name="contactInformation.address.postalCode"
            type="text"
            value={contactInformationAddressPostalCode}
            disabled={false}
            maxLength="300"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({
                hasContactInformationAddressPostalCodeCodeError: res,
                validate: false
              })
            }
            onChange={(contactInformationAddressPostalCode, e) => {
              let department = this.state.department
              department.contactInformation.address.postalCode = contactInformationAddressPostalCode
              this.setState({
                department: department,
                contactInformationAddressPostalCode: contactInformationAddressPostalCode
              })
            }}
            validationOption={{
              name: 'Código Postal',
              check: true,
              required: false
            }}
          />
        </div>

        <div>
          <b>TELÉFONO</b>
        </div>
        <div className={styles.fieldGroup}>
          <div className={styles.label}>Código de área</div>
          <Textbox
            tabIndex="13"
            id="contactInformation.Phone.areaCode"
            name="contactInformation.Phone.areaCode"
            type="number"
            value={contactInformationPhoneAreaCode}
            disabled={false}
            maxLength="5"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({
                hascontactInformationPhoneAreaCodeError: res,
                validate: false
              })
            }
            onChange={(contactInformationPhoneAreaCode, e) => {

              let department = this.state.department
              department.contactInformation.Phone.areaCode = contactInformationPhoneAreaCode
              this.setState({
                department: department,
                contactInformationPhoneAreaCode: contactInformationPhoneAreaCode
              })
            }}
            validationOption={{
              name: 'Código de Área',
              check: true,
              required: false
            }}
          />
          <div className={styles.label}>Número</div>
          <Textbox
            tabIndex="14"
            id="contactInformation.Phone.number"
            name="contactInformation.Phone.number"
            type="number"
            value={contactInformationPhoneNumber}
            disabled={false}
            maxLength="12"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({
                hasContactInformationNumberCodeError: res,
                validate: false
              })
            }
            onChange={(contactInformationPhoneNumber, e) => {

              let department = this.state.department
              department.contactInformation.address.number = contactInformationPhoneNumber
              this.setState({
                department: department,
                contactInformationPhoneNumber: contactInformationPhoneNumber
              })
            }}
            validationOption={{
              name: 'Número de Teléfono',
              check: true,
              required: false
            }}
          />
          <div className={styles.label}>Celular</div>
          <Textbox
            tabIndex="15"
            id="contactInformation.Phone.number"
            name="contactInformation.Phone.number"
            type="number"
            value={contactInformationPhoneMobilePhone}
            disabled={false}
            maxLength="13"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({
                hasContactInformationMobilePhoneCodeError: res,
                validate: false
              })
            }
            onChange={(contactInformationPhoneMobilePhone, e) => {
              let department = this.state.department
              department.contactInformation.Phone.number = contactInformationPhoneMobilePhone
              this.setState({
                department: department,
                contactInformationPhoneMobilePhone: contactInformationPhoneMobilePhone
              })
            }}
            validationOption={{
              name: 'Número de Celular',
              check: true,
              required: false
            }}
          />

          <div className={styles.label}>Email</div>
          <Textbox
            tabIndex="16"
            id="contactInformation.email"
            name="contactInformation.email"
            type="text"
            value={contactInformationEmail}
            disabled={false}
            maxLength="100"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({
                hasContactInformationEmailCodeError: res,
                validate: false
              })
            }
            onChange={(contactInformationEmail, e) => {
              let department = this.state.department
              department.contactInformation.address.email = contactInformationEmail
              this.setState({
                department: department,
                contactInformationEmail: contactInformationEmail
              })
            }}
            validationOption={{
              name: 'Email',
              required: false,
              customFunc: contactInformationEmail => {
                // eslint-disable-next-line no-useless-escape
                const reg = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                if (
                  contactInformationEmail === '' ||
                  reg.test(String(contactInformationEmail).toLowerCase())
                ) {
                  return true
                } else {
                  return 'Ingrese una dirección de email válido'
                }
              }
            }}
          />
          <div className={styles.label}>
            Horarios de atención (Ej: lunes a jueves / 08:30 a 13:30 / Viernes
            08:30 a 16:30)
          </div>
          <Textbox
            tabIndex="17"
            id="businessHours"
            name="businessHours"
            type="text"
            value={businessHours}
            disabled={false}
            maxLength="300"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({ hasBusinessHoursCodeError: res, validate: false })
            }
            onChange={(businessHours, e) => {
              let department = this.state.department
              department.businessHours = businessHours
              this.setState({
                department: department,
                businessHours: businessHours
              })
            }}
            validationOption={{
              name: 'Horarios de atención',
              check: true,
              required: false
            }}
          />
          <div className={styles.label}>
            Descripción de funciones del departamento
          </div>
          <Textbox
            tabIndex="18"
            id="description"
            name="description"
            type="text"
            value={description}
            disabled={false}
            maxLength="300"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({ hasDescriptionCodeError: res, validate: false })
            }
            onChange={(description, e) => {
              let department = this.state.department
              department.description = description
              this.setState({
                department: department,
                description: description
              })
            }}
            validationOption={{
              name: 'Descripción de funciones del departamento',
              check: true,
              required: false
            }}
          />

          <div className={styles.label}>
            Imagen del edificio donde se encuentra el departamento
          </div>
          <Textbox
            tabIndex="19"
            id="imageUrl"
            name="imageUrl"
            type="text"
            value={imageUrl}
            disabled={false}
            maxLength="300"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({ hasImageUrlCodeError: res, validate: false })
            }
            onChange={(imageUrl, e) => {
              this.setState({
                imageUrl
              })

              let department = this.state.department
              department.imageUrl = imageUrl
              this.setState({
                department: department
              })
            }}
            validationOption={{
              name: 'Imagen del edificio',
              check: true,
              required: false
            }}
          />
          <div className={styles.label}>
            Dirección del departamento de tránsito
          </div>
          <Textbox
            tabIndex="20"
            id="address"
            name="address"
            type="text"
            value={address}
            disabled={false}
            maxLength="300"
            placeholder=""
            validate={validate}
            validationCallback={res =>
              this.setState({ hasAddressCodeError: res, validate: false })
            }
            onChange={(address, e) => {

              let department = this.state.department
              department.address = address
              this.setState({
                department: department,
                address: address
              })
            }}
            validationOption={{
              name: 'Dirección del departamento',
              check: true,
              required: false
            }}
          />
        </div>
        <div className="os_button_container padding">
          <button style={{ marginRight: 10 }} className="orion_button ">
            Volver
          </button>

          <button
            style={{ marginRight: 10 }}
            onClick={this.Delete}
            className="orion_button orion_danger"
          >
            Eliminar Departamento
          </button>

          <button
            style={{ marginRight: 10 }}
            onClick={this.validateForm}
            className="orion_button orion_primary"
          >
            Actualizar Departamento
          </button>
        </div>
      </Section>
    )
  }
}
export default UpdateDepartment
