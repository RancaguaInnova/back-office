import React, { Component } from 'react'
import Section from 'App/components/Section'
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
import './style.css'
import EventFragments from 'App/fragments/Event'
import { confirmAlert } from 'react-confirm-alert'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import moment from 'moment'
import { WithContext as ReactTags } from 'react-tag-input'
import config from '/src/App/helpers/auth/firebaseConfig'
import firebase from 'firebase'
import formatMail from 'App/helpers/format/formatMail'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import FileUploader from 'react-firebase-file-uploader'
import { Messages } from 'primereact/messages'
import { Message } from 'primereact/message'
firebase.initializeApp(config)

const KeyCodes = {
  comma: 188,
  enter: 13
}

const delimiters = [KeyCodes.comma, KeyCodes.enter]
const es = {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre'
  ],
  monthNamesShort: [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic'
  ]
}

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

      const blocksFromHtml = htmlToDraft(event.detail || '')
      const { contentBlocks, entityMap } = blocksFromHtml
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
      const editorState = EditorState.createWithContent(contentState)
      let time = new Date()
      if (event.time !== null && this.HoraValida(event.time)) {
        let aux = event.time.split(':')
        time.setHours(aux[0], aux[1])
      } else {
        time = null
      }

      let endTime = new Date()
      if (event.endTime !== null && this.HoraValida(event.endTime)) {
        let aux2 = event.endTime.split(':')
        endTime.setHours(aux2[0], aux2[1])
      } else {
        endTime = null
      }
      let eventTags = this.formatBackTags(event.tags)
      let validators = this.formatBackValidator(event.validators)
      this.state = {
        editorState: editorState,
        _id: event._id,
        firebaseIdEvent: event.firebaseIdEvent,
        name: event.name || '',
        description: event.description || '',
        date: new Date(event.date),
        time: time,
        endTime: endTime,
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
        hasNameError: true,
        hasDescriptionError: true,
        hasNombreError: true,
        hasDepartmentIdError: true,
        tags: eventTags || [],
        suggestions: [{ id: 'Noticias', text: 'Noticias' }],
        isOpen: false,
        validators: validators || []
      }
    } else {
      const blocksFromHtml = htmlToDraft('')
      const { contentBlocks, entityMap } = blocksFromHtml
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
      const editorState = EditorState.createWithContent(contentState)

      this.state = {
        editorState: editorState,
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
        hasNameError: true,
        hasDescriptionError: true,
        hasNombreError: true,
        hastimeError: true,
        hasendTimeError: true,
        hasDepartmentIdError: true,
        latitude: -34.1703131,
        longitude: -70.74064759999999,
        loading: true,
        tags: [],
        suggestions: [{ id: 'Noticias', text: 'Noticias' }],
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
    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)

    this.handleDeleteValidator = this.handleDeleteValidator.bind(this)
    this.handleAdditionValidator = this.handleAdditionValidator.bind(this)

    this.handleDrag = this.handleDrag.bind(this)
    this.validateForm = this.validateForm.bind(this)
  }

  handleDelete(i) {
    const { tags } = this.state
    this.setState({
      tags: tags.filter((tag, index) => index !== i)
    })
  }

  handleDeleteValidator(i) {
    const { validators } = this.state
    this.setState({
      validators: validators.filter((tag, index) => index !== i)
    })
  }
  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 })
  handleProgress = progress => this.setState({ progress })
  handleUploadError = error => {
    this.setState({ isUploading: false })
    console.error(error)
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

  handleAddition(tag) {
    this.setState(state => ({ tags: [...state.tags, tag] }))
  }

  handleAdditionValidator(validator) {
    let res = formatMail(validator.text)

    if (res === true) {
      this.setState(state => ({ validators: [...state.validators, validator] }))
    } else {
      this.props.showMessage(res)
    }
  }

  handleDragValidator(validator, currPos, newPos) {
    const validators = [...this.state.validators]
    const newTags = validators.slice()
    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, validator)
    this.setState({ validators: newTags })
  }

  formatApiTags(arrayTags) {
    let a = arrayTags || []
    if (a.length === 0) {
      return []
    } else {
      let ar = a.map(function(obj) {
        var rObj = {}
        rObj['tag'] = obj.text || ''

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
        rObj['text'] = obj.tag || ''
        rObj['id'] = obj.tag || ''

        return rObj
      })
      return ar
    }
  }
  formatBackValidator(arrayTags) {
    let a = arrayTags || []
    if (a.length === 0) {
      return []
    } else {
      let ar = a.map(function(obj) {
        var rObj = {}
        rObj['text'] = obj || ''
        rObj['id'] = obj || ''

        return rObj
      })
      return ar
    }
  }
  formatApiTagValidator(arrayValidatorTag) {
    let a = arrayValidatorTag || []
    if (a.length === 0) {
      return []
    } else {
      let ar = a.map(function(obj) {
        var rObj = []
        rObj = obj.text || ''

        return rObj
      })
      return ar
    }
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags]
    const newTags = tags.slice()
    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)
    this.setState({ tags: newTags })
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

  HoraValida(lahora) {
    if (lahora !== '') {
      var arrHora = lahora.split(':')

      if (arrHora.length !== 2) {
        return false
      }

      if (parseInt(arrHora[0]) < 0 || parseInt(arrHora[0]) > 23) {
        return false
      }

      if (parseInt(arrHora[1]) < 0 || parseInt(arrHora[1]) > 59) {
        return false
      }

      return true
    } else {
      return false
    }
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

  async validateForm(e) {
    await this.toggleValidating(true)
    const { hasNombreError, hasDepartmentIdError, hasDescriptionError } = this.state
    if (!hasNombreError && !hasDepartmentIdError && !hasDescriptionError) {
      this.onSubmit()
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
    let detail = ''
    detail = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))

    let s = this.state
    var event = {
      _id: s._id,
      firebaseIdEvent: s.firebaseIdEvent,
      name: s.name,
      description: s.description,
      detail: detail,
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
      optionLabel: s.optionLabel,
      departmentId: s.departmentId,
      externalUrl: s.externalUrl,
      imageUrl: s.imageUrl,
      showInCalendar: s.showInCalendarChecked,
      tags: this.formatApiTags(s.tags),

      locations: s.locations,
      validators: this.formatApiTagValidator(s.validators)
    }
    return event
  }

  onSuccessInsert() {
    this.props.showMessage('Evento creado')
    this.props.history.push('/calendario/eventos')
  }

  onSuccessUpdate() {
    this.messages.show({
      severity: 'success',
      summary: 'Cambios guardados Correctamente!',
      detail: 'El evento fue registrado correctamente , sera redireccionado al home de eventos'
    })

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

  render() {
    const {
      campoName,
      validatePop,
      campoQuota,
      validate,
      name,
      date,
      time,
      endTime,
      externalUrl,
      optionLabel,
      showInCalendar,
      showInCalendarChecked,
      departmentId,
      imageUrl,
      formattedAddress,
      latitude,
      longitude,
      editorState,
      description,
      tags,
      suggestions,
      validators
    } = this.state
    var _this = this
    return (
      <div>
        <Messages ref={el => (this.messages = el)} />

        <div className='alert alert-info' role='alert'>
          <i className='pi pi-info information' />
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
        <Section title={this.props.title} description={this.props.description} top>
          <div className='label'>Nombre</div>
          <InputText
            value={name}
            onChange={e => {
              this.setState({ name: e.target.value })
            }}
            className='p-inputtext'
            required={true}
            tabIndex={1}
          />
          <div className='label'>Descripción</div>
          <InputText
            value={description}
            onChange={e => {
              this.setState({ description: e.target.value })
            }}
            className='p-inputtext'
            required={true}
            tabIndex={2}
          />

          <div className='label'>Link a información</div>
          <InputText
            value={externalUrl}
            onChange={e => {
              this.setState({ externalUrl: e.target.value })
            }}
            className='p-inputtext'
            required={true}
            tabIndex={3}
          />

          <div className='label'>Fecha</div>
          <Calendar
            locale={es}
            dateFormat='dd/mm/yy'
            value={date}
            onChange={e => this.setState({ date: e.value })}
          />

          <div className='label'>Hora de inicio</div>
          <Calendar
            required={true}
            timeOnly={true}
            showTime={true}
            hourFormat='24'
            value={time}
            onChange={e => this.setState({ time: e.value })}
          />

          <div className='label'>Hora de término</div>
          <Calendar
            required={true}
            timeOnly={true}
            showTime={true}
            hourFormat='24'
            value={endTime}
            onChange={e => this.setState({ endTime: e.value })}
          />

          <div className='label'>Dirección </div>
          <SearchBar
            handleChangeAddress={this.handleChangeAddress}
            latitude={latitude}
            longitude={longitude}
            address={formattedAddress}
          />
          <div className='label'>Texto que aparecerá en campos para seleccionar un evento</div>

          <InputText
            type='text'
            value={optionLabel}
            onChange={e => {
              this.setState({ optionLabel: e.target.value })
            }}
            className='p-inputtext'
            required={true}
            tabIndex={6}
          />

          <div className='label'>Url con imagen para el evento</div>
          <div className='os-input-container'>
            <InputText
              type='url'
              value={imageUrl}
              onChange={e => {
                this.setState({ imageUrl: e.target.value })
              }}
              className='p-inputtext'
              required={true}
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
                <img src={this.state.imageUrl} onClick={this.handleShowDialog} className='small' />
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

            <span className='p-button p-fileupload-choose p-component p-button-text-icon-left'>
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
            tabIndex='8'
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
            tabIndex='9'
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
          <div className='label'>Tags</div>
          <div>
            <ReactTags
              placeholder='Agregar tag'
              inputFieldPosition='bottom'
              tags={tags}
              suggestions={suggestions}
              handleDelete={this.handleDelete}
              handleAddition={this.handleAddition}
              handleDrag={this.handleDrag}
              delimiters={delimiters}
            />
          </div>
          <div className='label'>Usuarios validators del evento *(Indique mail)</div>
          <div>
            <ReactTags
              placeholder='Agregar email'
              inputFieldPosition='bottom'
              tags={validators}
              suggestions={suggestions}
              handleDelete={this.handleDeleteValidator}
              handleAddition={this.handleAdditionValidator}
              handleDrag={this.handleDragValidator}
              delimiters={delimiters}
            />
          </div>
          <div>
            <Popup
              modal
              trigger={
                <Button label={this.infoButton()} className='button' style={{ marginTop: 20 }} />
              }
            >
              {close => (
                <div className='ModalEvent'>
                  <a className='close' onClick={close}>
                    &times;
                  </a>
                  <div className='headerModal'> Información de ticket </div>
                  <div className='label'>
                    <h4>Detail</h4>
                  </div>
                  <div>
                    <Editor
                      wrapperClassName='wrapper-class'
                      editorClassName='form-control mr-sm-2'
                      toolbarClassName='toolbar-class'
                      editorState={editorState}
                      onEditorStateChange={this.onEditorStateChange}
                      toolbar={{
                        options: [
                          'inline',
                          'blockType',
                          'fontSize',
                          'fontFamily',
                          'list',
                          'textAlign',
                          'colorPicker',
                          'link',
                          'embedded',
                          'emoji',
                          'image',
                          'remove',
                          'history'
                        ],
                        inline: {
                          inDropdown: true,
                          options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
                          bold: { className: 'bordered-option-classname' },
                          italic: { className: 'bordered-option-classname' },
                          underline: { className: 'bordered-option-classname' },
                          strikethrough: { className: 'bordered-option-classname' },
                          code: { className: 'bordered-option-classname' }
                        }
                      }}
                    />
                    <br />
                  </div>
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
                            <Button onClick={this.addLocation} className='button'>
                              <i className='pi pi-plus information' />
                            </Button>
                          </td>
                        </tr>
                        {this.state.locations.map(function(item, index) {
                          return (
                            <tr key={index}>
                              <td className='col2'>{item.name}</td>
                              <td className='col3'>{item.quota}</td>
                              <td className='col4'>
                                <Button
                                  onClick={() => {
                                    _this.removeLocation(item)
                                  }}
                                >
                                  <i className='pi pi-minus information' />
                                </Button>
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
          />
          {this.props.type === 'create' && (
            <Button
              label='Crear Evento'
              onClick={() => this.validateForm()}
              style={{ marginRight: 10 }}
            />
          )}
          {this.props.type === 'update' && (
            <Button
              label='Guardar'
              onClick={() => this.validateForm()}
              style={{ marginRight: 10 }}
            />
          )}
          {this.props.type === 'update' && (
            <Button
              label='Eliminar'
              style={{ marginRight: 10 }}
              onClick={() => this.confirmDelete()}
            />
          )}
        </Section>
      </div>
    )
  }
}
