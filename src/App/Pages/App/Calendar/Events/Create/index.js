import React from 'react'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import { Form, Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import DateText from 'orionsoft-parts/lib/components/fields/DateText'
import Checkbox from 'orionsoft-parts/lib/components/fields/Checkbox'
import HourField from 'App/components/fields/HourField'
import Select from 'orionsoft-parts/lib/components/fields/Select'
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
import { Textbox } from 'react-inputs-validation'

import './modal.css'

@withRouter
@withMessage
@withGraphQL(gql`
  query departments {
    departments {
      _id
      items {
        _id
        name
      }
    }
  }
`)
@withMutation(gql`
  mutation createEvent($event: EventInput!) {
    createEvent(event: $event) {
      _id
    }
  }
`)
export default class CreateEvent extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    departments: PropTypes.object,
    deleteEvent: PropTypes.func,
    createEvent: PropTypes.func
  }

  state = {
    event: {},
    errorMessages: {},
    location: [],
    campoID: '',
    validate: false
  }

  getDepartmentOptions() {
    return this.props.departments.items.map(department => {
      return { label: department.name, value: department._id }
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

  @autobind
  async submit() {
    try {
      await this.props.createEvent({ event: this.state.event })
      this.props.showMessage('Evento creado')
      this.props.history.push('/calendario/eventos')
    } catch (error) {
      this.setState({ errorMessages: this.getValidationErrors(error) })
      this.props.showMessage('Ocurrión un error!')
    }
  }

  renderErrorMessages() {
    if (!this.state.errorMessages) return
    console.log('UNIMPLEMENTED')
  }
  @autobind
  addLocation(e) {
    e.preventDefault()
    let newLocation = {
      id: this.state.ticket.l.id,
      name: this.state.ticket.l.name,
      quota: this.state.ticket.l.quota
    }
    let locations = this.state.location
    locations.push(newLocation)
    this.setState({
      location: locations,
      ticket: {
        l: {
          id: '',
          name: '',
          quota: ''
        }
      }
    })
  }

  @autobind
  handleChangeAddress(contactInformationAddress) {
    this.setState({
      event: {
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
      }
    })
  }

  render() {
    const { campoID } = this.state
    return (
      <Section title='Crear Evento' description='Crear un nuevo evento' top>
        <Form
          state={this.state.event}
          ref='form'
          onChange={change => this.setState({ event: { ...change } })}
        >
          <div className='label'>Nombre</div>
          <Field fieldName='name' type={Text} />
          <div className='label'>Descripción</div>
          <Field fieldName='description' type={Text} />
          <div className='label'>Link a información</div>
          <Field fieldName='externalUrl' type={Text} />
          <div className='label'>Fecha</div>
          <Field fieldName='date.date' type={DateText} />
          <div className='label'>Hora de inicio</div>
          <Field fieldName='date.startHour' type={HourField} />
          <div className='label'>Hora de término</div>
          <Field fieldName='date.endHour' type={HourField} />
          <div className='label'>Dirección</div>
          <SearchBar
            handleChangeAddress={this.handleChangeAddress}
            latitude={-34.1703131}
            longitude={-70.74064759999999}
          />
          <div className='label'>Texto que aparecerá en campos para seleccionar un evento</div>
          <Field fieldName='optionLabel' type={Text} />
          <Field
            fieldName='showInCalendar'
            type={Checkbox}
            label='Mostrar en calendario (publicar evento)'
          />
          <div className='label'>Departamento al que pertenece el evento</div>
          <Field fieldName='departmentId' type={Select} options={this.getDepartmentOptions()} />
        </Form>
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
                        <td className='Headcol1'>ID</td>
                        <td className='Headcol2'>Nombre de la ubicación</td>
                        <td className='Headcol3'>Nº de tickets</td>
                        <td className='Headcol4'> </td>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.location.map(function(item, index) {
                        return (
                          <tr key={index}>
                            <td className='col1'>{item.id}</td>
                            <td className='col2'>{item.name}</td>
                            <td className='col3'>{item.quota}</td>
                            <td className='col4'>
                              <button
                                onClick={() => {
                                  close()
                                }}
                                className='button'
                              >
                                Quitar
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                      <tr>
                        <td className='col1' />
                        <td className='col2'>
                          <Textbox
                            tabIndex='1'
                            id='campoName'
                            name='campoName'
                            type='text'
                            value={campoName}
                            classNameInput='campoName'
                            maxLength='50'
                            onChange={(campoName, e) => {
                              console.log(campoID)
                              this.setState({ campoName })
                            }}
                            validationOption={{
                              name: 'Nombre de la ubicación',
                              check: true,
                              required: true
                            }}
                          />{' '}
                          <Field className='campoName' fieldName='l.name' type={Text} />
                        </td>
                        <td className='col3'>
                          {' '}
                          <Field className='campoQuota' fieldName='l.quota' type={Text} />
                        </td>
                        <td className='col4'>
                          <button onClick={this.addLocation} className='button'>
                            Agregar
                          </button>
                        </td>
                      </tr>
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
        <Button to='/calendar/eventos' style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={this.submit} primary>
          Crear Evento
        </Button>
      </Section>
    )
  }
}
