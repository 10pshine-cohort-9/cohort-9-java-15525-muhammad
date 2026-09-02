function buildPages(current, totalPages) {
  const maxVisible = 7
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, value) => ({ value }))
  }

  const left = Math.max(1, current - 1)
  const right = Math.min(totalPages - 2, current + 1)

  const pages = [{ value: 0 }]
  if (left > 1) pages.push({ value: null, isGap: true })
  for (let value = left; value <= right; value += 1) {
    pages.push({ value })
  }
  if (right < totalPages - 2) pages.push({ value: null, isGap: true })
  pages.push({ value: totalPages - 1 })
  return pages
}

export default function Pagination({ page, totalPages, onPageChange, disabled }) {
  if (!totalPages || totalPages <= 1) return null

  const items = buildPages(page, totalPages)
  const prevDisabled = disabled || page === 0
  const nextDisabled = disabled || page >= totalPages - 1

  return (
    <nav className="pagination" aria-label="Contact page navigation">
      <span className="pagination-count mono">
        Page {page + 1} of {totalPages}
      </span>
      <div className="pagination-controls">
        <button
          type="button"
          className="btn-pager"
          disabled={prevDisabled}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          {'\u2190'}
        </button>
        {items.map((item, index) =>
          item.isGap ? (
            <span className="pager-gap" key={`gap-${index}`} aria-hidden="true">
              {'\u2026'}
            </span>
          ) : (
            <button
              type="button"
              key={item.value}
              className={`btn-pager${item.value === page ? ' btn-pager-active' : ''}`}
              disabled={disabled || item.value === page}
              aria-current={item.value === page ? 'page' : undefined}
              aria-label={`Page ${item.value + 1}`}
              onClick={() => onPageChange(item.value)}
            >
              {item.value + 1}
            </button>
          ),
        )}
        <button
          type="button"
          className="btn-pager"
          disabled={nextDisabled}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          {'\u2192'}
        </button>
      </div>
    </nav>
  )
}