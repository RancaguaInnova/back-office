import React from 'react'
import { Route, Switch } from 'react-router-dom'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import Container from 'orionsoft-parts/lib/components/Container'
import DynamicComponent from 'App/components/DynamicComponent'
import Tabs from 'orionsoft-parts/lib/components/Tabs'

export default class ApplicationsRoutes extends React.Component {
  render () {
    return (
      <div>
        <div className={styles.header}>
          <Breadcrumbs
            past={{
              '/': 'Inicio'
            }}
          >
            Aplicaciones
          </Breadcrumbs>
          <br />
          <Tabs
            items={[
              { title: 'Home', path: '/apps' },
              { title: 'Aplicaciones', path: '/apps/lista' },
              { title: 'Registro', path: '/apps/registro' }
            ]}
          />
        </div>
        <Container>
          <Switch>
            <Route
              path='/apps/lista'
              component={DynamicComponent(() => import('./List'))}
            />
            <Route
              path='/apps/crear'
              component={DynamicComponent(() => import('./Create'))}
            />
            <Route
              path='/apps/editar/:applicationId'
              component={DynamicComponent(() => import('./Update'))}
            />
            <Route
              exact
              path='/apps'
              component={DynamicComponent(() => import('./Home'))}
            />
          </Switch>
        </Container>
      </div>
    )
  }
}
