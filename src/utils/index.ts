export function createPageUrl(pageName: string) {
  const normalizedName = pageName.trim().replace(/\s+/g, '')
  if (!normalizedName) {
    return '/'
  }

  return `/${normalizedName}`
}
