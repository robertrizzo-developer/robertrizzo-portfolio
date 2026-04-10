export function mockDelay(): Promise<void> {
  const ms = 200 + Math.floor(Math.random() * 400)
  return new Promise((resolve) => setTimeout(resolve, ms))
}
