import api from './client'

export async function getContactsPaginated({ page, size }) {
  const response = await api.get('/contacts/paginated', {
    params: { page, size },
  })
  return response.data
}

export async function getContact(id) {
  const response = await api.get(`/contacts/${id}`)
  return response.data
}

export async function searchContacts(query) {
  const response = await api.get('/contacts/search', {
    params: { query },
  })
  return response.data
}