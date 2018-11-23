import React from 'react'
import { Route, Switch } from 'react-router-dom'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import Container from 'orionsoft-parts/lib/components/Container'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import DirectoryHome from './Home'
import Departments from './Departments'
import Officials from './Officials'
import ServiceAreas from './ServiceAreas'

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
            Directorio
          </Breadcrumbs>
          <br />
          <Tabs
            items={[
              { title: 'Home', path: '/directorio' },
              { title: 'Areas', path: '/directorio/areas' },
              { title: 'Departamentos', path: '/directorio/departamentos' },
              { title: 'Funcionarios', path: '/directorio/funcionarios' }
            ]}
          />
        </div>
        <Container>
          <Switch>
            <Route path='/directorio/areas' component={ServiceAreas} />
            <Route path='/directorio/departamentos' component={Departments} />
            <Route path='/directorio/funcionarios' component={Officials} />
            <Route exact path='/directorio' component={DirectoryHome} />
          </Switch>
        </Container>
      </div>
    )
  }
}
