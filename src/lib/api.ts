const AUTH_URL = 'https://functions.poehali.dev/5bad04bc-edd3-430c-81da-65caa1d3433d'
const TOUR_REQUEST_URL = 'https://functions.poehali.dev/7fe46ad5-57dc-4386-9438-1862433b7606'
const PROFILE_URL = 'https://functions.poehali.dev/dcb94154-9322-4bfc-bf34-5266ebefdc0a'

function getToken() {
  return localStorage.getItem('delta_token') || ''
}

function authHeaders() {
  return { 'Content-Type': 'application/json', 'X-Session-Token': getToken() }
}

export async function register(data: { email: string; password: string; first_name: string; last_name: string; phone: string }) {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'register', ...data }),
  })
  const text = await res.text()
  const json = typeof JSON.parse(text) === 'string' ? JSON.parse(JSON.parse(text)) : JSON.parse(text)
  if (!res.ok) throw new Error(json.error || 'Ошибка регистрации')
  return json
}

export async function login(email: string, password: string) {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', email, password }),
  })
  const text = await res.text()
  const json = typeof JSON.parse(text) === 'string' ? JSON.parse(JSON.parse(text)) : JSON.parse(text)
  if (!res.ok) throw new Error(json.error || 'Ошибка входа')
  return json
}

export async function getMe() {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ action: 'me' }),
  })
  const text = await res.text()
  const json = typeof JSON.parse(text) === 'string' ? JSON.parse(JSON.parse(text)) : JSON.parse(text)
  if (!res.ok) throw new Error(json.error || 'Не авторизован')
  return json
}

export async function updateProfile(data: Record<string, string>) {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ action: 'update', ...data }),
  })
  const text = await res.text()
  return typeof JSON.parse(text) === 'string' ? JSON.parse(JSON.parse(text)) : JSON.parse(text)
}

export async function logout() {
  await fetch(AUTH_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ action: 'logout' }),
  })
  localStorage.removeItem('delta_token')
  localStorage.removeItem('delta_user')
}

export async function submitTourRequest(data: Record<string, unknown>) {
  const res = await fetch(TOUR_REQUEST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const text = await res.text()
  const json = typeof JSON.parse(text) === 'string' ? JSON.parse(JSON.parse(text)) : JSON.parse(text)
  if (!res.ok) throw new Error(json.error || 'Ошибка отправки')
  return json
}

export async function getMyRequests() {
  const res = await fetch(PROFILE_URL, {
    method: 'GET',
    headers: authHeaders(),
  })
  const text = await res.text()
  const json = typeof JSON.parse(text) === 'string' ? JSON.parse(JSON.parse(text)) : JSON.parse(text)
  if (!res.ok) throw new Error(json.error || 'Ошибка')
  return json
}
