import React from 'react'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import { Form, Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Textarea from 'orionsoft-parts/lib/components/fields/Textarea'
import Checkbox from 'orionsoft-parts/lib/components/fields/Checkbox'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
import includes from 'lodash/includes'
import remove from 'lodash/remove'

@withRouter
@withMessage
@withMutation(gql`
  mutation createApplication($application: ApplicationInput!) {
    createApplication(application: $application)
  }
`)
export default class AppRegistrationForm extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func
  }

  state = {
    userFields: []
  }

  async onSubmit() {
    try {
      await this.props.createApplication(this.state)
      this.props.showMessage(
        'Aplicación registrada. Recibirás un correo cuando sea aprobada'
      )
      this.props.history.push(`/apps`)
    } catch (error) {
      this.props.showMessage('Ocurrió un error al registrar la aplicación')
      console.log('Error registering app:', error)
    }
  }

  @autobind
  setUserFields(fieldName, value) {
    console.log('fieldName:', fieldName, 'value:', value)
    let currentUserFields = this.state.userFields
    if (value) {
      if (!includes(currentUserFields, fieldName)) {
        currentUserFields.push(fieldName)
        this.setState({ userFields: currentUserFields })
      }
    } else {
      if (includes(currentUserFields, fieldName)) {
        remove(currentUserFields, field => field === fieldName)
        this.setState({ userFields: currentUserFields })
      }
    }
  }

  @autobind
  renderUserFields() {
    const userFields = [
      { label: 'Rut', value: 'identifier' },
      { label: 'Nombre', value: 'firstName' },
      { label: 'Apellido', value: 'lastName' },
      { label: 'Dirección', value: 'address' },
      { label: 'Teléfono', value: 'phone' },
      { label: 'Nivel educacional', value: 'educationalLevel' }
    ]

    return userFields.map(field => {
      return (
        <Checkbox
          label={field.label}
          key={field.value}
          onChange={changes => {
            console.log('changes:', changes)
            this.setUserFields(field.label, field.value)
          }}
        />
      )
    })
  }

  render() {
    return (
      <Section
        title="Registro de integraciones"
        description="Registra tu aplicación llenando este
        formulario. Recibirás un email cuando tu aplicación sea aprobada"
        top
      >
        <Form state={this.state} onChange={changes => this.setState(changes)}>
          <div className="label">Información de la aplicación:</div>
          <div className="label">Nombre:</div>
          <Field fieldName="name" type={Text} />
          <div className="label">Descripción:</div>
          <Field fieldName="description" type={Textarea} />
          <div className="label">URL de redirección:</div>
          <Field fieldName="applicationURL" type={Text} />
          <div className="label">Datos de usuario:</div>
          {this.renderUserFields()}
          <div className="label">Email:</div>
          <Field fieldName="email" type={Text} />
          <div className="label">Email:</div>
          <Field fieldName="email" type={Text} />
          <div className="label">Email:</div>
          <Field fieldName="email" type={Text} />
          <div className="label">Email:</div>
          <Field fieldName="email" type={Text} />
          <div className="label">Email:</div>
          <Field fieldName="email" type={Text} />
          <div className="label">Email:</div>
          <Field fieldName="email" type={Text} />
          <Field fieldName="email" type={Text} />
        </Form>
        <br />
        <Button to="/" style={{ marginRight: 10 }}>
          Cancelar
        </Button>
        <Button onClick={() => this.onSubmit()} primary>
          Registrar Aplicación
        </Button>
      </Section>
    )
  }
}
