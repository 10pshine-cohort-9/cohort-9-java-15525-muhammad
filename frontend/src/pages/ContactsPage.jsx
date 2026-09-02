import { useState } from 'react'
import ContactList from '../components/ContactList'
import Pagination from '../components/Pagination'
import ContactDetailDrawer from '../components/ContactDetailDrawer'
import { MagnifierIcon } from '../components/icons'
import { useContacts } from '../hooks/use-contacts'

export default function ContactsPage() {
  const {
    contacts,
    page,
    totalElements,
    totalPages,
    loading,
    error,
    isSearching,
    searchInput,
    debouncedQuery,
    changeSearch,
    clearSearch,
    goToPage,
    reload,
  } = useContacts()

  const [selectedContactId, setSelectedContactId] = useState(null)

  function handleSelect(contact) {
    setSelectedContactId(contact.id)
  }

  let countLabel
  if (error) {
    countLabel = 'Could not load contacts'
  } else if (isSearching) {
    const matches = `${contacts.length} ${contacts.length === 1 ? 'contact matches' : 'contacts match'}`
    countLabel = `Search \u201c${debouncedQuery}\u201d \u00b7 ${matches}`
  } else if (totalElements === null) {
    countLabel = 'Loading contacts...'
  } else {
    countLabel = `${totalElements} ${totalElements === 1 ? 'contact' : 'contacts'}`
  }

  return (
    <>
      <div className="page-head contacts-head">
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="page-desc">{countLabel}</p>
        </div>
      </div>

      <div className="contacts-toolbar">
        <div className="search">
          <span className="search-icon" aria-hidden="true">
            <MagnifierIcon />
          </span>
          <input
            type="search"
            className="input search-input"
            placeholder="Search by first or last name"
            value={searchInput}
            onChange={(event) => changeSearch(event.target.value)}
            aria-label="Search contacts by first or last name"
            spellCheck="false"
            autoComplete="off"
          />
          {searchInput && (
            <button
              type="button"
              className="search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              {'\u00d7'}
            </button>
          )}
        </div>
      </div>

      <ContactList
        contacts={contacts}
        loading={loading}
        error={error}
        isSearching={isSearching}
        debouncedQuery={debouncedQuery}
        onSelect={handleSelect}
        onRetry={reload}
        onClearSearch={clearSearch}
      />

      {!isSearching && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={goToPage}
          disabled={loading}
        />
      )}

      <ContactDetailDrawer
        key={selectedContactId}
        contactId={selectedContactId}
        onClose={() => setSelectedContactId(null)}
      />
    </>
  )
}