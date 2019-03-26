import React from 'react'
import { Route, Switch } from 'react-router-dom'
import DynamicComponent from 'App/components/DynamicComponent'
import Container from 'orionsoft-parts/lib/components/Container'
import forceLogin from 'App/helpers/auth/forceLogin'
import withAuthorization from 'App/helpers/auth/withAuthorization'

@forceLogin
@withAuthorization(['admin'])
export default class EventsRoutes extends React.Component {
  render() {
    return (
      <Container>
        <Switch>
          <Route
            path="/calendario/eventos"
            component={DynamicComponent(() => import('./List'))}
          />
          <Route
            path="/calendario/eventos/crear"
            component={DynamicComponent(() => import('./Create'))}
          />
          <Route
            path="/calendario/eventos/editar/:eventId"
            component={DynamicComponent(() => import('./Update'))}
          />
        </Switch>
      </Container>
    )
  }
}
