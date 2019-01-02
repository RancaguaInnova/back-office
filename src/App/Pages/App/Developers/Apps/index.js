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
import withUserId from 'App/helpers/auth/withUserId'
import gql from 'graphql-tag'
import AppFragments from 'App/fragments/Apps'
import LinkToAccount from './LinkToAccount'

import styles from './styles.css'

@withRouter
@withMessage
@withUserId
@withMutation(gql`
  mutation createApplication($application: ApplicationInput!) {
    createApplication(application: $application) {
      ...AppRegistrationForm
    }
  }
  ${AppFragments.AppRegistrationForm}
`)
export default class AppRegistrationForm extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    userId: PropTypes.string,
    user: PropTypes.object,
    createApplication: PropTypes.func
  }

  state = {
    userFields: []
  }

  async onSubmit() {
    try {
      let application = Object.assign({}, this.state)
      await this.props.createApplication({ application })
      this.props.showMessage(
        'Aplicación registrada. Recibirás un correo con el token de tu app.'
      )
      this.props.history.push(`/devs`)
    } catch (error) {
      this.props.showMessage('Ocurrió un error al registrar la aplicación.')
      console.log('Error al registrar aplicación:', error)
    }
  }

  renderLinkToAccountButton() {
    return (
      <LinkToAccount
        userId={this.props.userId}
        linkAccountData={developerInfo => this.setState({ developerInfo })}
      />
    )
  }

  renderDeveloperInfo() {
    let { userId } = this.props
    if (!userId) {
      this.props.history.push('/devs/registro')
    } else {
      return (
        <div>
          <div>
            <div className={styles.headerLabel} style={{ marginBottom: 10 }}>
              Información del desarrollador:
            </div>
            {this.renderLinkToAccountButton()}
          </div>
          <div className={styles.fieldGroup} style={{ marginTop: 15 }}>
            <div className={styles.label}>Nombre:</div>
            <Field fieldName="developerInfo.firstName" type={Text} />
            <div className={styles.label}>Apellido:</div>
            <Field fieldName="developerInfo.lastName" type={Text} />
            <div className={styles.label}>Pagina Web:</div>
            <Field fieldName="developerInfo.url" type={Text} />
            <div className={styles.headerLabel}>Información de contacto:</div>
            <div className={styles.fieldGroup}>
              <div className={styles.subheaderLabel}>Dirección:</div>
              <div className={styles.fieldGroup}>
                <div className={styles.label}>Nombre de calle:</div>
                <Field
                  fieldName="developerInfo.address.streetName"
                  type={Text}
                />
                <div className={styles.label}>Numeración:</div>
                <Field
                  fieldName="developerInfo.address.streetNumber"
                  type={Text}
                />
                <div className={styles.label}>
                  Número de oficina/casa/departamento (opcional):
                </div>
                <Field
                  fieldName="developerInfo.address.departmentNumber"
                  type={Text}
                />
                <div className={styles.label}>Ciudad:</div>
                <Field fieldName="developerInfo.address.city" type={Text} />
                <div className={styles.label}>Código Postal:</div>
                <Field
                  fieldName="developerInfo.address.postalCode"
                  type={Text}
                />
              </div>
              <div className={styles.subheaderLabel}>Teléfono:</div>
              <div className={styles.fieldGroup}>
                <div className={styles.label}>Código de área:</div>
                <Field fieldName="developerInfo.phone.areaCode" type={Text} />
                <div className={styles.label}>Número fijo:</div>
                <Field fieldName="developerInfo.phone.number" type={Text} />
                <div className={styles.label}>Celular:</div>
                <Field
                  fieldName="developerInfo.phone.mobilePhone"
                  type={Text}
                />
              </div>
              <div className={styles.subheaderLabel}>Email:</div>
              <div className={styles.fieldGroup}>
                <div className={styles.label}>Email:</div>
                <Field fieldName="developerInfo.email" type={Text} />
              </div>
            </div>
          </div>
        </div>
      )
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
          <div className={styles.headerLabel}>
            Información de la aplicación:
          </div>
          <div className={styles.fieldGroup}>
            <div className={styles.label}>Nombre:</div>
            <Field fieldName="name" type={Text} />
            <div className={styles.label}>Descripción:</div>
            <Field fieldName="description" type={Textarea} />
            <div className={styles.label}>URL de redirección:</div>
            <Field fieldName="applicationURL" type={Text} />
            <div className={styles.label}>Datos de usuario:</div>
            <Field
              fieldName="userFields"
              type={Select}
              multi
              options={[
                {
                  label: 'Email',
                  value: 'email'
                },
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
          </div>
          {this.renderDeveloperInfo()}
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
