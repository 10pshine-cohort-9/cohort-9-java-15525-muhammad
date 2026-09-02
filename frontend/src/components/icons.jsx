export function MagnifierIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12.75 12.75 L17 17" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}