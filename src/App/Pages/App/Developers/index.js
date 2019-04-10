import React from 'react'
import { Route, Switch } from 'react-router-dom'
import styles from './styles.css'
import Container from 'orionsoft-parts/lib/components/Container'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import DynamicComponent from 'App/components/DynamicComponent'

export default class DevelopersRoutes extends React.Component {
  render () {
    return (
      <div>
        <div className={styles.header}>
          <Tabs
            items={[
              { title: 'Home', path: '/devs' },
              { title: 'Desarrolladores', path: '/devs/registro' },
              { title: 'Aplicaciones', path: '/devs/apps' }
            ]}
          />
        </div>
        <Container>
          <Switch>
            <Route
              path='/devs/registro'
              component={DynamicComponent(() => import('./Developers'))}
            />
            <Route
              path='/devs/apps'
              component={DynamicComponent(() => import('./Apps'))}
            />
            <Route
              path='/devs'
              exact
              component={DynamicComponent(() => import('./Home'))}
            />
          </Switch>
        </Container>
      </div>
    )
  }
}
