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
    showMessage: PropTypes.func
  }

  state = {
    event: {},
    errorMessages: {}
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
  handleChangeAddress(contactInformationAddress) {
    this.setState({
      event: {
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
  }

  render() {
    return (
      <Section title="Crear Evento" description="Crear un nuevo evento" top>
        <Form
          state={this.state.event}
          ref="form"
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
        <Button to="/calendar/eventos" style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={this.submit} primary>
          Crear Evento
        </Button>
      </Section>
    )
  }
}
