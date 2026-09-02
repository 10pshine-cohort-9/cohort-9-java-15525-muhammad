const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function formatDate(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return dateFormatter.format(date)
}

export function getFullName(contact) {
  const firstName = contact?.firstName?.trim() ?? ''
  const lastName = contact?.lastName?.trim() ?? ''
  if (!firstName && !lastName) return null
  return `${firstName} ${lastName}`.trim()
}

export function getInitials(contact) {
  const firstName = contact?.firstName?.trim() ?? ''
  const lastName = contact?.lastName?.trim() ?? ''
  if (firstName || lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  return null
}

export function getPrimaryEmail(contact) {
  return contact?.emails?.[0]?.email ?? null
}

export function getPrimaryPhone(contact) {
  return contact?.phones?.[0]?.phoneNumber ?? null
}