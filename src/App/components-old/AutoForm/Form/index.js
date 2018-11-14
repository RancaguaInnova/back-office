import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import {Form} from 'simple-react-form'
import autobind from 'autobind-decorator'
import translate from 'App/i18n/translate'
import {dotGetSchema} from '@orion-js/schema'
import getInLocale from 'App/i18n/getInLocale'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withMessage
export default class AutoFormForm extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    params: PropTypes.object,
    children: PropTypes.node,
    doc: PropTypes.object,
    onChange: PropTypes.func,
    setRef: PropTypes.func,
    mutate: PropTypes.func,
    onSuccess: PropTypes.func,
    onValidationError: PropTypes.func,
    schema: PropTypes.object,
    clean: PropTypes.func,
    validate: PropTypes.func
  }

  static defaultProps = {
    onChange: () => {}
  }

  state = {}

  @autobind
  submit() {
    return this.form.submit()
  }

  handleError(error, doc) {
    if (error.graphQLErrors) {
      for (const graphQLError of error.graphQLErrors) {
        if (graphQLError.validationErrors) {
          console.log('Validation errors', graphQLError.validationErrors)
          this.setState({validationErrors: graphQLError.validationErrors, doc})
          this.props.onValidationError(graphQLError.validationErrors)
        } else if (
          graphQLError.error === 'PermissionsError' &&
          graphQLError.type === 'missingRoles'
        ) {
          const roles = graphQLError.roles
          alert(`Client is unauthorized, missing roles: ${roles.join(', ')}`)
        } else {
          console.log(graphQLError)
          this.props.showMessage(graphQLError)
        }
      }
    } else {
      console.error(error)
      alert(error.message)
    }
  }

  @autobind
  async onSubmit(data) {
    try {
      const errors = await this.validate(data)
      if (errors) {
        return {error: new Error('validationError'), result: null}
      } else {
        const cleaned = await this.props.clean(this.props.params, data)
        const result = await this.props.mutate(cleaned)
        const mutationResult = await this.props.onSuccess(result)
        return {error: null, result: mutationResult}
      }
    } catch (error) {
      this.handleError(error, data)
      return {error, result: null}
    }
  }

  @autobind
  async validate(doc) {
    this.setState({validationErrors: null})
    try {
      const cleaned = await this.props.clean(this.props.schema, doc)
      const validationErrors = await this.props.validate(this.props.schema, cleaned)
      this.setState({validationErrors, doc})
      if (validationErrors) {
        console.log('validationErrors:', validationErrors)
        this.props.onValidationError(validationErrors)
      }
      return validationErrors
    } catch (error) {
      console.error('Error validating', error)
    }
  }

  @autobind
  onChange(doc) {
    this.props.onChange(doc)
    this.setState({doc})
  }

  getErrorMessages() {
    const {doc, validationErrors} = this.state
    if (!validationErrors) return
    const messages = {}
    for (const key of Object.keys(validationErrors)) {
      const code = validationErrors[key]
      const keySchema = dotGetSchema(this.props.schema, key)
      if (!keySchema) continue
      const label = keySchema.label || key
      const text = translate(`errors.${code}`, {doc, label: getInLocale(label)})
      messages[key] = text
    }
    return messages
  }

  render() {
    return (
      <div className={styles.container}>
        <Form
          ref={this.props.setRef}
          state={this.props.doc}
          errorMessages={this.getErrorMessages()}
          onChange={this.onChange}
          onSubmit={this.onSubmit}>
          {this.props.children}
        </Form>
      </div>
    )
  }
}
