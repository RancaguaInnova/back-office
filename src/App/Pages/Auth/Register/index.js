import React from 'react'
import AutoForm from 'App/components/AutoForm'
import { Field } from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Button from 'orionsoft-parts/lib/components/Button'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import ObjectField from 'App/components/fields/ObjectField'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import withUserId from 'App/helpers/auth/withUserId'
import LoggedIn from '../LoggedIn'
import { Link } from 'react-router-dom'
import setSession from 'App/helpers/auth/setSession'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'

@withGraphQL(
  gql`
    query departments {
      departments {
        items {
          _id
          name
        }
      }
    }
  `
)
@withUserId
export default class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: []
    }
  }

  static propTypes = {
    onLogin: PropTypes.func,
    userId: PropTypes.string,
    departments: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
          name: PropTypes.string
        })
      )
    })
  }

  componentDidMount() {
    const options = this.getOptions()
    this.setState({ options })
  }

  getOptions() {
    const departments = this.props.departments.items
    return departments.map(department => {
      return {
        label: department.name,
        value: department._id
      }
    })
  }

  @autobind
  onSuccess(session) {
    setSession(session)
    this.props.onLogin()
  }

  render() {
    if (this.props.userId) return <LoggedIn />
    return (
      <div>
        <AutoForm mutation="createUser" ref="form" onSuccess={this.onSuccess}>
          <Field fieldName="profile" type={ObjectField} style={null}>
            <div className="row">
              <div className="col-xs-12 col-sm-6">
                <div className="label">Nombre</div>
                <Field fieldName="firstName" type={Text} placeholder="Nombre" />
              </div>
              <div className="col-xs-12 col-sm-6">
                <div className="label">Apellido</div>
                <Field
                  fieldName="lastName"
                  type={Text}
                  placeholder="Apellido"
                />
              </div>
            </div>
          </Field>
          <div className="label">RUT</div>
          <Field
            fieldName="profile.identifier"
            type={Text}
            placeholder="11.222.333-k"
          />
          <div className="label">Departamento o unidad municipal</div>
          <Field
            fieldName="profile.departmentIds"
            type={Select}
            options={this.state.options}
            placeholder="Seleccionar..."
          />
          <div className="label">Email</div>
          <Field
            fieldName="email"
            type={Text}
            fieldType="email"
            placeholder="Email"
          />
          <div className="label">Contraseña</div>
          <Field
            fieldName="password"
            type={Text}
            fieldType="password"
            placeholder="Contraseña"
          />
        </AutoForm>
        <br />
        <Button onClick={() => this.refs.form.submit()} primary>
          Registrarme
        </Button>
        <br />
        <br />
        <div>
          Si ya tienes una cuenta <Link to="/login">Entra</Link>
        </div>
      </div>
    )
  }
}
