import React from 'react'
import { Route, Switch } from 'react-router-dom'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import DynamicComponent from 'App/components/DynamicComponent'
import Container from 'orionsoft-parts/lib/components/Container'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import forceLogin from 'App/helpers/auth/forceLogin'
import withAuthorization from 'App/helpers/auth/withAuthorization'

@forceLogin
@withAuthorization(['admin'])
export default class UserRoutes extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.header}>
          <Breadcrumbs
            past={{
              '/': 'Inicio'
            }}
          >
            Usuarios
          </Breadcrumbs>
          <br />
          <Tabs
            items={[
              { title: 'Home', path: '/usuarios' },
              { title: 'Usuarios', path: '/usuarios/lista' }
            ]}
          />
        </div>
        <Container>
          <Switch>
            <Route
              exact
              path="/usuarios"
              component={DynamicComponent(() => import('./Home'))}
            />
            <Route
              path="/usuarios/lista"
              component={DynamicComponent(() => import('./List'))}
            />
            <Route
              path="/usuarios/crear"
              component={DynamicComponent(() => import('./Create'))}
            />
            <Route
              path="/usuarios/editar/:userId"
              component={DynamicComponent(() => import('./Update'))}
            />
          </Switch>
        </Container>
      </div>
    )
  }
}
