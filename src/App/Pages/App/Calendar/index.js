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
@withAuthorization(['admin', 'communications'])
export default class CalendarRoutes extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.header}>
          <Breadcrumbs
            past={{
              '/': 'Inicio'
            }}
          >
            Calendario
          </Breadcrumbs>
          <br />
          <Tabs
            items={[
              { title: 'Home', path: '/calendario' },
              { title: 'Eventos', path: '/calendario/eventos' },
              { title: 'Noticias', path: '/calendario/noticias' }
            ]}
          />
        </div>
        <Container>
          <Switch>
            <Route
              path='/calendario/eventos/crear'
              component={DynamicComponent(() => import('./Events/Create'))}
            />
            <Route
              path='/calendario/eventos/editar/:eventId'
              component={DynamicComponent(() => import('./Events/Update'))}
            />
            <Route
              path='/calendario/eventos'
              component={DynamicComponent(() => import('./Events/List'))}
            />
            <Route
              path='/calendario/noticias'
              component={DynamicComponent(() => import('./News'))}
            />
            <Route exact path='/calendario' component={DynamicComponent(() => import('./Home'))} />
          </Switch>
        </Container>
      </div>
    )
  }
}
