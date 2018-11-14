import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import {Field} from 'simple-react-form'
import AutoForm from 'App/components/AutoForm'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import PropTypes from 'prop-types'
import LockIcon from 'react-icons/lib/md/lock'

@withMessage
export default class ChangePassword extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    showMessage: PropTypes.func
  }

  state = {}

  schema = {
    oldPassword: {
      type: String,
      label: {
        en: 'Current password',
        es: 'Contraseña actual'
      }
    },
    newPassword: {
      type: String,
      min: 8,
      label: {
        en: 'New password',
        es: 'Contraseña nueva'
      }
    },
    confirm: {
      type: String,
      custom(confirm, {doc: {newPassword}}) {
        if (confirm !== newPassword) {
          return 'passwordsDontMatch'
        }
      },
      label: {
        en: 'Confirm the new password',
        es: 'Confirma la contraseña nueva'
      }
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <Section top title="Cambiar contraseña" description="Cambia tu contraseña">
          <AutoForm
            mutation="changePassword"
            ref="form"
            onSuccess={() => this.props.showMessage('Your password was changed')}
            schema={this.schema}>
            <div className="label">Contraseña actual</div>
            <Field
              fieldName="oldPassword"
              fieldType="password"
              placeholder="Contraseña actual"
              type={Text}
            />
            <div className={styles.divider} />
            <div className="label">Nueva contraseña</div>
            <Field
              fieldName="newPassword"
              fieldType="password"
              placeholder="Nueva contraseña"
              type={Text}
            />
            <div className="description">Tu contraseña debe tener al menos 6 caracteres</div>
            <div className="label">Confirmar contraseña</div>
            <Field
              fieldName="confirm"
              fieldType="password"
              placeholder="Repite tu contraseña nueva"
              type={Text}
            />
          </AutoForm>
          <br />
          <Button icon={LockIcon} onClick={() => this.refs.form.submit()} primary>
            Cambiar contraseña
          </Button>
        </Section>
      </div>
    )
  }
}
