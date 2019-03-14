import React from 'react'
import PaginatedList from 'App/components/Crud/List'
import forceLogin from 'App/helpers/auth/forceLogin'
import withAuthorization from 'App/helpers/auth/withAuthorization'
import Container from 'orionsoft-parts/lib/components/Container'
import { Route, Switch } from 'react-router-dom'
import DynamicComponent from 'App/components/DynamicComponent'

@forceLogin
@withAuthorization(['admin'])
export default class Departments extends React.Component {
  getFields() {
    return [
      {
        name: 'name',
        title: 'Nombre',
        sort: 'DESC',
        render: (value, doc, index) => <span>{value.name} </span>
      }
    ]
  }
  render() {
    return (
      <Container>
        <Switch>
          <Route
            exact
            path="/directorio/departamentos/crear"
            component={DynamicComponent(() => import('./Create'))}
          />
          <Route
            exact
            path="/directorio/departamentos/editar/:applicationId"
            component={DynamicComponent(() => import('./Update'))}
          />
        </Switch>
      </Container>
    )
  }
}
