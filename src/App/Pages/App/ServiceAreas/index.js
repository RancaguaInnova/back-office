import React from 'react'
import {Route, Switch} from 'react-router-dom'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import Container from 'orionsoft-parts/lib/components/Container'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import AreasHome from './Home'
import Areas from './Areas'

export default class ServiceAreasRoutes extends React.Component {
  render () {
    return (
      <div>
        <div className={styles.header}>
          <Breadcrumbs
            past={{
              '/': 'Inicio'
            }}
          >
            Areas de Servicio
          </Breadcrumbs>
          <br />
          <Tabs
            items={[
              {title: 'Home', path: '/areas'}
              {title: 'Areas de Servicio', path: '/areas/lista'}
            ]}
          />
        </div>
        <Container>
          <Switch>
            <Route path='/areas/lista' component={Areas} />
            <Route exact path='/areas' component={AreasHome} />
          </Switch>
        </Container>
      </div>
    )
  }
}
