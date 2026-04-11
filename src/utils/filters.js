export function applyFilters(listings, filters) {
  let result = [...listings]

  if (filters.q) {
    const q = filters.q.toLowerCase()
    result = result.filter(
      (l) =>
        l.address.street.toLowerCase().includes(q) ||
        l.address.city.toLowerCase().includes(q) ||
        l.address.state.toLowerCase().includes(q) ||
        l.address.zip.includes(q) ||
        (l.address.neighborhood && l.address.neighborhood.toLowerCase().includes(q))
    )
  }

  if (filters.minPrice) result = result.filter((l) => l.price >= Number(filters.minPrice))
  if (filters.maxPrice) result = result.filter((l) => l.price <= Number(filters.maxPrice))
  if (filters.minBeds) result = result.filter((l) => l.specs.beds >= Number(filters.minBeds))
  if (filters.minBaths) result = result.filter((l) => l.specs.baths >= Number(filters.minBaths))
  if (filters.minSqft) result = result.filter((l) => l.specs.sqft >= Number(filters.minSqft))
  if (filters.maxSqft) result = result.filter((l) => l.specs.sqft <= Number(filters.maxSqft))

  if (filters.state) result = result.filter((l) => l.address.state === filters.state)

  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    result = result.filter((l) => filters.propertyTypes.includes(l.details.propertyType))
  }

  switch (filters.sortBy) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'sqft_desc':
      result.sort((a, b) => b.specs.sqft - a.specs.sqft)
      break
    default:
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return result
}
