import React from 'react'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import { Form, Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Textarea from 'orionsoft-parts/lib/components/fields/Textarea'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'

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

  render() {
    return (
      <Section
        title="Registro de integraciones"
        description="Registra tu aplicación llenando este
        formulario. Recibirás un email cuando tu aplicación sea aprobada"
        top
      >
        <Form state={this.state} onChange={changes => this.setState(changes)}>
          <div className="headerLabel">Información de la aplicación:</div>
          <div className="label">Nombre:</div>
          <Field fieldName="name" type={Text} />
          <div className="label">Descripción:</div>
          <Field fieldName="description" type={Textarea} />
          <div className="label">URL de redirección:</div>
          <Field fieldName="applicationURL" type={Text} />
          <div className="label">Datos de usuario:</div>
          <Field
            fieldName="userFields"
            type={Select}
            multi
            options={[
              {
                label: 'Rut',
                value: 'identifier'
              },
              {
                label: 'Nombre',
                value: 'firstName'
              },
              {
                label: 'Apellido',
                value: 'lastName'
              },
              {
                label: 'Dirección',
                value: 'address'
              },
              {
                label: 'Teléfono',
                value: 'phone'
              },
              {
                label: 'Nivel Educacional',
                value: 'educationalLevel'
              }
            ]}
          />
          <div className="headerLabel">Información del desarrollador:</div>
          <div className="label">Nombre:</div>
          <Field fieldName="developerInfo.firstName" type={Text} />
          <div className="label">Apellido:</div>
          <Field fieldName="developerInfo.lastName" type={Text} />
          <div className="headerLabel">Información de contacto:</div>
          <div className="label">Dirección:</div>
          <div className="label">Nombre de calle:</div>
          <Field
            fieldName="developerInfo.contactInformation.address.streetName"
            type={Text}
          />
          <div className="label">Numeración:</div>
          <Field
            fieldName="developerInfo.contactInformation.address.streetNumber"
            type={Text}
          />
          <div className="label">
            Número de oficina/casa/departamento (opcional):
          </div>
          <Field
            fieldName="developerInfo.contactInformation.address.departmentNumber"
            type={Text}
          />
          <div className="label">Ciudad:</div>
          <Field
            fieldName="developerInfo.contactInformation.address.city"
            type={Text}
          />
          <div className="label">Código Postal:</div>
          <Field
            fieldName="developerInfo.contactInformation.address.postalCode"
            type={Text}
          />
          <div className="label">Teléfono:</div>
          <div className="label">Código de área:</div>
          <Field
            fieldName="developerInfo.contactInformation.phone.areaCode"
            type={Text}
          />
          <div className="label">Número fijo:</div>
          <Field
            fieldName="developerInfo.contactInformation.phone.number"
            type={Text}
          />
          <div className="label">Celular:</div>
          <Field
            fieldName="developerInfo.contactInformation.phone.mobilePhone"
            type={Text}
          />
          <div className="label">Pagina Web:</div>
          <Field fieldName="developerInfo.url" type={Text} />
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
