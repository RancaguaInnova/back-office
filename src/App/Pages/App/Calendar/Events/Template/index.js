import React from 'react'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import SearchBar from 'App/components/fields/GooglePlaces'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
import reduce from 'lodash/reduce'
import Popup from 'reactjs-popup'
import { Textbox, Checkbox, Select } from 'react-inputs-validation'
import 'react-inputs-validation/lib/react-inputs-validation.min.css'
import './modal.css'
import MaterialIcon, { colorPalette } from 'material-icons-react'
import EventFragments from 'App/fragments/Event'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
@withRouter
@withMessage
@withGraphQL(gql`
  query event($eventId: ID!) {
    event(eventId: $eventId) {
      ...FullEvent
    }
    departments {
      _id
      items {
        _id
        name
      }
    }
  }
  ${EventFragments.FullEvent}
`)
@withMutation(gql`
  mutation createEvent($event: EventInput!) {
    createEvent(event: $event) {
      _id
    }
  }
`)
@withMutation(gql`
  mutation updateEvent($event: EventInput!) {
    updateEvent(event: $event) {
      ...FullEvent
    }
  }
  ${EventFragments.FullEvent}
`)
@withMutation(gql`
  mutation deleteEvent($_id: ID!) {
    deleteEvent(_id: $_id)
  }
`)
export default class TemplateEvent extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    departments: PropTypes.object,
    event: PropTypes.object,
    deleteEvent: PropTypes.func,
    createEvent: PropTypes.func,
    updateEvent: PropTypes.func,
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.state = {
      event: {},
      errorMessages: {},
      location: [],
      campoID: '',
      validate: false,
      validatePop: false,
      campoName: '',
      campoQuota: 0,
      hasQuotaCodeError: true,
      hasCampoNameError: true,
      hasNameError: true,
      hasNombreError: true,
      hasDescriptionError: true,
      hasDateError: true,
      hasStartHourError: true,
      hasEndHourError: true,
      hasDepartmentIdError: true
    }
    this.validateForm = this.validateForm.bind(this)
  }

  getDepartmentOptions() {
    return this.props.departments.items.map(department => {
      return { name: department.name, id: department._id }
    })
  }

  getValidationErrors(error) {
    return reduce(
      error.graphQLErrors,
      (result, e, k) => {
        return e.validationErrors
      },
      {}
    )
  }

  renderErrorMessages() {
    if (!this.state.errorMessages) return
    console.log('UNIMPLEMENTED')
  }
  toggleValidating(validate) {
    this.setState({ validate })
  }
  toggleValidatingPop(validatePop) {
    this.setState({ validatePop })
  }

  @autobind
  removeLocation(e) {
    console.log(e)
    let locations = this.state.locations
    console.log(locations)
    locations = this.arrayRemove(locations, e)
    console.log(locations)
    this.setState({ locations })
  }

  arrayRemove(arr, value) {
    return arr.filter(function(ele) {
      return ele !== value
    })
  }

  @autobind
  async addLocation(e) {
    e.preventDefault()
    await this.toggleValidatingPop(true)
    const { hasCampoNameError, hasQuotaCodeError } = this.state
    if (!hasCampoNameError && !hasQuotaCodeError) {
      let newLocation = {
        name: this.state.campoName,
        quota: this.state.campoQuota
      }
      let locations = this.state.locations
      locations.push(newLocation)
      this.setState({
        locations: locations,
        campoName: '',
        campoQuota: ''
      })
    } else {
      this.props.showMessage('Verifique que todos los datos estén correctos')
    }
  }

  componentDidMount() {
    if (this.props.type === 'update') {
      let event = this.props.event
      if (event.date === null) {
        event.date = {
          dateStr: '',
          startHour: '',
          endHour: '',
          date: ''
        }
      }
      if (event.address === null) {
        event.address = {
          streetName: '',
          streetNumber: '',
          departmentNumber: '',
          city: '',
          postalCode: ''
        }
      }
      console.log(event)
      this.setState({
        _id: event._id,
        name: event.name || '',
        description: event.description || '',
        date: event.date.dateStr || '',
        startHour: event.date.startHour || '',
        endHour: event.date.endHour || '',
        dateStr: event.date.dateStr || '',
        streetName: event.address.streetName || '',
        streetNumber: event.address.streetNumber || '',
        departmentNumber: event.address.departmentNumber || '',
        city: event.address.city || '',
        postalCode: event.address.postalCode || '',
        optionLabel: event.optionLabel || '',
        departmentId: event.departmentId || '',
        externalUrl: event.externalUrl || '',
        imageUrl: event.imageUrl || '',
        showInCalendarChecked: event.showInCalendar || '',
        locations: event.locations || []
      })
    }
  }

  async validateForm(e) {
    await this.toggleValidating(true)
    const {
      hasNombreError,
      hasDescriptionError,
      hasDateError,
      hasStartHourError,
      hasEndHourError,
      hasDepartmentIdError
    } = this.state
    if (
      !hasNombreError &&
      !hasDescriptionError &&
      !hasDateError &&
      !hasStartHourError &&
      !hasEndHourError &&
      !hasDepartmentIdError
    ) {
      this.onSubmit()
    } else {
      this.props.showMessage('Verifique que todos los datos estén correctos')
    }
  }
  onSuccessDelete() {
    this.props.showMessage('Evento eliminado correctamente')
    this.props.history.push('/calendario/eventos')
  }
  @autobind
  async onDelete() {
    try {
      let event = this.getEvent()
      await this.props.deleteEvent({ _id: event._id })
      this.onSuccessDelete()
    } catch (error) {
      this.props.showMessage('Ocurrió un error al eliminar el departamento')
    }
  }

  @autobind
  confirmDelete() {
    confirmAlert({
      title: 'Confirmar acción',
      message: '¿Eliminar este evento?',
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

  getEvent() {
    let s = this.state
    var event = {
      _id: s._id,
      name: s.name,
      description: s.description,
      date: {
        date: s.date,
        startHour: s.startHour,
        endHour: s.endHour,
        dateStr: s.date
      },
      address: {
        streetName: s.streetName,
        streetNumber: s.streetNumber,
        departmentNumber: s.departmentNumber,
        city: s.city,
        postalCode: s.postalCode
      },
      optionLabel: s.optionLabel,
      departmentId: s.departmentId,
      externalUrl: s.externalUrl,
      imageUrl: s.imageUrl,
      showInCalendar: s.showInCalendarChecked,
      tags: {
        tag: s.tags
      },
      locations: s.locations
    }
    return event
  }
  onSuccessInsert() {
    this.props.showMessage('Evento creado')
    this.props.history.push('/calendario/eventos')
  }
  onSuccessUpdate() {
    this.props.showMessage('Cambios guardados!')
    this.props.history.push('/calendario/eventos')
  }
  @autobind
  async onSubmit() {
    if (this.props.type === 'create') {
      try {
        let event = this.getEvent()

        await this.props.createEvent({ event: event })

        this.onSuccessInsert()
      } catch (error) {
        this.setState({ errorMessages: this.getValidationErrors(error) })
        this.props.showMessage('Ocurrión un error!')
      }
    } else {
      try {
        let event = this.getEvent()
        console.log(event)
        await this.props.updateEvent({ event: event })
        this.onSuccessUpdate()
      } catch (error) {
        this.props.showMessage('Ocurrión un error!')
      }
    }
  }

  @autobind
  handleChangeAddress(contactInformationAddress) {
    let newState = Object.assign(this.state, {
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
    this.setState(newState)
  }

  render() {
    const {
      campoName,
      validatePop,
      campoQuota,
      validate,
      name,
      description,
      externalUrl,
      date,
      startHour,
      endHour,
      optionLabel,
      showInCalendar,
      showInCalendarChecked,
      departmentId
    } = this.state
    var _this = this

    return (
      <Section title={this.props.title} description={this.props.description} top>
        <div className='label'>Nombre</div>
        <Textbox
          tabIndex='1'
          id='name'
          name='name'
          type='text'
          value={name}
          classNameInput='name'
          maxLength='500'
          validate={validate}
          validationCallback={res => {
            this.setState({ hasNombreError: res, validate: false })
          }}
          onChange={(name, e) => {
            this.setState({ name })
          }}
          validationOption={{
            name: 'Nombre',
            check: true,
            required: true
          }}
        />
        <div className='label'>Descripción</div>
        <Textbox
          tabIndex='2'
          id='description'
          name='description'
          type='text'
          value={description}
          maxLength='2500'
          validate={validate}
          validationCallback={res => {
            this.setState({ hasDescriptionError: res, validate: false })
          }}
          onChange={(description, e) => {
            this.setState({ description })
          }}
          validationOption={{
            name: 'Descripción',
            check: true,
            required: true
          }}
        />
        <div className='label'>Link a información</div>
        <Textbox
          tabIndex='3'
          id='externalUrl'
          name='externalUrl'
          type='text'
          value={externalUrl}
          maxLength='2500'
          validate={validate}
          onChange={(externalUrl, e) => {
            this.setState({ externalUrl })
          }}
          validationOption={{
            name: 'Link a información',
            check: false,
            required: false
          }}
        />
        <div className='label'>Fecha</div>
        <Textbox
          tabIndex='3'
          id='date'
          name='date'
          type='date'
          value={date}
          maxLength='2500'
          validate={validate}
          classNameInput='os-input-text'
          validationCallback={res => {
            this.setState({ hasDateError: res, validate: false })
          }}
          onChange={(date, e) => {
            this.setState({ date })
          }}
          validationOption={{
            name: 'Fecha',
            check: true,
            required: true
          }}
        />
        <div className='label'>Hora de inicio</div>
        <Textbox
          tabIndex='4'
          id='startHour'
          name='startHour'
          type='time'
          value={startHour}
          maxLength='10'
          validate={validate}
          classNameInput='os-input-text'
          validationCallback={res => {
            this.setState({ hasStartHourError: res, validate: false })
          }}
          onChange={(startHour, e) => {
            this.setState({ startHour })
          }}
          validationOption={{
            name: 'Hora de inicio',
            check: true,
            required: true
          }}
        />
        <div className='label'>Hora de término</div>
        <Textbox
          tabIndex='5'
          id='endHour'
          name='endHour'
          type='time'
          value={endHour}
          maxLength='10'
          validate={validate}
          classNameInput='os-input-text'
          validationCallback={res => {
            this.setState({ hasEndHourError: res, validate: false })
          }}
          onChange={(endHour, e) => {
            this.setState({ endHour })
          }}
          validationOption={{
            name: 'Hora de término',
            check: true,
            required: true
          }}
        />
        <div className='label'>Dirección</div>
        <SearchBar
          handleChangeAddress={this.handleChangeAddress}
          latitude={-34.1703131}
          longitude={-70.74064759999999}
        />
        <div className='label'>Texto que aparecerá en campos para seleccionar un evento</div>
        <Textbox
          tabIndex='6'
          id='optionLabel'
          name='optionLabel'
          type='text'
          value={optionLabel}
          maxLength='200'
          validate={validate}
          classNameInput='os-input-text'
          validationCallback={res => {
            this.setState({ hasOptionLabelError: res, validate: false })
          }}
          onChange={(optionLabel, e) => {
            this.setState({ optionLabel })
          }}
          validationOption={{
            name: 'Texto que aparecerá en campos para seleccionar un evento',
            check: true,
            required: true
          }}
        />
        <Checkbox
          tabIndex='7'
          id={'showInCalendar'}
          name={'showInCalendar'}
          value={showInCalendar}
          checked={showInCalendarChecked}
          disabled={false}
          validate={validate}
          onChange={(showInCalendarChecked, e) => {
            this.setState({ showInCalendarChecked })
          }}
          labelHtml={
            <div style={{ color: '#4a4a4a', marginTop: '2px' }}>
              Mostrar en calendario (publicar evento)
            </div>
          }
          validationOption={{
            name: 'agreement',
            check: false,
            required: false
          }}
        />

        <div className='label'>Departamento al que pertenece el evento</div>
        <Select
          tabIndex='3'
          id={'departmentId'}
          name={'departmentId'}
          value={departmentId}
          validate={validate}
          optionList={this.getDepartmentOptions()}
          validationCallback={res => {
            this.setState({
              hasDepartmentIdError: res,
              validate: false
            })
          }}
          onChange={(departmentId, e) => {
            this.setState({ departmentId })
          }}
          customStyleOptionListContainer={{
            maxHeight: '200px',
            overflow: 'auto',
            fontSize: '14px'
          }}
          validationOption={{
            name: 'Departamento',
            check: true,
            required: true
          }}
        />
        <div>
          <Popup trigger={<button className='button'> Agregar ticket al evento </button>} modal>
            {close => (
              <div className='modal'>
                <a className='close' onClick={close}>
                  &times;
                </a>
                <div className='headerModal'> Información de ticket </div>
                <div className='contentModal'>
                  <table className='tableModal'>
                    <thead>
                      <tr>
                        <td className='Headcol2'>Nombre de la ubicación</td>
                        <td className='Headcol3'>Nº de tickets</td>
                        <td className='Headcol4'> </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className='col2'>
                          <Textbox
                            tabIndex='1'
                            id='campoName'
                            name='campoName'
                            type='text'
                            value={campoName}
                            classNameInput='campoName'
                            maxLength='50'
                            validate={validatePop}
                            validationCallback={res => {
                              this.setState({ hasCampoNameError: res, validatePop: false })
                            }}
                            onChange={(campoName, e) => {
                              this.setState({ campoName })
                            }}
                            validationOption={{
                              name: 'Nombre de la ubicación',
                              check: true,
                              required: true
                            }}
                          />
                        </td>
                        <td className='col3'>
                          <Textbox
                            tabIndex='1'
                            id='campoQuota'
                            name='campoQuota'
                            type='text'
                            value={campoQuota}
                            classNameInput='campoQuota'
                            validate={validatePop}
                            validationCallback={res => {
                              this.setState({
                                hasQuotaCodeError: res,
                                validatePop: false
                              })
                            }}
                            maxLength='6'
                            onChange={(campoQuota, e) => {
                              this.setState({ campoQuota })
                            }}
                            validationOption={{
                              name: 'Nº de tickets disponibles',
                              check: true,
                              required: true,
                              min: 1,
                              max: 100000,
                              type: 'number'
                            }}
                          />
                        </td>
                        <td className='col4'>
                          <button onClick={this.addLocation} className='button'>
                            <MaterialIcon icon='add' size='tiny' color={colorPalette.blue._800} />
                          </button>
                        </td>
                      </tr>
                      {this.state.locations.map(function(item, index) {
                        return (
                          <tr key={index}>
                            <td className='col2'>{item.name}</td>
                            <td className='col3'>{item.quota}</td>
                            <td className='col4'>
                              <button
                                onClick={() => {
                                  _this.removeLocation(item)
                                }}
                              >
                                <MaterialIcon
                                  icon='remove'
                                  size='tiny'
                                  color={colorPalette.red._900}
                                />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <div />
                </div>
                <div className='actions'>
                  <Button
                    className='button'
                    style={{ marginRight: 10 }}
                    onClick={() => {
                      close()
                    }}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </Popup>
        </div>
        <br />
        <Button to='/calendario/eventos' style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        {this.props.type === 'create' && (
          <button
            onClick={() => this.validateForm()}
            className='orion_button orion_primary'
            style={{ marginRight: 10 }}
          >
            Crear Evento
          </button>
        )}
        {this.props.type === 'update' && (
          <button
            onClick={() => this.validateForm()}
            className='orion_button orion_primary'
            style={{ marginRight: 10 }}
          >
            Guardar
          </button>
        )}
        {this.props.type === 'update' && (
          <button
            style={{ marginRight: 10 }}
            onClick={() => this.confirmDelete()}
            className='orion_button orion_danger'
          >
            Eliminar
          </button>
        )}
      </Section>
    )
  }
}