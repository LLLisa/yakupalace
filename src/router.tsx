import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CalculatorPage } from './pages/CalculatorPage'
import { ArticlesPage } from './pages/ArticlesPage'
import { ArticlePage } from './pages/ArticlePage'
import { NotFoundPage } from './pages/NotFoundPage'

// Lazy-loaded so the heavy @react-pdf/renderer bundle only downloads when a
// visitor actually opens the table builder.
const TablePage = lazy(() =>
  import('./pages/TablePage').then((m) => ({ default: m.TablePage })),
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'calculator', element: <CalculatorPage /> },
      { path: 'articles', element: <ArticlesPage /> },
      { path: 'articles/:slug', element: <ArticlePage /> },
      { path: 'table', element: <TablePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
