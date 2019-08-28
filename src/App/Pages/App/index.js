import React from 'react'
import styles from './styles.css'
import { Route, Switch } from 'react-router-dom'
import DynamicComponent from 'App/components/DynamicComponent'
import forceLogin from 'App/helpers/auth/forceLogin'
import Logout from './Logout/'
import PropTypes from 'prop-types'

@forceLogin
export default class MainHome extends React.Component {
  static propTypes = {
    history: PropTypes.object
  }
  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route
            path="/settings"
            component={DynamicComponent(() => import('./Settings'))}
          />
          <Route
            path="/directorio"
            component={DynamicComponent(() => import('./Directory'))}
          />
          <Route
            path="/calendario"
            component={DynamicComponent(() => import('./Calendar'))}
          />
          <Route
            path="/usuarios"
            component={DynamicComponent(() => import('./Users'))}
          />
          <Route
            path="/apps"
            component={DynamicComponent(() => import('./Applications'))}
          />
          <Route
            path="/devs"
            component={DynamicComponent(() => import('./Developers'))}
          />
          <Route
            path="/emergencias"
            component={DynamicComponent(() => import('./Emergencies'))}
          />
          <Route
            path="/informacion"
            component={DynamicComponent(() => import('./AppInformation'))}
          />
          <Route
            path="/no-autorizado"
            component={DynamicComponent(() =>
              import('../../components/NotAuthorized')
            )}
          />
          <Route
            path="/"
            exact
            component={DynamicComponent(() => import('./Home'))}
          />
        </Switch>
        <Logout history={this.props.history} />
      </div>
    )
  }
}
