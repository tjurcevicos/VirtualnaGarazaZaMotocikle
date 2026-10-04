import { useState } from 'react'
import './App.css'

import Sidebar from './components/Sidebar'

import Home from './pages/Home'
import Vozila from './pages/Vozila'
import Servisi from './pages/Servisi'
import Gorivo from './pages/Gorivo'
import Troskovi from './pages/Troskovi'
import Podsjetnici from './pages/Podsjetnici'

function App() {
  const [activePage, setActivePage] = useState('home')

  function renderPage() {
    switch (activePage) {
      case 'vozila':
        return <Vozila />

      case 'servisi':
        return <Servisi />

      case 'gorivo':
        return <Gorivo />

      case 'troskovi':
        return <Troskovi />

      case 'podsjetnici':
        return <Podsjetnici />

      case 'home':
      default:
        return <Home />
    }
  }

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App