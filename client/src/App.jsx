import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import AuthPage from './pages/AuthPage/AuthPage'
import Dashboard from './pages/Dasboard/Dashboard'

function App() {
  return(
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
