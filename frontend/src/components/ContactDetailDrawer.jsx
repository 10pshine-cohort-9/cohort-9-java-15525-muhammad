import { useEffect, useRef, useState } from 'react'
import { getContact } from '../api/contacts'
import { getApiError } from '../lib/errors'
import { formatDate, getFullName, getInitials } from '../lib/format'

function DetailRow({ term, detail }) {
  const hasDetail = Boolean(detail && String(detail).trim())
  return (
    <div className="drawer-detail-row">
      <dt>{term}</dt>
      <dd>{hasDetail ? detail : '\u2014'}</dd>
    </div>
  )
}

function LabeledList({ title, items, emptyText }) {
  return (
    <section className="drawer-section" aria-label={title}>
      <h3 className="drawer-section-title">{title}</h3>
      {items.length > 0 ? (
        <ul className="drawer-list">
          {items.map((item) => (
            <li className="drawer-list-item" key={item.id}>
              <span className="drawer-tag">{item.label || 'General'}</span>
              <span className="drawer-value">{item.email ?? item.phoneNumber ?? '\u2014'}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="drawer-none">{emptyText}</p>
      )}
    </section>
  )
}

function DetailBody({ contact }) {
  return (
    <div className="drawer-body">
      <dl className="drawer-grid">
        <DetailRow term="First name" detail={contact.firstName} />
        <DetailRow term="Last name" detail={contact.lastName} />
        <DetailRow term="Title" detail={contact.title} />
      </dl>

      <LabeledList
        title="Emails"
        items={contact.emails ?? []}
        emptyText="No email addresses on file."
      />

      <LabeledList
        title="Phone numbers"
        items={contact.phones ?? []}
        emptyText="No phone numbers on file."
      />

      <section className="drawer-section" aria-label="Record metadata">
        <h3 className="drawer-section-title">Record</h3>
        <div className="drawer-detail-row">
          <dt>Created</dt>
          <dd>{formatDate(contact.createdAt) ?? '\u2014'}</dd>
        </div>
        <div className="drawer-detail-row">
          <dt>Last updated</dt>
          <dd>{formatDate(contact.updatedAt) ?? '\u2014'}</dd>
        </div>
      </section>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="drawer-body" aria-hidden="true">
      <div className="skeleton skeleton-bar skeleton-bar-lg" />
      <div className="skeleton skeleton-bar skeleton-bar-sm" />
      <div className="skeleton skeleton-bar" />
      <div className="skeleton skeleton-bar" />
      <div className="skeleton skeleton-bar skeleton-bar-sm" />
    </div>
  )
}

export default function ContactDetailDrawer({ contactId, onClose }) {
  const [contact, setContact] = useState(null)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [settledKey, setSettledKey] = useState(null)
  const closeButtonRef = useRef(null)
  const lastFocusedRef = useRef(null)

  const open = Boolean(contactId)
  const requestKey = `${contactId}|${reloadToken}`
  const loading = open && settledKey !== requestKey

  useEffect(() => {
    if (!contactId) return undefined

    let active = true

    getContact(contactId)
      .then((data) => {
        if (!active) return
        setContact(data)
        setSettledKey(`${contactId}|${reloadToken}`)
      })
      .catch((err) => {
        if (!active) return
        setError(getApiError(err))
        setSettledKey(`${contactId}|${reloadToken}`)
      })

    return () => {
      active = false
    }
  }, [contactId, reloadToken])

  useEffect(() => {
    if (!open) return undefined

    lastFocusedRef.current = document.activeElement
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    return () => {
      window.cancelAnimationFrame(frame)
      lastFocusedRef.current?.focus?.()
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  function handleRetry() {
    setContact(null)
    setError(null)
    setSettledKey(null)
    setReloadToken((token) => token + 1)
  }

  const name = contact ? (getFullName(contact) ?? `Contact #${contact.id}`) : 'Contact details'

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="drawer-header">
          <div className="drawer-heading">
            {contact && (
              <span className="drawer-avatar" aria-hidden="true">
                {getInitials(contact) ?? '?'}
              </span>
            )}
            <div className="drawer-heading-text">
              <h2 className="drawer-title" id="drawer-title">
                {name}
              </h2>
              {contact?.title && <p className="drawer-subtitle">{contact.title}</p>}
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close contact details"
          >
            {'\u00d7'}
          </button>
        </header>

        {loading && <Skeleton />}

        {!loading && error && (
          <div className="drawer-body">
            <div className="empty-state contact-empty" role="status">
              <span className="empty-state-icon" aria-hidden="true">
                !
              </span>
              <h3 className="empty-state-title">Could not load contact</h3>
              <p className="empty-state-text">{error}</p>
              <button type="button" className="btn btn-ghost" onClick={handleRetry}>
                Try again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && contact && <DetailBody contact={contact} />}
      </aside>
    </div>
  )
}