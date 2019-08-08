// GET URL FROM ENV

export const createOrUpdate = async notification => {
  let url = 'http://localhost:3100/notifications'
  if (notification.id) url = url + `/${notification.id}`

  const request = new Request(url, {
    method: notification.id ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(notification)
  })
  try {
    const response = await fetch(request)
    return response.json()
  } catch (error) {
    return error
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
    return error
  }
}
