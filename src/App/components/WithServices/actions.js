/**
 * Gets a list of documents
 *
 * @param {String} servicesUrl services or datasource base url
 *
 * @returns {Object} Object with pagination and list of documents
 */
export const getList = async servicesUrl => {
  const request = new Request(servicesUrl, { method: 'GET' })
  try {
    const response = await fetch(request)
    return await response.json()
  } catch (error) {
    throw error
  }
}

/**
 * Gets a single document
 *
 * @param {String} servicesUrl services or datasource base url
 * @param {String} id Id of the requested document
 *
 * @returns {Object} The requested document
 */
export const getSingle = async (servicesUrl, id) => {
  const request = new Request(`${servicesUrl}/${id}`, { method: 'GET' })
  try {
    const response = await fetch(request)
    return await response.json()
  } catch (error) {
    throw error
  }
}

/**
 * Inserts a new document
 *
 * @param {String} servicesUrl services or datasource base url
 * @param {Object} dataObject Documents field/value
 *
 * @returns {Object} Response with the operation result
 */
export const create = async (servicesUrl, dataObject) => {
  const request = new Request(servicesUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataObject)
  })
  try {
    const response = await fetch(request)
    return await response.json()
  } catch (error) {
    throw error
  }
}

/**
 * Update/modify a document
 *
 * @param {String} servicesUrl services or datasource base url
 * @param {String} id Id of the document to be modified
 *
 * @returns {Object} Object with API handlers for each resource/action
 */
export const update = async (servicesUrl, id) => {
  const request = new Request(`${servicesUrl}/${id}`, { method: 'GET' })
  try {
    const response = await fetch(request)
    return await response.json()
  } catch (error) {
    throw error
  }
}

/**
 * Gets a list of documents
 *
 * @param {String} servicesUrl services or datasource base url
 * @param {Object} resources Object of resource names as keys and array of actions as values
 *
 * @returns {Object} Object with API handlers for each resource/action
 */
export const remove = async id => {
  const request = new Request(`${servicesUrl}/${id}`, { method: 'DELETE' })
  try {
    const response = await fetch(request)
    return await response.json()
  } catch (error) {
    throw error
  }
}
