export function createHashRouteHandler(to: string) {
  return () => {
    location.href = `${location.origin}#${to}`
  }
}
