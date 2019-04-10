import React from 'react'
import { Route, Switch } from 'react-router-dom'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import Container from 'orionsoft-parts/lib/components/Container'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import DynamicComponent from 'App/components/DynamicComponent'
import forceLogin from 'App/helpers/auth/forceLogin'
import withAuthorization from 'App/helpers/auth/withAuthorization'

@forceLogin
@withAuthorization(['admin'])
export default class InformationRoutes extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.header}>
          <Breadcrumbs
            past={{
              '/': 'Inicio'
            }}
          >
            Información
          </Breadcrumbs>
          <br />
          <Tabs
            items={[
              { title: 'Home', path: '/informacion' },
              { title: 'Tarjetas', path: '/informacion/tarjetas' }
            ]}
          />
        </div>
        <Container>
          <Switch>
            <Route path="/informacion/tarjetas" component={DynamicComponent(() => import('./Cards'))} />
            <Route path="/informacion" component={DynamicComponent(() => import('./Home'))} />
          </Switch>
        </Container>
      </div>
    )
  }
}
