import React from 'react'
import styles from './styles.css'

export default class DevelopersHome extends React.Component {
  render () {
    return (
      <div>
        <h3 className={styles.bottomPadded}>
          Sección para desarrolladores e integraciones
        </h3>
        <div className={styles.leftPadded}>
          <h4 className={styles.padded}>
            Registrate como desarrollador y registra tu aplicación:
          </h4>
          <ol>
            <li>
              Regístrate como desarrollador clickeando en la pestaña
              "Desarrolladores"
            </li>
            <li>
              Registra tu aplicación o integración clickeando en la pestaña
              "Aplicaciones"
            </li>
          </ol>
        </div>
      </div>
    )
  }
}
