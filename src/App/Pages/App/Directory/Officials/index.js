import React from 'react'
import forceLogin from 'App/helpers/auth/forceLogin'
import withAuthorization from 'App/helpers/auth/withAuthorization'
import Container from 'orionsoft-parts/lib/components/Container'
import { Route, Switch } from 'react-router-dom'
import DynamicComponent from 'App/components/DynamicComponent'

@forceLogin
@withAuthorization(['admin'])
export default class Officials extends React.Component {
  render() {
    return (
      <Container>
        <Switch>
          <Route
            exact
            path="/directorio/funcionarios"
            component={DynamicComponent(() => import('./List'))}
          />
          <Route
            exact
            path="/directorio/funcionarios/crear"
            component={DynamicComponent(() => import('./Create'))}
          />
          <Route
            exact
            path="/directorio/funcionarios/editar/:officialId"
            component={DynamicComponent(() => import('./Update'))}
          />
        </Switch>
      </Container>
    )
  }
}
