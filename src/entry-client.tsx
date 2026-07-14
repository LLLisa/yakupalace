import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './index.css'

// Hydrates the markup prerendered by entry-server.tsx. createBrowserRouter
// (in router.ts) automatically picks up window.__staticRouterHydrationData
// emitted by the static render, so the two trees line up.
hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
