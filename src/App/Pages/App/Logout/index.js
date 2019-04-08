import React from 'react'
import MaterialIcon, { colorPalette } from 'material-icons-react'
import './styles.css'
import logout from 'App/helpers/auth/logout'
import PropTypes from 'prop-types'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

export default class Logout extends React.Component {
  static propTypes = {
    history: PropTypes.object
  }

  out() {
    confirmAlert({
      title: 'Salir',
      message: '¿Esta seguro que desea cerrar sesión?',
      buttons: [
        {
          label: 'Si',
          onClick: () => {
            this.OkLogout()
          }
        },
        {
          label: 'No'
        }
      ]
    })
  }
  async OkLogout() {
    await logout()
    this.props.history.push('/login')
  }

  render() {
    return (
      <div>
        <footer className='footer'>
          <button onClick={() => this.out()} style={{ marginRight: 20 }}>
            <MaterialIcon icon='logout' size='tiny' color={colorPalette.red._800} />
          </button>
        </footer>
      </div>
    )
  }
}
