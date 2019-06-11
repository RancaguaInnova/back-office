import React, { Component } from 'react'
import Section from 'App/components/Section'
import SearchBar from 'App/components/fields/GooglePlaces'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import Popup from 'reactjs-popup'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
import reduce from 'lodash/reduce'
import { Textbox } from 'react-inputs-validation'
import './style.css'
import EventFragments from 'App/fragments/Event'
import { confirmAlert } from 'react-confirm-alert'
import moment from 'moment'
import firebase from '/src/App/helpers/auth/firebaseConfig'
import formatMail from 'App/helpers/format/formatMail'
import horaValida from 'App/helpers/format/horaValida'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import FileUploader from 'react-firebase-file-uploader'
import { Editor } from 'primereact/editor'
import Es from '../../../../../i18n/calendarEs'
import { Checkbox } from 'primereact/checkbox'
import { Chips } from 'primereact/chips'
@withRouter
@withMessage
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
export default class TemplateEvent extends Component {
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
    let event = this.props.event

    if (this.props.type === 'update') {
      if (event.address === null) {
        event.address = {
          streetName: '',
          streetNumber: '',
          departmentNumber: '',
          city: '',
          postalCode: ''
        }
      }

      let time = new Date()
      if (event.time !== null && horaValida(event.time)) {
        let aux = event.time.split(':')
        time.setHours(aux[0], aux[1])
      } else {
        time = null
      }

      let endTime = new Date()
      if (event.endTime !== null && horaValida(event.endTime)) {
        let aux2 = event.endTime.split(':')
        endTime.setHours(aux2[0], aux2[1])
      } else {
        endTime = null
      }
      let eventTags = this.formatBackTags(event.tags)
      let validators = event.validators

      this.state = {
        visible: false,
        detail: event.detail || '',
        place: event.place || '',
        _id: event._id,
        firebaseIdEvent: event.firebaseIdEvent,
        name: event.name || '',
        description: event.description || '',
        date: new Date(event.date),
        time: time || '',
        endTime: endTime || '',
        streetName: event.address.streetName || '',
        streetNumber: event.address.streetNumber || '',
        departmentNumber: event.address.departmentNumber || '',
        city: event.address.city || '',
        postalCode: event.address.postalCode || '',
        administrativeAreaLevel1: event.address.administrativeAreaLevel1,
        administrativeAreaLevel2: event.address.administrativeAreaLevel2,
        country: event.address.country,
        formattedAddress: event.address.formatted_address || '',
        place_id: event.address.place_id || '',
        latitude: event.address.latitude || -34.1703131,
        longitude: event.address.longitude || -70.74064759999999,
        optionLabel: event.optionLabel || '',
        departmentId: event.departmentId || '',
        externalUrl: event.externalUrl || '',
        imageUrl: event.imageUrl || '',
        showInCalendarChecked: event.showInCalendar || '',
        locations: event.locations || [],
        loading: true,
        validate: false,
        validatePop: false,
        campoName: '',
        campoQuota: 0,
        hasQuotaCodeError: true,
        hasCampoNameError: true,

        tags: eventTags || [],
        isOpen: false,
        validators: validators || []
      }
    } else {
      this.state = {
        visible: false,
        place: '',
        name: '',
        description: '',
        detail: '',
        externalUrl: '',
        event: {},
        errorMessages: {},
        date: new Date(),
        time: new Date(),
        locations: [],
        campoID: '',
        validate: false,
        validatePop: false,
        campoName: '',
        campoQuota: 0,
        hasQuotaCodeError: true,
        hasCampoNameError: true,

        latitude: -34.1703131,
        longitude: -70.74064759999999,
        loading: true,
        tags: [],
        uploadImageUrl: '',
        isUploading: false,
        progress: 0,
        imageUrl: '',
        isOpen: false,
        validators: []
      }
    }
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleChangeTime = this.handleChangeTime.bind(this)
    this.handleChangeEndTime = this.handleChangeEndTime.bind(this)
    this.handleAdditionValidator = this.handleAdditionValidator.bind(this)
    this.onSuccessUpdate = this.onSuccessUpdate.bind(this)
  }

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 })
  handleProgress = progress => this.setState({ progress })
  handleUploadError = () => {
    this.setState({ isUploading: false })
  }
  handleUploadSuccess = filename => {
    this.setState({ uploadImageUrl: filename, progress: 100, isUploading: false })
    firebase
      .storage()
      .ref('EventImages')
      .child(filename)
      .getDownloadURL()
      .then(url => {
        this.setState({ imageUrl: url })
      })
  }

  handleAdditionValidator(e) {
    var ultimo = e.value[e.value.length - 1]
    let res = formatMail(ultimo)
    if (res === true || e.value.length === 0) {
      this.setState({ validators: e.value })
    } else {
      this.props.showMessage(res)
    }
  }

  formatApiTag(arrayTags) {
    let a = arrayTags || []
    if (a.length === 0) {
      return []
    } else {
      let ar = a.map(function(obj) {
        var rObj = {}
        rObj['tag'] = obj || ''

        return rObj
      })
      return ar
    }
  }
  formatBackTags(arrayTags) {
    let a = arrayTags || []
    if (a.length === 0) {
      return []
    } else {
      let ar = a.map(function(obj) {
        var rObj = {}
        rObj = obj.tag || ''

        return rObj
      })
      return ar
    }
  }

  getDepartmentOptions() {
    const Departaments = this.props.departments.items.map(department => {
      return { label: department.name, value: department._id }
    })

    return Departaments
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
    let locations = this.state.locations
    locations = this.arrayRemove(locations, e)
    this.setState({ locations })
  }

  arrayRemove(arr, value) {
    return arr.filter(function(ele) {
      return ele !== value
    })
  }

  handleChangeDate(date) {
    this.setState({
      date: date
    })
  }

  handleChangeTime(time) {
    this.setState({
      time: time
    })
  }

  handleChangeEndTime(endTime) {
    this.setState({
      endTime: endTime
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

  onSuccessDelete() {
    this.props.showMessage('Evento eliminado correctamente')
    this.props.history.push('/calendario/eventos')
  }
  goBack() {
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
      firebaseIdEvent: s.firebaseIdEvent,
      name: s.name,
      description: s.description,
      detail: s.detail,
      date: s.date,
      time: moment(s.time).format('HH:mm'),
      endTime: moment(s.endTime).format('HH:mm'),
      address: {
        streetName: s.streetName,
        streetNumber: s.streetNumber,
        departmentNumber: s.departmentNumber,
        city: s.city,
        postalCode: s.postalCode,
        administrativeAreaLevel1: s.administrativeAreaLevel1,
        administrativeAreaLevel2: s.administrativeAreaLevel2,
        country: s.country,
        formatted_address: s.formattedAddress,
        place_id: s.place_id,
        latitude: s.latitude,
        longitude: s.longitude
      },
      place: s.place,
      optionLabel: s.optionLabel,
      departmentId: s.departmentId,
      externalUrl: s.externalUrl,
      imageUrl: s.imageUrl,
      showInCalendar: s.showInCalendarChecked,
      tags: this.formatApiTag(s.tags),

      locations: s.locations,
      validators: s.validators
    }
    return event
  }

  onSuccessInsert() {
    this.props.showMessage('Evento creado')
    this.props.history.push('/calendario/eventos')
  }

  onSuccessUpdate() {
    this.props.showMessage(
      'El evento fue registrado correctamente , sera redireccionado al home de eventos'
    )
    this.props.history.push('/calendario/eventos')
  }
  @autobind
  infoButton() {
    let res = ''
    if (this.state.locations.length < 1) {
      res = 'Agregar  ticket al evento'
    } else {
      res = 'Editar  ticket del evento'
    }
    return res
  }

  @autobind
  async handleSubmit(event) {
    event.preventDefault()
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
        await this.props.updateEvent({ event: event })
        this.onSuccessUpdate()
      } catch (error) {
        this.setState({ errorMessages: this.getValidationErrors(error) })

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
      formattedAddress: contactInformationAddress.formatted_address || '',
      place_id: contactInformationAddress.place_id || '',
      latitude: contactInformationAddress.latitude || '',
      longitude: contactInformationAddress.longitude || ''
    })
    this.setState(newState)
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    })
  }

  handleDateChangeRaw = e => {
    e.preventDefault()
  }
  handleShowDialog = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }
  HanddleCleanImageUrl = () => {
    this.setState({ imageUrl: '', uploadImageUrl: '' })
  }

  customChip(item) {
    return (
      <div>
        <span>{item} </span>
        <i className='pi pi-user-plus' />
      </div>
    )
  }

  render() {
    const {
      campoName,
      validatePop,
      campoQuota,
      formattedAddress,
      latitude,
      longitude,
      validators
    } = this.state
    var _this = this
    return (
      <div>
        <div className='alert alert-info uppercase' role='alert'>
          <i className='pi pi-info information ' />
          Si necesitas ayuda para crear o editar un evento haz &nbsp;
          <a
            href='https://desarrollorancagua.atlassian.net/wiki/x/AgAYAg'
            target='_blank'
            className='alert-link'
            rel='noopener noreferrer'
          >
            click aquí
          </a>
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <Section title={this.props.title} description={this.props.description} top>
              <div className='label'>Nombre</div>
              <InputText
                value={this.state.name}
                onChange={e => {
                  this.setState({ name: e.target.value })
                }}
                className='p-inputtext'
                required={true}
                tabIndex={1}
                maxLength={80}
              />
              <div className='label'>Descripción</div>
              <InputText
                value={this.state.description}
                onChange={e => {
                  this.setState({ description: e.target.value })
                }}
                className='p-inputtext'
                maxLength={140}
                tabIndex={2}
              />
              <div className='label'>Link a información</div>
              <InputText
                value={this.state.externalUrl}
                onChange={e => {
                  this.setState({ externalUrl: e.target.value })
                }}
                className='p-inputtext'
                tabIndex={3}
              />
              <div className='label'>Fecha</div>
              <Calendar
                locale={Es}
                dateFormat='dd-mm-yy'
                value={this.state.date}
                onChange={e => this.setState({ date: e.value })}
              />
              <div className='label'>Hora de inicio</div>
              <Calendar
                required={true}
                timeOnly={true}
                showTime={true}
                hourFormat='24'
                value={this.state.time}
                onChange={e => this.setState({ time: e.value })}
              />
              <div className='label'>Hora de término</div>
              <Calendar
                required={false}
                timeOnly={true}
                showTime={true}
                hourFormat='24'
                value={this.state.endTime}
                onChange={e => this.setState({ endTime: e.value })}
              />
              <div className='label'>Dirección </div>
              <SearchBar
                handleChangeAddress={this.handleChangeAddress}
                latitude={latitude}
                longitude={longitude}
                address={formattedAddress}
              />
              <div className='label'>Lugar</div>
              <InputText
                value={this.state.place}
                onChange={e => {
                  this.setState({ place: e.target.value })
                }}
                className='p-inputtext'
                required={false}
              />
              <div className='label'>Calle</div>
              <InputText
                value={this.state.streetName}
                onChange={e => {
                  this.setState({ streetName: e.target.value })
                }}
                className='p-inputtext'
                required={false}
              />
              <div className='label'>Número</div>
              <InputText
                value={this.state.streetNumber}
                onChange={e => {
                  this.setState({ streetNumber: e.target.value })
                }}
                className='p-inputtext'
                required={false}
              />
              <div className='label'>Departamento</div>
              <InputText
                value={this.state.departmentNumber}
                onChange={e => {
                  this.setState({ departmentNumber: e.target.value })
                }}
                className='p-inputtext'
                required={false}
              />
              <div className='label'>Ciudad</div>
              <InputText
                value={this.state.city}
                onChange={e => {
                  this.setState({ city: e.target.value })
                }}
                className='p-inputtext'
                required={false}
              />

              <div className='label hidden'>
                Texto que aparecerá en campos para seleccionar un evento
              </div>
              <InputText
                type='hidden'
                value={this.state.optionLabel}
                onChange={e => {
                  this.setState({ optionLabel: e.target.value })
                }}
                className='p-inputtext'
                tabIndex={6}
              />
              <div className='label'>Url con imagen para el evento</div>
              <div className='os-input-container'>
                <InputText
                  type='url'
                  value={this.state.imageUrl}
                  onChange={e => {
                    this.setState({ imageUrl: e.target.value })
                  }}
                  className='p-inputtext'
                  tabIndex={7}
                />

                {this.state.imageUrl && (
                  <button className='clear-button' onClick={this.HanddleCleanImageUrl}>
                    <i className='pi pi-times size3' />
                  </button>
                )}
              </div>

              <div className='UploadImage'>
                {this.state.isUploading && <p>Subiendo... {this.state.progress}</p>}
                {this.state.imageUrl && (
                  <div>
                    Vista previa
                    <img
                      src={this.state.imageUrl}
                      onClick={this.handleShowDialog}
                      className='small'
                    />
                  </div>
                )}
                {this.state.isOpen && (
                  <dialog
                    className='dialog shadow-lg p-3 mb-5 bg-white rounded'
                    style={{ position: 'absolute' }}
                    open
                    onClick={this.handleShowDialog}
                  >
                    <img
                      className='image'
                      src={this.state.imageUrl}
                      onClick={this.handleShowDialog}
                      alt='no image'
                    />
                  </dialog>
                )}

                <span className='p-button p-fileupload-choose p-component p-button-text-icon-left p-button-success'>
                  <span className='p-button-icon-left pi pi-plus' />
                  <span className='p-button-text p-clickable'>Seleccionar Imagen</span>
                  <FileUploader
                    accept='image/*'
                    name='uploadImageUrl'
                    className='p-inputtext p-component p-inputtext p-filled'
                    randomizeFilename
                    storageRef={firebase.storage().ref('EventImages')}
                    onUploadStart={this.handleUploadStart}
                    onUploadError={this.handleUploadError}
                    onUploadSuccess={this.handleUploadSuccess}
                    onProgress={this.handleProgress}
                  />
                </span>
              </div>
              <div className='label'> </div>
              <Checkbox
                onChange={e => this.setState({ showInCalendar: e.checked })}
                checked={this.state.showInCalendar}
                tabIndex='8'
              />
              <label htmlFor='showInCalendar' className='p-checkbox-label'>
                Mostrar en calendario (publicar evento)
              </label>
              <div className='label'>Departamento al que pertenece el evento</div>
              <Dropdown
                value={this.state.departmentId}
                options={this.getDepartmentOptions()}
                onChange={e => this.setState({ departmentId: e.target.value })}
                editable={false}
                placeholder='Seleccione un departamento'
              />

              <div>
                <Popup
                  modal
                  trigger={
                    <Button
                      type='button'
                      className='p-button-success'
                      label={this.infoButton()}
                      style={{ marginTop: 20 }}
                    />
                  }
                >
                  {close => (
                    <div className='ModalEvent'>
                      <a className='close' onClick={close}>
                        &times;
                      </a>
                      <div className='headerModal'> Información de ticket </div>
                      <div className='label'>Detalle del evento</div>
                      <div>
                        <Editor
                          style={{ height: '100px' }}
                          value={this.state.detail}
                          onTextChange={e => this.setState({ detail: e.htmlValue })}
                        />
                      </div>
                      <div className='label'>Tags</div>

                      <div>
                        <Chips
                          value={this.state.tags}
                          onChange={e => {
                            this.setState({ tags: e.value })
                          }}
                          tooltip='Para agregar un nuevo tag debe ingresar el valor  y dar enter'
                        />
                      </div>
                      <br />
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
                                  tabIndex='10'
                                  id='campoName'
                                  name='campoName'
                                  type='text'
                                  value={campoName}
                                  classNameInput='campoName'
                                  maxLength='50'
                                  validate={validatePop}
                                  validationCallback={res => {
                                    this.setState({
                                      hasCampoNameError: res,
                                      validatePop: false
                                    })
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
                                  tabIndex='11'
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
                                <Button onClick={this.addLocation} className='button' label='+' />
                              </td>
                            </tr>

                            {this.state.locations.map(function(item, index) {
                              return (
                                <tr key={index}>
                                  <td className='col2'>{item.name}</td>
                                  <td className='col3'>{item.quota}</td>
                                  <td className='col4'>
                                    <Button
                                      className='button'
                                      label='-'
                                      onClick={() => {
                                        _this.removeLocation(item)
                                      }}
                                    />
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className='label'>Usuarios validadores del evento *(Indique mail)</div>
                      <div>
                        <Chips
                          value={validators}
                          placeholder='Agregar email'
                          onChange={this.handleAdditionValidator}
                          tooltip='Para agregar un nuevo validador debe ingresar el email  y dar enter'
                        />
                      </div>
                      <div className='actions'>
                        <Button
                          className='p-button-secondary'
                          label='Cerrar'
                          style={{ marginRight: 10 }}
                          onClick={() => {
                            close()
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Popup>
              </div>
              <br />
              <Button
                onClick={() => this.goBack()}
                style={{ marginRight: 10 }}
                label='Cancelar'
                className='p-button-secondary'
                type='button'
              />
              {this.props.type === 'create' && (
                <Button label='Crear Evento' style={{ marginRight: 10 }} type='submit' />
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
          </form>
        </div>
      </div>
    )
  }
}
