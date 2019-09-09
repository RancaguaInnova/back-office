import React, { useState } from 'react'
import forEach from 'lodash/forEach'

/**
 * Creates an API to interact with given actions on the given resources
 *
 * @param {String} baseUrl services or datasource base url
 * @param {Object} resources Object of resource names as keys and array of actions as values
 *                           to add handlers for
 *
 * @returns {Object} Object with API handlers for each resource/action
 */
export default (baseUrl, resources) => {
  const [services, setServices] = useState({})
  forEach(resources, (resourceName, actionsList) => {
    const servicesUrl = `${baseUrl}/${resourceName}`
    const resourceApi = Object.assign({}, services, { [resourceName]: {} })
    actionsList.forEach(actionName => {
      switch (action) {
        case 'list':
          resourceApi[resourceName]['list'] = getList
          break
        case 'get':
          resourceApi[resourceName]['get'] = getSingle
          break
        case 'create':
          this.services[resourceName]['create'] = create
          break
        case 'update':
          this.services[resourceName]['update'] = update
          break
        case 'delete':
        case 'remove':
          this.services[resourceName][action] = remove
          break
        default:
          throw Error(`Invalid action ${action} passed to withServices`)
      }
    })
    setServices(resourceApi)
    return resourceApi
  })
