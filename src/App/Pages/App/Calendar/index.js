import React from 'react'
import {Route, Switch} from 'react-router-dom'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import Container from 'orionsoft-parts/lib/components/Container'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import CalendarHome from './Home'
import Events from './Events'
import News from './News'

export default class DirectoryRoutes extends React.Component {
  render () {
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
              {title: 'Eventos', path: '/calendario/eventos'},
              {title: 'Noticias', path: '/calendario/noticias'}
            ]}
          />
        </div>
        <Container>
          <Switch>
            <Route path='/calendario/eventos' component={Events} />
            <Route path='/calendario/noticias' component={News} />
            <Route exact path='/calendario' component={CalendarHome} />
          </Switch>
        </Container>
      </div>
    )
  }
}
