export function formatPrice(n) {
  return '$' + n.toLocaleString('en-US')
}

export function formatPriceShort(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'K'
  return '$' + n
}

export function formatSqft(n) {
  return n.toLocaleString('en-US') + ' sq ft'
}

export function formatDaysOnMarket(n) {
  if (n <= 3) return 'New'
  if (n === 1) return '1 day'
  return n + ' days'
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatPhone(s) {
  return s
}
