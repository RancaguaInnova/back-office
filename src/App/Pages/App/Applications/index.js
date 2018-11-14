import React from 'react'
import {Route, Switch} from 'react-router-dom'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import Container from 'orionsoft-parts/lib/components/Container'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import AppsHome from './Home'
import Apps from './Apps'

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
              {title: 'Aplicaciones', path: '/apps/lista'}
            ]}
          />
        </div>
        <Container>
          <Switch>
            <Route path='/apps/lista' component={Apps} />
            <Route exact path='/apps' component={AppsHome} />
          </Switch>
        </Container>
      </div>
    )
  }
}
