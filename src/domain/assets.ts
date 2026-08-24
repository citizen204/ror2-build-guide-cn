export function assetUrl(
  path: string,
  configuredBaseUrl = import.meta.env.BASE_URL,
): string {
  const baseUrl = configuredBaseUrl.endsWith('/')
    ? configuredBaseUrl
    : `${configuredBaseUrl}/`

  return `${baseUrl}${path.replace(/^\/+/, '')}`
}
