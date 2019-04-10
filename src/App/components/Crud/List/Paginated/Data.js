import React from 'react'
import Pagination from './Pagination'
import Table from './Table'
import Message from './Message'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'

export default class Data extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    fields: PropTypes.array,
    onPress: PropTypes.func,
    sortBy: PropTypes.string,
    sortType: PropTypes.string,
    setSort: PropTypes.func,
    debouncing: PropTypes.bool,
    selectedItemId: PropTypes.string,
    loadingComponent: PropTypes.any,
    footer: PropTypes.any
  }

  state = {}

  componentDidMount() {
    this.setState(this.props)
  }

  static getDerivedStateFromProps(props, state) {
    if (isEmpty(state)) {
      return {props}
    }
    if (!props.data.data) {
      return
    }
    if (
      JSON.stringify(props.data.data.result) !== JSON.stringify(state.props.data.data.result) ||
      JSON.stringify(props.data.variables) !== JSON.stringify(state.props.data.variables)
    ) {
      return {props}
    }
  }

  renderLoading() {
    if (!this.props.loadingComponent) return <span />
    return <this.props.loadingComponent />
  }

  renderNotFound() {
    return <Message message="No se encontraron datos" />
  }

  renderError() {
    const error = this.props.data.error
    console.error('Error in paginated', this.props.data)
    if (!error) return
    let message = error.message
    if (error && error.graphQLErrors && error.graphQLErrors[0]) {
      message = error.graphQLErrors[0].message
    }
    return <Message message={message} />
  }

  renderTable() {
    if (this.props.debouncing) return this.renderLoading()
    if (this.props.data.loading) {
      this.props.data.refetch()
      return this.renderLoading()
    }
    if (!this.props.data.data.result.items || this.props.data.data.result.items.length === 0) {
      return this.renderNotFound()
    }
    return (
      <div ref="items" className="paginated-table-items">
        <Table
          sortBy={this.props.sortBy}
          sortType={this.props.sortType}
          setSort={this.props.setSort}
          onSelect={this.props.onPress}
          selectedItemId={this.props.selectedItemId}
          items={this.props.data.data.result.items}
          fields={this.props.fields}
          footer={this.props.footer}
        />
      </div>
    )
  }

  render() {
    if (!this.state || isEmpty(this.state)) return null
    if (this.state.props.data.error) {
      return this.renderError()
    } else if (!this.state.props.data.data.result) {
      if (
        (this.state.props.data.networkStatus === 1 &&
          Object.keys(this.state.props.data).length === 10) ||
        this.state.props.data.networkStatus === 2
      ) {
        return this.renderLoading()
      }
      return ''
    }
    return (
      <div className="paginated-container box">
        {this.renderTable()}
        <Pagination {...this.props} result={this.state.props.data.data.result} />
      </div>
    )
  }
}
