import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import UserFragments from 'App/fragments/User'
import includes from 'lodash/includes'
import Button from 'orionsoft-parts/lib/components/Button'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import LoadingSection from 'App/components/LoadingSection'
import styles from './styles.css'

@withMessage
@withGraphQL(gql`
  query getUser($userId: ID!) {
    user(userId: $userId) {
      _id
      email
      roles
      ...Profile
    }
  }
  ${UserFragments.Profile}
`)
export default class LinkToAccount extends React.Component {
  static propTypes = {
    userId: PropTypes.string,
    user: PropTypes.object,
    showMessage: PropTypes.func,
    linkAccountData: PropTypes.func,
    loading: PropTypes.boolean
  }

  @autobind
  linkToAccount() {
    let { user: { roles } } = this.props
    let { user } = this.props
    if (!includes(roles, 'developer')) {
      this.props.showMessage(
        `Debes estar logueado en una cuenta de tipo "Desarrollador"`
      )
    } else {
      this.props.showMessage(
        `Enlazando aplicación con cuenta ${this.props.user.email}`
      )
      let developerInfo = Object.assign({}, user.profile, { email: user.email })
      delete developerInfo.identifier
      delete developerInfo.educationalLevel
      this.props.linkAccountData(developerInfo)
    }
  }

  render() {
    let { userId } = this.props
    console.log('this.props.userId:', this.props.userId)
    if (!userId || this.props.loading) {
      return <LoadingSection top="asdf" />
    }
    return (
      <Button
        className={styles.linkButton}
        primary
        onClick={this.linkToAccount}
        disabled={!this.props.userId}
      >
        Enlazar a mi cuenta
      </Button>
    )
  }
}
