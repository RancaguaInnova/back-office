import React from 'react'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

import styles from './styles.css'

@withMessage
export default class WarningFrame extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    warningMessage: PropTypes.string
  }

  static defaultProps = {
    warningMessage: 'Cambios en estos campos generan efectos importantes'
  }

  render() {
    return (
      <div className={styles.frame}>
        <h4 className={styles.warningHeader}>ATENCIÓN:</h4>
        <p className={styles.warningMessage}>{this.props.warningMessage}</p>
        {this.props.children}
      </div>
    )
  }
}
