/**
 * Single gateway for HTTP calls. All network I/O for the live API goes through here.
 * Spring Security: session cookies + XSRF-TOKEN cookie read for X-XSRF-TOKEN header.
 */

export class ApiError extends Error {
  status: number
  body?: string

  constructor(message: string, status: number, body?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

function getBaseUrl(): string {
  const b = import.meta.env.VITE_API_BASE_URL ?? ''
  return b.replace(/\/$/, '')
}

export function buildUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${getBaseUrl()}${p}`
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

function csrfHeaders(method: string): Record<string, string> {
  const m = method.toUpperCase()
  if (['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(m)) return {}
  const token = readCookie('XSRF-TOKEN')
  return token ? { 'X-XSRF-TOKEN': token } : {}
}

export async function warmupCsrfCookie(): Promise<void> {
  await fetch(buildUrl('/login'), {
    method: 'GET',
    credentials: 'include',
  })
}

export type HttpRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function httpRequest(
  method: string,
  path: string,
  init: HttpRequestInit = {},
): Promise<Response> {
  const { body, headers: extraHeaders, ...rest } = init
  const headers: Record<string, string> = {
    ...csrfHeaders(method),
    ...(extraHeaders as Record<string, string>),
  }

  let reqBody: BodyInit | undefined
  if (body !== undefined && body !== null) {
    if (typeof body === 'string' || body instanceof FormData) {
      reqBody = body
    } else {
      headers['Content-Type'] = 'application/json'
      reqBody = JSON.stringify(body)
    }
  }

  return fetch(buildUrl(path), {
    ...rest,
    method,
    credentials: 'include',
    headers,
    body: reqBody,
  })
}

export async function parseJsonOrEmpty<T>(res: Response): Promise<T | null> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as T
  } catch {
    throw new ApiError('Invalid JSON response', res.status, text)
  }
}

export async function requestJson<T>(method: string, path: string, init: HttpRequestInit = {}): Promise<T> {
  const res = await httpRequest(method, path, init)
  if (!res.ok) {
    const text = await res.text()
    throw new ApiError(text || res.statusText, res.status, text)
  }
  const data = await parseJsonOrEmpty<T>(res)
  if (data === null && res.status !== 204) {
    throw new ApiError('Empty response', res.status)
  }
  return data as T
}
