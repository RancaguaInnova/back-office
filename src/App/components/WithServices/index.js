import React, { Component } from 'react'

/**
 * Composes a Component with the given actions on the given resources
 *
 * @param {Class} WrappedComponent The component to add microservices
 * @param {String} baseUrl services or datasource base url
 * @param {Array} resources List of resources/collections to add handlers to
 * @param {Array} actions List of action to be performed on the resources (maps to HTTP verbs)
 *
 * @returns {A Composed component with action handlers for each resource}
 */
export default (WrappedComponent, baseUrl, resources, actions) => {
  return class WithServices extends Component {
    constructor (props) {
      super(props)
      this.services = {}
      resources.forEach(resource => {
        this.services[resource] = {}
        const servicesUrl = `${baseUrl}/${resource}`
        actions.forEach(action => {
          switch (action) {
            case 'list':
              this.services[resource]['list'] = async () => {
                const request = new Request(servicesUrl, {
                  method: 'GET'
                })
                try {
                  const response = await fetch(request)
                  return response.json()
                } catch (error) {
                  throw error
                }
              }
              break
            case 'get':
              this.services[resource]['get'] = async id => {
                const request = new Request(`${servicesUrl}/${id}`, {
                  method: 'GET'
                })
                try {
                  const response = await fetch(request)
                  return response.json()
                } catch (error) {
                  throw error
                }
              }
              break
            case 'create':
              this.services[resource]['create'] = async dataObject => {
                const request = new Request(servicesUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(dataObject)
                })
                try {
                  const response = await fetch(request)
                  return response.json()
                } catch (error) {
                  throw error
                }
              }
              break
            case 'update':
              this.services[resource]['update'] = async (dataObject, id) => {
                const request = new Request(`${servicesUrl}/${id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(dataObject)
                })
                try {
                  const response = await fetch(request)
                  return response.json()
                } catch (error) {
                  throw error
                }
              }
              break
            case 'delete':
            case 'remove':
              this.services[resource][action] = async id => {
                const request = new Request(`${servicesUrl}/${id}`, {
                  method: 'DELETE'
                })
                try {
                  const response = await fetch(request)
                  return response.json()
                } catch (error) {
                  throw error
                }
              }
              break
            default:
              throw Error(`Invalid action ${action} passed to WithServices HoC`)
          }
        })
      })
    }
    render () {
      return <WrappedComponent services={this.services} {...this.props} />
    }
  }
}
