/* eslint-disable react-refresh/only-export-components --
   This module intentionally exports the router config, not a component. */
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CalculatorPage } from './pages/CalculatorPage'
import { ArticlesPage } from './pages/ArticlesPage'
import { ArticlePage } from './pages/ArticlePage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'calculator', element: <CalculatorPage /> },
      { path: 'memorization', element: <ArticlesPage /> },
      { path: 'memorization/:slug', element: <ArticlePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
