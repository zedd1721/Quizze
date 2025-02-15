import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import AuthPage from './pages/AuthPage/AuthPage'

function App() {
  return(
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
