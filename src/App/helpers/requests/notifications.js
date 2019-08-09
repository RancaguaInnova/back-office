// GET URL FROM ENV

export const create = async notification => {
  let url = 'http://localhost:3100/notifications'

  const request = new Request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(notification)
  })
  try {
    const response = await fetch(request)
    return response.json()
  } catch (error) {
    throw error
  }
}

export const update = async notification => {
  let url = `http://localhost:3100/notifications/${notification.id}`
  delete notification.id

  const request = new Request(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ notification })
  })
  try {
    const response = await fetch(request)
    return response.json()
  } catch (error) {
    throw error
  }
}

export const get = async notificationId => {
  const request = new Request(
    `http://localhost:3100/notifications/${notificationId}`
  )
  try {
    const response = await fetch(request)
    return response.json()
  } catch (error) {
    throw error
  }
}
