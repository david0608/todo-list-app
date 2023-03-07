export function request(path: string, option: RequestInit) {
  return fetch(`http://127.0.0.1:8000${path}`, option)
}

export function postRequest(path: string, body: Object, option?: RequestInit) {
  return request(path, { method: 'POST', body: JSON.stringify(body), ...option })
}

export function getRequest(path: string, option: RequestInit) {
  return request(path, { method: 'GET', ...option })
}

export function patchRequest(path: string, option: RequestInit) {
  return request(path, { method: 'PATCH', ...option })
}

export function deleteRequest(path: string, option: RequestInit) {
  return request(path, { method: 'DELETE', ...option })
}
