import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import AuthPage from './pages/AuthPage/AuthPage'
import Dashboard from './pages/Dasboard/Dashboard'


function App() {
  const URL = 'http://localhost:3000';
  return(
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage URL={URL}/>} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
