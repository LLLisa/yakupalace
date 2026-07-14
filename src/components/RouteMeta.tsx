import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageMeta } from '../features/seo/pageMeta'

/**
 * Keeps the browser tab title in sync with the current route during client-side
 * navigation. Crawlers read the per-route <title> baked into the prerendered
 * HTML (see entry-server.tsx); this only covers the SPA nav that happens after
 * hydration. Renders nothing.
 */
export function RouteMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = getPageMeta(pathname).title
  }, [pathname])
  return null
}
