import React from 'react'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import { Form, Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import EventFragments from 'App/fragments/Event'
import omit from 'lodash/omit'

@withRouter
@withMessage
@withGraphQL(gql`
  query event($eventId: ID!) {
    event(eventId: $eventId) {
      ...FullEvent
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
export default class UpdateEvent extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    event: PropTypes.object,
    updateEvent: PropTypes.func
  }

  state = {}

  componentDidMount() {
    this.setState({ ...this.props.event })
  }

  async onSubmit() {
    const { email } = this.state
    const event = Object.assign(
      { emails: [{ address: email, verified: false }] },
      omit(this.state, ['email'])
    )
    try {
      await this.props.updateevent({ event })
      this.props.showMessage('Evento actualizado')
    } catch (error) {
      this.props.showMessage('Hubo un error al guardar los datos')
      console.log('error:', error, '\n')
    }
  }

  render() {
    return (
      <Section title="Editar Evento" description="Editar un usuario" top>
        <Form state={this.state} onChange={changes => this.setState(changes)}>
          <div className="label">Email:</div>
          <Field fieldName="email" type={Text} />
        </Form>
        <br />
        <Button to="/eventos" style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={() => this.onSubmit()} primary>
          Guardar
        </Button>
      </Section>
    )
  }
}
