const BASE = import.meta.env.VITE_API_URL || ''
const ADMIN_URL = `${BASE}/api/admin`
const COMMERCIAL_URL = `${BASE}/api/commercials`
const AUTH_URL = `${BASE}/api/auth`

function getToken() {
  return localStorage.getItem('token')
}

async function request(url, options = {}) {
  const token = getToken()
  const headers = { ...options.headers }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Only set Content-Type to JSON if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    await new Promise(res => setTimeout(res, 1200))
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `API error: ${response.status}`)
  }

  await new Promise(res => setTimeout(res, 1200))
  return response.json()
}

function createClient(baseURL) {
  return {
    get: (endpoint, options = {}) => request(`${baseURL}${endpoint}`, options),

    post: (endpoint, data, options = {}) =>
      request(`${baseURL}${endpoint}`, {
        method: 'POST',
        body: data instanceof FormData ? data : JSON.stringify(data),
        ...options
      }),
    put: (endpoint, data, options = {}) =>
      request(`${baseURL}${endpoint}`, {
        method: 'PUT',
        body: data instanceof FormData ? data : JSON.stringify(data),
        ...options
      }),
    patch: (endpoint, data, options = {}) =>
      request(`${baseURL}${endpoint}`, {
        method: 'PATCH',
        body: data instanceof FormData ? data : JSON.stringify(data),
        ...options
      }),
    delete: (endpoint, options = {}) =>
      request(`${baseURL}${endpoint}`, { method: 'DELETE', ...options })
  }
}

export const adminApi = createClient(ADMIN_URL)
export const commercialApi = createClient(COMMERCIAL_URL)
export const authApi = createClient(AUTH_URL)