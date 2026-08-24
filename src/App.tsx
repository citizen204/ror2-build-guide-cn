import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SurvivorPage } from './pages/SurvivorPage'
import './styles/tokens.css'
import './styles/global.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/survivors/:slug" element={<SurvivorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
