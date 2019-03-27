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
import FormatEmail from 'App/helpers/format/formatMail'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

@withRouter
@withMessage
@withMutation(gql`
  mutation createDepartment($department: DepartmentInput!) {
    createDepartment(department: $department) {
      _id
    }
  }
`)
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
class TemplateDepartment extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    createDepartment: PropTypes.func,
    department: PropTypes.object,
    updateDepartment: PropTypes.func,
    deleteDepartment: PropTypes.func,
    officials: PropTypes.object,
    serviceAreas: PropTypes.object,
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.state = {
      validate: false,
      officialsArray: this.props.officials.items,
      serviceAreasArray: this.props.serviceAreas.items,
      name: '',
      optionLabel: '',
      managerId: '',
      serviceAreaId: '',
      businessHours: '',
      description: '',
      imageUrl: '',
      city: '',
      address: '',
      country: '',
      streetNumber: '',
      streetName: '',
      administrativeAreaLevel2: '',
      administrativeAreaLevel1: '',
      postalCode: '',
      hasNameError: true,
      hasEmailCodeError: true
    }
    this.validateForm = this.validateForm.bind(this)
    this.validateFormUpdate = this.validateFormUpdate.bind(this)
  }
  componentDidMount() {
    if (this.props.type === 'update') {
      let department = this.props.department
      let address = department.contactInformation.address
      let phone = department.contactInformation.phone
      this.setState({
        _id: department._id,
        validate: false,
        name: department.name || '',
        optionLabel: department.optionLabel || '',
        managerId: department.managerId || '',
        serviceAreaId: department.serviceAreaId || '',
        businessHours: department.businessHours || '',
        description: department.description || '',
        imageUrl: department.imageUrl || '',
        city: address.city || '',
        address: department.address || '',
        country: address.country || '',
        streetNumber: address.streetNumber || '',
        departmentNumber: address.departmentNumber || '',
        streetName: address.streetName || '',
        administrativeAreaLevel2: address.administrativeAreaLevel2 || '',
        administrativeAreaLevel1: address.administrativeAreaLevel1 || '',
        formatted_address: address.formatted_address,
        place_id: address.place_id || '',
        latitude: address.latitude,
        longitude: address.longitude,
        postalCode: address.postalCode || '',
        areaCode: phone.areaCode || '',
        number: phone.number || '',
        mobilePhone: phone.mobilePhone || '',
        email: department.contactInformation.email
      })
    }
  }

  onSuccessInsert() {
    this.props.showMessage('Departamento creado')
    this.props.history.push(`/directorio/departamentos/`)
  }
  onSuccessUpdate() {
    this.props.showMessage('Departamento actualizado correctamente')
    this.props.history.push(`/directorio/departamentos/`)
  }

  setDepartment() {
    let s = this.state
    var department = {
      _id: s._id,
      name: s.name,
      optionLabel: s.optionLabel,
      managerId: s.managerId,
      serviceAreaId: s.serviceAreaId,
      businessHours: s.businessHours,
      description: s.description,
      imageUrl: s.imageUrl,
      address: s.address,
      tags: null,
      contactInformation: {
        phone: {
          areaCode: s.areaCode,
          number: s.number,
          mobilePhone: s.mobilePhone
        },
        address: {
          streetName: s.streetName,
          streetNumber: s.streetNumber,
          departmentNumber: s.departmentNumber,
          city: s.city,
          postalCode: s.postalCode,
          administrativeAreaLevel1: s.administrativeAreaLevel1,
          administrativeAreaLevel2: s.administrativeAreaLevel2,
          country: s.country,
          formatted_address: s.formatted_addressç,
          place_id: s.place_id,
          latitude: s.latitude,
          longitude: s.longitude
        },
        email: s.email
      }
    }
    return department
  }

  @autobind
  async onSubmitInsert() {
    try {
      var department = this.setDepartment()
      await this.props.createDepartment({ department: department })
      this.onSuccessInsert()
    } catch (error) {
      this.props.showMessage('Ocurrió un error al registrar el departamento')
    }
  }

  @autobind
  async onSubmitUpdate() {
    try {
      var department = this.setDepartment()
      await this.props.updateDepartment({ department: department })
      this.onSuccessUpdate()
    } catch (error) {
      this.props.showMessage('Ocurrió un error al editar el departamento')
      console.log('Error creating department:', error)
    }
  }

  onSuccessDelete() {
    this.props.showMessage('Departamento eliminado correctamente')
    this.props.history.push(`/directorio/departamentos/`)
  }

  @autobind
  async onDelete() {
    try {
      var department = this.setDepartment()
      await this.props.deleteDepartment({ _id: department._id })
      this.onSuccessDelete()
    } catch (error) {
      this.props.showMessage('Ocurrió un error al eliminar el departamento')
      console.log(error)
    }
  }

  handleChangeAddress = contactInformationAddress => {
    this.setState({
      streetName: contactInformationAddress.streetName,
      administrativeAreaLevel1: contactInformationAddress.administrativeAreaLevel1,
      administrativeAreaLevel2: contactInformationAddress.administrativeAreaLevel2,
      city: contactInformationAddress.city,
      departmentNumber: contactInformationAddress.departmentNumber,
      postalCode: contactInformationAddress.postalCode,
      streetNumber: contactInformationAddress.streetNumber,
      country: contactInformationAddress.country,
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
  }

  async validateForm() {
    await this.toggleValidating(true)
    const { hasNameError, hasEmailCodeError } = this.state

    if (!hasNameError && !hasEmailCodeError) {
      this.props.showMessage('Campos validados correctamente')
      this.onSubmitInsert()
    } else {
      this.props.showMessage('Verifique que todos los datos estén correctos')
    }
  }

  async validateFormUpdate() {
    await this.toggleValidating(true)
    const { hasNameError, hasEmailCodeError } = this.state
    if (!hasNameError && !hasEmailCodeError) {
      this.props.showMessage('Campos validados correctamente')
      this.onSuccessUpdate()
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
      Number,
      validate,
      contactInformationPhoneAreaCode,
      departmentNumber,
      PhoneMobile,
      email,
      country,
      description,
      imageUrl,
      address,
      businessHours,
      streetName,
      streetNumber,
      city,
      administrativeAreaLevel2,
      administrativeAreaLevel1,
      postalCode
    } = this.state
    return (
      <Section title={this.props.title} description={this.props.description} top>
        <div className={styles.fieldGroup}>
          <div className={styles.label}>Nombre</div>
          <Textbox
            tabIndex='1'
            id={'Name'}
            name={'Name'}
            maxLength='300'
            type='text'
            value={name}
            validate={validate}
            validationCallback={res => {
              console.log(res)
              this.setState({ hasNameError: res, validate: false })
            }}
            onChange={(name, e) => {
              this.setState({ name })
            }}
            validationOption={{ name: 'Nombre', check: true, required: true }}
          />
          <div className={styles.label}>
            Texto que aparecerá en campos para seleccionar departamentos
          </div>
          <Textbox
            tabIndex='2'
            id={'optionLabel'}
            name='optionLabel'
            type='text'
            maxLength='600'
            value={optionLabel}
            placeholder=''
            onChange={(optionLabel, e) => {
              this.setState({ optionLabel })
            }}
            validationOption={{ name: 'optionLabel', check: false, required: false }}
          />
          <div className={styles.label}>Director(a) de este departamento</div>
          <Select
            tabIndex='3'
            id={'managerId'}
            name={'managerId'}
            value={managerId}
            optionList={this.state.officialsArray}
            onChange={(managerId, e) => {
              this.setState({ managerId })
            }}
            customStyleOptionListContainer={{
              maxHeight: '200px',
              overflow: 'auto',
              fontSize: '14px'
            }}
            validationOption={{
              name: 'Director',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>Area de servicio a la que pertenece este departamento</div>
          <Select
            tabIndex='4'
            id={'serviceAreaId'}
            name={'serviceAreaId'}
            value={serviceAreaId}
            optionList={this.state.serviceAreasArray} // Required.[Array of Object(s)].Default: [].
            onChange={(serviceAreaId, e) => {
              this.setState({ serviceAreaId })
            }}
            customStyleOptionListContainer={{
              maxHeight: '200px',
              overflow: 'auto',
              fontSize: '14px'
            }}
            validationOption={{
              name: 'Area de servicio',
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
          <SearchBar handleChangeAddress={this.handleChangeAddress} />
          <div className={styles.label}>Calle</div>
          <Textbox
            tabIndex='5'
            id='streetName'
            name='streetName'
            type='text'
            value={streetName}
            disabled={false}
            maxLength='300'
            onChange={(streetName, e) => {
              this.setState({ streetName })
            }}
            validationOption={{
              name: 'Calle',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>Numero</div>
          <Textbox
            tabIndex='6'
            id='streetNumber'
            name='streetNumber'
            type='text'
            value={streetNumber}
            maxLength='30'
            onChange={(streetNumber, e) => {
              this.setState({ streetNumber })
            }}
            validationOption={{
              name: 'Calle',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>Numero Departamento/Otro</div>
          <Textbox
            tabIndex='7'
            id='departmentNumber'
            name='departmentNumber'
            type='text'
            value={departmentNumber}
            maxLength='30'
            validationCallback={res =>
              this.setState({
                hasdepartmentNumberCodeError: res,
                validate: false
              })
            }
            onChange={(departmentNumber, e) => {
              this.setState({ departmentNumber })
            }}
            validationOption={{
              name: 'Número de departamento',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>Ciudad</div>
          <Textbox
            tabIndex='8'
            id='city'
            name='city'
            type='text'
            value={city}
            maxLength='30'
            onChange={(city, e) => {
              this.setState({
                city: city
              })
            }}
            validationOption={{
              name: 'Número de departamento',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>Provincia</div>
          <Textbox
            tabIndex='9'
            id='administrativeAreaLevel2'
            name='administrativeAreaLevel2'
            type='text'
            value={administrativeAreaLevel2}
            maxLength='300'
            onChange={(administrativeAreaLevel2, e) => {
              this.setState({ administrativeAreaLevel2 })
            }}
            validationOption={{
              name: 'Provincia',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>Región</div>
          <Textbox
            tabIndex='10'
            id='administrativeAreaLevel1'
            name='administrativeAreaLevel1'
            type='text'
            value={administrativeAreaLevel1}
            maxLength='300'
            onChange={(administrativeAreaLevel1, e) => {
              this.setState({ administrativeAreaLevel1 })
            }}
            validationOption={{
              name: 'Región',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>País</div>
          <Textbox
            tabIndex='11'
            id='country'
            name='country'
            type='text'
            value={country}
            disabled={false}
            maxLength='300'
            onChange={(country, e) => {
              this.setState({ country })
            }}
            validationOption={{
              name: 'País',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>Código Postal</div>
          <Textbox
            tabIndex='12'
            id='postalCode'
            name='postalCode'
            type='text'
            value={postalCode}
            maxLength='300'
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
        <div>
          <b>TELÉFONO</b>
        </div>
        <div className={styles.fieldGroup}>
          <div className={styles.label}>Código de área</div>
          <Textbox
            tabIndex='13'
            id='areaCode'
            name='areaCode'
            type='number'
            value={contactInformationPhoneAreaCode}
            maxLength='5'
            onChange={(contactInformationPhoneAreaCode, e) => {
              this.setState({ contactInformationPhoneAreaCode })
            }}
            validationOption={{
              name: 'Código de Área',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>Número</div>
          <Textbox
            tabIndex='14'
            id='number'
            name='number'
            type='number'
            value={Number}
            maxLength='12'
            onChange={(Number, e) => {
              this.setState({ Number })
            }}
            validationOption={{
              name: 'Número de Teléfono',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>Celular</div>
          <Textbox
            tabIndex='15'
            id='PhoneMobile'
            name='PhoneMobile'
            type='number'
            value={PhoneMobile}
            disabled={false}
            maxLength='13'
            onChange={(PhoneMobile, e) => {
              this.setState({ PhoneMobile })
            }}
            validationOption={{
              name: 'Número de Celular',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>Email</div>
          <Textbox
            tabIndex='16'
            id='email'
            name='email'
            type='text'
            value={email}
            disabled={false}
            maxLength='100'
            placeholder=''
            validate={validate}
            validationCallback={res => {
              console.log(res)
              this.setState({
                hasEmailCodeError: res,
                validate: false
              })
            }}
            onChange={(email, e) => {
              this.setState({ email })
            }}
            validationOption={{
              name: 'Email',
              check: true,
              required: true,
              customFunc: email => {
                return FormatEmail(email)
              }
            }}
          />
          <div className={styles.label}>
            Horarios de atención (Ej: lunes a jueves / 08:30 a 13:30 / Viernes 08:30 a 16:30)
          </div>
          <Textbox
            tabIndex='17'
            id='businessHours'
            name='businessHours'
            type='text'
            value={businessHours}
            maxLength='300'
            onChange={(businessHours, e) => {
              this.setState({ businessHours })
            }}
          />
          <div className={styles.label}>Descripción de funciones del departamento</div>
          <Textbox
            tabIndex='18'
            id='description'
            name='description'
            type='text'
            value={description}
            maxLength='300'
            onChange={(description, e) => {
              this.setState({ description })
            }}
            validationOption={{
              name: 'Descripción de funciones del departamento',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>Imagen del edificio donde se encuentra el departamento</div>
          <Textbox
            tabIndex='19'
            id='imageUrl'
            name='imageUrl'
            type='text'
            value={imageUrl}
            maxLength='300'
            onChange={(imageUrl, e) => {
              this.setState({ imageUrl })
            }}
            validationOption={{
              name: 'Imagen del edificio',
              check: false,
              required: false
            }}
          />
          <div className={styles.label}>Dirección del departamento de tránsito</div>
          <Textbox
            tabIndex='20'
            id='address'
            name='address'
            type='text'
            value={address}
            maxLength='300'
            onChange={(address, e) => {
              this.setState({ address })
            }}
            validationOption={{
              name: 'Dirección del departamento',
              check: false,
              required: false
            }}
          />
        </div>
        <div className='os_button_container padding'>
          <button style={{ marginRight: 10 }} className='orion_button '>
            Volver
          </button>
          {this.props.type === 'update' && (
            <button
              style={{ marginRight: 10 }}
              onClick={this.Delete}
              className='orion_button orion_danger'
            >
              Eliminar Departamento
            </button>
          )}
          {this.props.type === 'update' && (
            <button
              style={{ marginRight: 10 }}
              onClick={this.validateFormUpdate}
              className='orion_button orion_primary'
            >
              Actualizar Departamento
            </button>
          )}
          {this.props.type === 'create' && (
            <button onClick={this.validateForm} className='orion_button orion_primary'>
              Crear Departamento
            </button>
          )}
        </div>
      </Section>
    )
  }
}
export default TemplateDepartment
