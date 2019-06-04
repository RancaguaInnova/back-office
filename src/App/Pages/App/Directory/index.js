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
@withAuthorization(['admin', 'directory'])
export default class DirectoryRoutes extends React.Component {
  render() {
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
              { title: 'Categorias', path: '/directorio/categorias' },
              { title: 'Departamentos', path: '/directorio/departamentos' },
              { title: 'Funcionarios', path: '/directorio/funcionarios' }
            ]}
          />
        </div>
        <Container>
          <Switch>
            <Route
              path='/directorio/categorias'
              component={DynamicComponent(() => import('./InformationCategory'))}
            />
            <Route
              path='/directorio/departamentos'
              component={DynamicComponent(() => import('./Departments'))}
            />
            <Route
              path='/directorio/funcionarios'
              component={DynamicComponent(() => import('./Officials'))}
            />
            <Route exact path='/directorio' component={DynamicComponent(() => import('./Home'))} />
          </Switch>
        </Container>
      </div>
    )
  }
}
