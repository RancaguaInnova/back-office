import React from 'react'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import { Form, Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import SearchBar from 'App/components/fields/GooglePlaces'
import DateText from 'orionsoft-parts/lib/components/fields/DateText'
import HourField from 'App/components/fields/HourField'
import Checkbox from 'orionsoft-parts/lib/components/fields/Checkbox'
import { withRouter } from 'react-router'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import autobind from 'autobind-decorator'
import gql from 'graphql-tag'
import EventFragments from 'App/fragments/Event'
import omit from 'lodash/omit'
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
export default class UpdateEvent extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    event: PropTypes.object,
    updateEvent: PropTypes.func
  }

  state = {}

  componentDidMount() {
    this.setState({ event: this.props.event })
  }

  getDepartmentOptions() {
    return this.props.departments.items.map(department => {
      return { label: department.name, value: department._id }
    })
  }

  @autobind
  handleChangeAddress(contactInformationAddress) {
    let newState = Object.assign(this.state.event, {
      address: {
        streetName: contactInformationAddress.streetName,
        administrativeAreaLevel1:
          contactInformationAddress.administrativeAreaLevel1,
        administrativeAreaLevel2:
          contactInformationAddress.administrativeAreaLevel2,
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
    this.setState(newState)
  }

  @autobind
  confirmDelete() {
    confirmAlert({
      title: 'Confirmar acción',
      message: '¿Eliminar este evento?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => await this.delete()
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })
  }

  async delete() {
    try {
      await this.props.deleteEvent({ _id: this.props.event._id })
      this.props.showMessage('Evento eliminado!')
      this.props.history.push('/calendario/eventos')
    } catch (error) {
      console.log('Error deleting event:', error)
      this.showMessage('Ocurrió un error')
    }
  }

  async onSubmit() {
    try {
      await this.props.updateEvent({ event: this.state.event })
      this.props.showMessage('Cambios guardados!')
    } catch (error) {
      this.props.showMessage('Ocurrión un error!')
    }
  }

  render() {
    return (
      <Section title="Editar Evento" description="Editar un evento" top>
        <Form
          state={this.state.event}
          onChange={change => this.setState({ event: { ...change } })}
        >
          <div className="label">Nombre</div>
          <Field fieldName="name" type={Text} />
          <div className="label">Descripción</div>
          <Field fieldName="description" type={Text} />
          <div className="label">Link a información</div>
          <Field fieldName="externalUrl" type={Text} />
          <div className="label">Fecha</div>
          <Field fieldName="date.date" type={DateText} />
          <div className="label">Hora de inicio</div>
          <Field fieldName="date.startHour" type={HourField} />
          <div className="label">Hora de término</div>
          <Field fieldName="date.endHour" type={HourField} />
          <div className="label">Dirección</div>
          <SearchBar
            handleChangeAddress={this.handleChangeAddress}
            latitude={-34.1703131}
            longitude={-70.74064759999999}
          />
          <div className="label">
            Texto que aparecerá en campos para seleccionar un evento
          </div>
          <Field fieldName="optionLabel" type={Text} />
          <Field
            fieldName="showInCalendar"
            type={Checkbox}
            label="Mostrar en calendario (publicar evento)"
          />
          <div className="label">Departamento al que pertenece el evento</div>
          <Field
            fieldName="departmentId"
            type={Select}
            options={this.getDepartmentOptions()}
          />
        </Form>
        <br />
        <Button to="/calendario/eventos" style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={() => this.onSubmit()} primary>
          Guardar
        </Button>
        <Button onClick={() => this.confirmDelete()} danger>
          Eliminar
        </Button>
      </Section>
    )
  }
}
