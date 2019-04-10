import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import WithParams from './WithParams'
import Form from './Form'
import schemaToField from '../schemaToField'
import autobind from 'autobind-decorator'
import Fields from './Fields'
import WithMutation from './WithMutation'
import getFragment from './getFragment'
import {getValidationErrors, clean} from '@orion-js/schema'

export default class AutoForm extends React.Component {
  static propTypes = {
    mutation: PropTypes.string,
    doc: PropTypes.object,
    onChange: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    fragment: PropTypes.any,
    onSuccess: PropTypes.func,
    onValidationError: PropTypes.func,
    clean: PropTypes.func,
    validate: PropTypes.func,
    schema: PropTypes.object,
    omit: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    only: PropTypes.string
  }

  static defaultProps = {
    children: props => <Fields schemaToField={schemaToField} {...props} />,
    clean: async (schema, doc) => await clean(schema, doc),
    validate: async (schema, doc) => await getValidationErrors(schema, doc),
    omit: [],
    onSuccess: () => {},
    onValidationError: () => {}
  }

  @autobind
  submit() {
    return this.form.submit()
  }

  renderChildren({params}) {
    if (typeof this.props.children === 'function') {
      return this.props.children({
        params,
        parent: this,
        omit: this.props.omit,
        only: this.props.only
      })
    } else {
      return this.props.children
    }
  }

  getFragment({name, result, basicResultQuery, params}) {
    if (this.props.fragment) {
      return this.props.fragment
    } else {
      return getFragment({name, result, basicResultQuery, params})
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <WithParams name={this.props.mutation}>
          {({name, result, basicResultQuery, params}) => (
            <WithMutation
              params={params}
              fragment={this.getFragment({name, result, basicResultQuery, params})}
              mutation={this.props.mutation}>
              {mutate => (
                <Form
                  setRef={form => (this.form = form)}
                  doc={this.props.doc}
                  mutate={mutate}
                  onChange={this.onChange}
                  params={params}
                  schema={this.props.schema || params}
                  onSuccess={this.props.onSuccess}
                  onValidationError={this.props.onValidationError}
                  clean={this.props.clean}
                  validate={this.props.validate}>
                  {this.renderChildren({params})}
                </Form>
              )}
            </WithMutation>
          )}
        </WithParams>
      </div>
    )
  }
}
