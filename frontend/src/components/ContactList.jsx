import { getFullName, getInitials, getPrimaryEmail, getPrimaryPhone } from '../lib/format'
import { MagnifierIcon } from './icons'

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'title', label: 'Title' },
  { key: 'email', label: 'Primary email' },
  { key: 'phone', label: 'Primary phone' },
]

function SkeletonRows() {
  return (
    <div className="contact-list" aria-hidden="true">
      <div className="contact-list-head">
        {COLUMNS.map((column) => (
          <span key={column.key}>{column.label}</span>
        ))}
      </div>
      <div className="contact-rows">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            className="contact-row contact-row-skeleton"
            style={{ '--index': index }}
            key={index}
          >
            <span className="skeleton skeleton-avatar" />
            <span className="skeleton skeleton-bar skeleton-bar-md" />
            <span className="skeleton skeleton-bar" />
            <span className="skeleton skeleton-bar skeleton-bar-sm" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ContactList({
  contacts,
  loading,
  error,
  isSearching,
  debouncedQuery,
  onSelect,
  onRetry,
  onClearSearch,
}) {
  if (loading && contacts.length === 0) {
    return <SkeletonRows />
  }

  if (error && contacts.length === 0) {
    return (
      <div className="empty-state contact-empty" role="status">
        <span className="empty-state-icon" aria-hidden="true">
          !
        </span>
        <h2 className="empty-state-title">Could not load contacts</h2>
        <p className="empty-state-text">{error}</p>
        <button type="button" className="btn btn-ghost" onClick={onRetry}>
          Try again
        </button>
      </div>
    )
  }

  if (contacts.length === 0) {
    if (isSearching) {
      return (
        <div className="empty-state contact-empty">
          <span className="empty-state-icon" aria-hidden="true">
            <MagnifierIcon />
          </span>
          <h2 className="empty-state-title">No matching contacts</h2>
          <p className="empty-state-text">
            Nothing matches &ldquo;{debouncedQuery}&rdquo;. Try a different first or last
            name.
          </p>
          <button type="button" className="btn btn-ghost" onClick={onClearSearch}>
            Clear search
          </button>
        </div>
      )
    }

    return (
      <div className="empty-state contact-empty">
        <span className="empty-state-icon" aria-hidden="true">
          +
        </span>
        <h2 className="empty-state-title">No contacts yet</h2>
        <p className="empty-state-text">
          Contacts you add will appear here. Use the search field above to find a contact
          by first or last name.
        </p>
      </div>
    )
  }

  return (
    <div className="contact-list" aria-busy={loading || undefined}>
      <div className="contact-list-head" aria-hidden="true">
        {COLUMNS.map((column) => (
          <span key={column.key}>{column.label}</span>
        ))}
      </div>
      <ul className="contact-rows">
        {contacts.map((contact) => {
          const name = getFullName(contact) ?? 'Unnamed contact'
          const initials = getInitials(contact)
          return (
            <li key={contact.id}>
              <button
                type="button"
                className="contact-row"
                onClick={() => onSelect(contact)}
              >
                <span className="contact-cell contact-cell-name" data-label="Name">
                  <span className="contact-avatar" aria-hidden="true">
                    {initials ?? '?'}
                  </span>
                  <span className="contact-name">{name}</span>
                </span>
                <span className="contact-cell" data-label="Title">
                  {contact.title || '\u2014'}
                </span>
                <span className="contact-cell contact-cell-email" data-label="Primary email">
                  {getPrimaryEmail(contact) ?? '\u2014'}
                </span>
                <span className="contact-cell contact-cell-phone" data-label="Primary phone">
                  {getPrimaryPhone(contact) ?? '\u2014'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}