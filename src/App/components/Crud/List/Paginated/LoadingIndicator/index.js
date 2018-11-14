import React from 'react'
import Loading from 'orionsoft-parts/lib/components/Loading'

export default class PaginatedLoading extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className="paginated-loading">
        <Loading color="#ccc" />
      </div>
    )
  }
}
