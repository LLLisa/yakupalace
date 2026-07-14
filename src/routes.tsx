import type { RouteObject } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CalculatorPage } from './pages/CalculatorPage'
import { ArticlesPage } from './pages/ArticlesPage'
import { ArticlePage } from './pages/ArticlePage'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { NotFoundPage } from './pages/NotFoundPage'

// Single source of truth for the route tree. Consumed by the browser router
// (router.tsx, createBrowserRouter) and the build-time prerender's static
// handler (entry-server.tsx, createStaticHandler) so both render identical
// output.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'calculator', element: <CalculatorPage /> },
      { path: 'learn', element: <ArticlesPage /> },
      { path: 'learn/:slug', element: <ArticlePage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:slug', element: <BlogPostPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
