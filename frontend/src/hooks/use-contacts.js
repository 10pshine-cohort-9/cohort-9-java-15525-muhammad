import { useCallback, useEffect, useRef, useState } from 'react'
import { getContactsPaginated, searchContacts } from '../api/contacts'
import { getApiError } from '../lib/errors'
import { useDebouncedValue } from './use-debounced-value'

export const CONTACTS_PAGE_SIZE = 8
const SEARCH_DELAY = 400

export function useContacts() {
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(0)
  const [size] = useState(CONTACTS_PAGE_SIZE)
  const [reloadToken, setReloadToken] = useState(0)

  const debouncedQuery = useDebouncedValue(searchInput.trim(), SEARCH_DELAY)
  const isSearching = debouncedQuery.length > 0

  const [contacts, setContacts] = useState([])
  const [pageData, setPageData] = useState(null)
  const [error, setError] = useState(null)
  const [settledKey, setSettledKey] = useState(null)
  const requestIdRef = useRef(0)

  const requestKey = `${debouncedQuery}|${page}|${reloadToken}`
  const loading = settledKey !== requestKey

  useEffect(() => {
    const requestId = ++requestIdRef.current

    const run = async () => {
      try {
        if (isSearching) {
          const results = await searchContacts(debouncedQuery)
          if (requestIdRef.current !== requestId) return
          setContacts(results)
          setPageData(null)
        } else {
          const data = await getContactsPaginated({ page, size })
          if (requestIdRef.current !== requestId) return
          setContacts(data.content ?? [])
          setPageData({
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            first: data.first,
            last: data.last,
            number: data.number,
            size: data.size,
          })
        }
        setError(null)
        setSettledKey(requestKey)
      } catch (err) {
        if (requestIdRef.current !== requestId) return
        setError(getApiError(err))
        setSettledKey(requestKey)
      }
    }

    run()
  }, [debouncedQuery, isSearching, page, reloadToken, requestKey, size])

  const changeSearch = useCallback((value) => {
    setSearchInput(value)
    setPage(0)
  }, [])

  const goToPage = useCallback(
    (next) => {
      const max = Math.max(0, (pageData?.totalPages ?? 0) - 1)
      setPage(Math.min(Math.max(next, 0), max))
    },
    [pageData],
  )

  const nextPage = useCallback(() => goToPage(page + 1), [goToPage, page])

  const prevPage = useCallback(() => goToPage(page - 1), [goToPage, page])

  const clearSearch = useCallback(() => changeSearch(''), [changeSearch])

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  return {
    contacts,
    page,
    totalElements: pageData?.totalElements ?? null,
    totalPages: pageData?.totalPages ?? null,
    loading,
    error,
    isSearching,
    searchInput,
    debouncedQuery,
    changeSearch,
    clearSearch,
    goToPage,
    nextPage,
    prevPage,
    reload,
  }
}