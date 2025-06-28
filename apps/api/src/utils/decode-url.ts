export function decodeAndCleanOAuthUrl(url: string) {
  const [base, queryString] = url.split('?')
  const params = new URLSearchParams(queryString)
  const cleanParams = []

  for (const [key, value] of params.entries()) {
    const cleanedValue = decodeURIComponent(value)
      .replace(/^"|"$/g, '')
      .replace(/,$/, '')
    cleanParams.push(`${key}=${encodeURIComponent(cleanedValue)}`)
  }

  return `${base}?${cleanParams.join('&')}`
}
