import React from 'react'
import { Route, Switch } from 'react-router-dom'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import Container from 'orionsoft-parts/lib/components/Container'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import DynamicComponent from 'App/components/DynamicComponent'

export default class DirectoryRoutes extends React.Component {
  renderBody () {
    return <h2>Backoffice Rancagua</h2>
  }

  render () {
    return (
      <div>
        <div className={styles.header}>
          <Breadcrumbs>Inicio</Breadcrumbs>
          <br />
          <Tabs
            items={[
              { title: 'Directorio', path: '/directorio' },
              { title: 'Calendario', path: '/calendario' },
              { title: 'Usuarios', path: '/usuarios' },
              { title: 'Aplicaciones', path: '/apps' },
              { title: 'Emargencias', path: '/emergencias' },
              { title: 'Indicadores', path: '/informacion' }
            ]}
          />
        </div>
        <Container>
          <Switch>
            <Route
              path='/directorio'
              component={DynamicComponent(() => import('../Directory'))}
            />
            <Route
              path='/calendario'
              component={DynamicComponent(() => import('../Calendar'))}
            />
            <Route
              path='/usuarios'
              component={DynamicComponent(() => import('../Users'))}
            />
            <Route
              path='/apps'
              component={DynamicComponent(() => import('../Applications'))}
            />
            <Route
              path='/informacion'
              component={DynamicComponent(() => import('../AppInformation'))}
            />
          </Switch>
          {this.renderBody()}
        </Container>
      </div>
    )
  }
}
