import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SiteFooter } from './components/SiteFooter'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SurvivorPage } from './pages/SurvivorPage'
import './styles/tokens.css'
import './styles/global.css'

function RouteTransitionManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.querySelector<HTMLElement>('[data-page-title]')?.focus({ preventScroll: true })
  }, [pathname])

  return null
}

function App() {
  return (
    <>
      <RouteTransitionManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/survivors/:slug" element={<SurvivorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
    </>
  )
}

export default App
